const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");
const uploadImage = require("./uploadImage");

//middleware
app.use(cors());
app.use(express.json());

app.post("/uploadImage", uploadImage.single("file"), async (req, res) => {
  try {
    let data = {};
    if (req.file) {
      data.url = req.file.location;
    }
    res.json(data);
  } catch (err) {
    console.error(err.message);
  }
});

app.post("/images", async (req, res) => {
  const actorsArray = req.body.actors.split(",").map((actor) => actor.trim());

  try {
    const { description, color, frame, url, title, director, dop, year } =
      req.body;
    const newImage = await pool.query(
      "INSERT INTO image (description, color, frame, url, title, director, dop, actors, year) VALUES ($1, $2, $3, $4, $5, $6, $7,$8, $9) RETURNING *",
      [description, color, frame, url, title, director, dop, actorsArray, year]
    );
    res.json(newImage.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

app.get("/images", async (req, res) => {
  try {
    const allImages = await pool.query("SELECT * FROM image ");
    res.json(allImages.rows);
  } catch (err) {
    console.error(err.message);
  }
});

app.get("/images/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const image = await pool.query("SELECT * FROM image WHERE image_id = $1", [
      id,
    ]);

    res.json(image.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

app.put("/images/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { description } = req.body;
    const updateImage = await pool.query(
      "UPDATE image SET description = $1 WHERE image_id = $2",
      [description, id]
    );
    if (res.statusCode === 200) {
      res.json("Image was updated!");
    }
  } catch (err) {
    console.error(err.message);
  }
});

app.delete("/images/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleteImage = await pool.query(
      "DELETE FROM image WHERE image_id = $1",
      [id]
    );
    req.json("Image was deleted!");
  } catch (err) {}
});

app.listen(5000, () => {
  console.log("server has started on port 5000");
});
