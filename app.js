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

// // Read (all items) without pagination
// app.get("/api/items", async (req, res) => {
//   try {
//     const items = await itemsCollection.find().toArray();
//     res.json(items);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// Read items with pagination
app.get("/api/items", async (req, res) => {
  const ITEMS_PER_PAGE = 4; // You can update this according to your requirements

  try {
    // Parse the page query parameter from the request, default to 1 if not provided
    const page = parseInt(req.query.page, 10) || 1;

    // Calculate the skip value based on the current page and items per page
    const skip = (page - 1) * ITEMS_PER_PAGE;

    const items = await itemsCollection
      .find()
      .skip(skip)
      .limit(ITEMS_PER_PAGE)
      .toArray();

    // Calculate the total number of items in the collection
    const totalItems = await itemsCollection.countDocuments();

    // Calculate the total number of pages
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

    res.json({
      items,
      currentPage: page,
      totalPages,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Read one item
app.get("/api/items/:id", async (req, res) => {
  try {
    const itemId = req.params.id;
    const item = await itemsCollection.findOne({ _id: new ObjectId(itemId) });
    res.json(item);
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
