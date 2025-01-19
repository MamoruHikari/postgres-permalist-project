import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "permalist",
  password: "japanfuture",
  port: 5432
});

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM items ORDER BY id ASC");
    res.render("index.ejs", {
      listTitle: "Today",
      listItems: result.rows
    });
  } catch (err) {
    console.log("Error fetching items:", err);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/add", async (req, res) => {
  const item = req.body.newItem;

  if (item) {
    try {
      await db.query("INSERT INTO items (title) VALUES ($1)", [item]);
      res.redirect("/");
    } catch (err) {
      console.log("Error adding item:", err);
      res.status(500).redirect("/");
    }
  } else {
    console.log("Error: Item cannot be empty");
    res.status(400).redirect("/");
  }
});

app.post("/edit", async (req, res) => {
  const userID = req.body.updatedItemId;
  const updatedItem = req.body.updatedItemTitle;

  try {
    await db.query("UPDATE items SET title = $1 WHERE id = $2", [updatedItem, userID]);
    res.redirect("/");
  } catch (err) {
    console.log("Error editing item:", err);
    res.status(500).redirect("/");
  }
});

app.post("/delete", async (req, res) => {
  const userID = req.body.deleteItemId;

  try {
    await db.query("DELETE FROM items WHERE id = $1", [userID]);
    res.redirect("/");
  } catch (err) {
    console.log("Error deleting item:", err);
    res.status(500).redirect("/");
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
