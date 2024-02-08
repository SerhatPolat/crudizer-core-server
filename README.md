# crudizer-core

crudizer-core is a fullstack CRUD web app kickstarter which one is includes common essentials:

- E2E data listing (w/ pagination) (Mongo database => Node.js backend => Nuxt 3 & Axios API requests => UI)
- Ready to use E2E base64 image dataflow
- Create/Update/Delete transactions for items
- Item detail page & related logics
- Ready to use UI for essentials (w/ responsive styling and config based color usage)

<br>
<hr>
<br>

### Set up environment variables

Set `MONGODB_URI` variable on `.env` file (which one is included in .gitignore):

- `MONGODB_URI` - Your MongoDB connection string. If you are using [MongoDB Atlas](https://mongodb.com/atlas) you can find this by clicking the "Connect" button for your cluster.

<br>
<hr>
<br>

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
    res.status(201).json({ message: "Item created successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

<br>
<hr>
<br>

### About get requests

There is 3 options for read transactions of items. You can use the right one according to your needs for different situations.

- Get all items together
- Get items with a pagination structure
- Just get one item with id

<br>
<hr>
<br>

_This is **backend** repo of crudizer-core, you can reach to **frontend** from here:_ [crudizer-core-client](https://github.com/SerhatPolat/crudizer-core-client)

<br>
<hr>
<br>

Install dependencies:

```bash
npm install
```

Run server:

```bash
node app.js
```
