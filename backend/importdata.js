const fs = require("fs");
const csv = require("csv-parser");
const { Pool } = require("pg");
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

const pool = new Pool({
  host: process.env.NEON_DB_HOST,
  user: process.env.NEON_DB_USER,
  password: process.env.NEON_DB_PASSWORD,
  database: process.env.NEON_DB_NAME,
  port: process.env.NEON_DB_PORT,
  ssl: { rejectUnauthorized: false },
});

const BATCH_SIZE = 500;

async function batchInsert(table, columns, rows, onConflict = "") {
  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const batch = rows.slice(i, i + BATCH_SIZE);
    const values = [];
    const params = [];
    let paramIdx = 1;
    for (const row of batch) {
      const placeholders = row.map(() => `$${paramIdx++}`).join(", ");
      values.push(`(${placeholders})`);
      params.push(...row);
    }
    await pool.query(
      `INSERT INTO ${table} (${columns.join(", ")}) VALUES ${values.join(", ")} ${onConflict}`,
      params
    );
    console.log(`  ${table}: inserted batch up to row ${i + batch.length}`);
  }
}

async function importData() {
  const rows = [];

  await new Promise((resolve, reject) => {
    fs.createReadStream("Reviews.csv")
      .pipe(csv())
      .on("data", (row) => rows.push(row))
      .on("end", resolve)
      .on("error", reject);
  });

  console.log(`Read ${rows.length} rows. Building locations...`);

  // Collect unique locations
  const uniqueLocations = {};
  for (const row of rows) {
    const { Location_Name, Located_City, Location_Type } = row;
    if (!uniqueLocations[Location_Name]) {
      uniqueLocations[Location_Name] = [Location_Name, Located_City, Location_Type];
    }
  }

  const locationRows = Object.values(uniqueLocations);
  console.log(`Inserting ${locationRows.length} unique locations...`);
  await batchInsert("locations", ["name", "city", "type"], locationRows, "ON CONFLICT DO NOTHING");

  // Fetch all location IDs
  const { rows: locRows } = await pool.query("SELECT id, name FROM locations");
  const locMap = {};
  for (const r of locRows) locMap[r.name] = r.id;

  console.log(`Inserting reviews...`);
  const reviewRows = rows
    .filter(row => locMap[row.Location_Name])
    .map(row => [
      locMap[row.Location_Name],
      row.User_ID,
      row.Rating,
      row.Title,
      row.Text,
      row.Published_Date
    ]);

  await batchInsert("reviews", ["location_id", "user_id", "rating", "title", "text", "published_date"], reviewRows, "");

  const { rows: counts } = await pool.query("SELECT (SELECT COUNT(*) FROM locations) AS locs, (SELECT COUNT(*) FROM reviews) AS revs");
  console.log(`Done! Locations: ${counts[0].locs}, Reviews: ${counts[0].revs}`);
  await pool.end();
}

importData().catch(console.error);