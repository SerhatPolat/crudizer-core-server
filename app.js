const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const cors = require("cors");

const app = express();
const port = 3001;

const uri = "-";
const client = new MongoClient(uri, {
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
app.use(express.json());

const itemsCollection = client.db("company").collection("products");

// Create
app.post("/api/products", async (req, res) => {
  try {
    const newItem = req.body;
    const result = await itemsCollection.insertOne(newItem);
    res.status(201).json(result.ops[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Read (all items)
app.get("/api/products", async (req, res) => {
  try {
    const items = await itemsCollection.find().toArray();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update
app.put("/api/products/:id", async (req, res) => {
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
app.delete("/api/products/:id", async (req, res) => {
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
