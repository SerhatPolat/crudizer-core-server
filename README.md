### Set up environment variables

Set `MONGODB_URI` variable on `.env` file (which one is included in .gitignore):

- `MONGODB_URI` - Your MongoDB connection string. If you are using [MongoDB Atlas](https://mongodb.com/atlas) you can find this by clicking the "Connect" button for your cluster.

<hr>

### Set up dynamic parts

```js
// In my Mongo database, 'company' is my db name and 'products' is my collection name. You should update that parts with your db and collection namings.

const itemsCollection = client.db("company").collection("products");
```

```js
// When you adding new endpoints you just need to change endpoint itself ("/api/items") and itemsCollection value.

// NOTE: If you want to add a different behavior to your new endpoint of course you should change other things

app.post("/api/items", async (req, res) => {
  try {
    const newItem = req.body;
    const result = await itemsCollection.insertOne(newItem);
    res.status(201).json(result.ops[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

<hr>

Install dependencies:

```bash
npm install
```

Run server:

```bash
node app.js
```
