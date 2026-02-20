const fs = require("fs");
const csv = require("csv-parser");
const { Pool } = require("pg");
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

const locationsMap = {};

fs.createReadStream("Reviews.csv")
  .pipe(csv())
  .on("data", async (row) => {
    try {
      const { Located_City, Location_Name, Location_Type,
              User_ID, Rating, Title, Text, Published_Date } = row;

      // Insert location only once, skip if already exists
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
          // Location already existed, fetch its id
          const existing = await pool.query(
            `SELECT id FROM locations WHERE name = $1`, [Location_Name]
          );
          locationsMap[Location_Name] = existing.rows[0].id;
        }
      }

      const locationId = locationsMap[Location_Name];

      await pool.query(
        `INSERT INTO reviews 
         (location_id, user_id, rating, title, text, published_date)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [locationId, User_ID, Rating, Title, Text, Published_Date]
      );

    } catch (err) {
      console.error(err);
    }
  })
  .on("end", () => {
    console.log("CSV Imported Successfully!");
  });