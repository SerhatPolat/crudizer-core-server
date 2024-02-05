const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = 3001;

const dbConnectionStr = process.env.MONGODB_URI;

const client = new MongoClient(dbConnectionStr, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function connectToDatabase() {
  try {
    await client.connect();
    console.log("Connected to MongoDB Atlas");
  } catch (error) {
    console.error("Error connecting to MongoDB Atlas:", error.message);
    process.exit(1);
  }
}

connectToDatabase();

app.use(cors());
app.use(express.json({ limit: "200mb" })); // limit parameter added to prevent 413 error (related with base64 images)

const itemsCollection = client.db("company").collection("products");

// Create
app.post("/api/items", async (req, res) => {
  try {
    const newItem = req.body;
    const result = await itemsCollection.insertOne(newItem);
    res.status(201).json({ message: "Item created successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Read (all items)
app.get("/api/items", async (req, res) => {
  try {
    const items = await itemsCollection.find().toArray();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update
app.put("/api/items/:id", async (req, res) => {
  try {
    const itemId = req.params.id;
    const updatedItem = await itemsCollection.findOneAndUpdate(
      { _id: new ObjectId(itemId) },
      { $set: req.body },
      { returnDocument: "after" }
    );
    res.json(updatedItem.value);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete
app.delete("/api/items/:id", async (req, res) => {
  try {
    const itemId = req.params.id;
    await itemsCollection.deleteOne({ _id: new ObjectId(itemId) });
    res.json({ message: "Item deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
