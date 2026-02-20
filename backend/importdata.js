const fs = require("fs");
const csv = require("csv-parser");
const { Pool } = require("pg");
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

const pool = new Pool({
  host: process.env.RENDER_DB_HOST,
  user: process.env.RENDER_DB_USER,
  password: process.env.RENDER_DB_PASSWORD,
  database: process.env.RENDER_DB_NAME,
  port: process.env.RENDER_DB_PORT,
  ssl: { rejectUnauthorized: false },
});

async function importData() {
  const rows = [];

  // Read all rows first
  await new Promise((resolve, reject) => {
    fs.createReadStream("Reviews.csv")
      .pipe(csv())
      .on("data", (row) => rows.push(row))
      .on("end", resolve)
      .on("error", reject);
  });

  console.log(`Read ${rows.length} rows from CSV. Importing...`);

  const locationsMap = {};
  let inserted = 0;
  let errors = 0;

  for (const row of rows) {
    const { Located_City, Location_Name, Location_Type,
            User_ID, Rating, Title, Text, Published_Date } = row;
    try {
      // Insert location only once
      if (!locationsMap[Location_Name]) {
        const res = await pool.query(
          `INSERT INTO locations (name, city, type)
           VALUES ($1, $2, $3)
           ON CONFLICT (name) DO NOTHING
           RETURNING id`,
          [Location_Name, Located_City, Location_Type]
        );
        if (res.rows.length > 0) {
          locationsMap[Location_Name] = res.rows[0].id;
        } else {
          const existing = await pool.query(
            `SELECT id FROM locations WHERE name = $1`, [Location_Name]
          );
          locationsMap[Location_Name] = existing.rows[0].id;
        }
      }

      const locationId = locationsMap[Location_Name];

      await pool.query(
        `INSERT INTO reviews (location_id, user_id, rating, title, text, published_date)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [locationId, User_ID, Rating, Title, Text, Published_Date]
      );

      inserted++;
      if (inserted % 1000 === 0) console.log(`Inserted ${inserted} reviews...`);
    } catch (err) {
      errors++;
      if (errors <= 5) console.error("Row error:", err.message);
    }
  }

  console.log(`Done! Inserted ${inserted} reviews, ${errors} errors.`);
  await pool.end();
}

importData().catch(console.error);