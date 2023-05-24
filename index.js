const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");

//middleware
app.use(cors());
app.use(express.json());

app.post("/images", async (req, res) => {
  try {
    const { description, color, frame, url } = req.body;
    const newImage = await pool.query(
      "INSERT INTO image (description, color, frame, url) VALUES ($1, $2, $3, $4) RETURNING *",
      [description, color, frame, url]
    );
    res.json(newImage.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

app.listen(5000, () => {
  console.log("server has started on port 5000");
});
