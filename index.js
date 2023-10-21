const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, Object, ObjectId } = require("mongodb");

const app = express();
const port = process.env.PORT || 5000;

// middleweare
app.use(cors());
app.use(express.json());

console.log(process.env.DB_USER);
console.log(process.env.DB_PASS);

const uri = `mongodb+srv://fashionServer:H1BjgpL5Hbnp41Ph@cluster0.npoax.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const productCollection = client.db("productsDB").collection("products");
    const addCartCollection = client.db("productsDB").collection("cart");
    app.post("/cart", async (req, res) => {
      const newProducts = req.body;
      console.log(newProducts);

      const result = await addCartCollection.insertOne(newProducts);
      res.send(result);
    });

    app.get("/cart", async (req, res) => {
      const newProducts = req.body;
      console.log(newProducts);

      const result = await addCartCollection.find(newProducts).toArray();
      res.send(result);
    });

    app.get("/products_by_brand/:brand", async (req, res) => {
      const brand = req.params.brand;
      console.log(brand);
      const query = { brand: brand };
      // console.log("query" + query);
      const result = await productCollection.find(query).toArray();
      console.log(result);
      res.send(result);
    });

    app.get("/products_by_sneakers", async (req, res) => {
      const type = req.params.type;
      console.log(type);
      const query = { type: "Sneakers" };
      // console.log("query" + query);
      const result = await productCollection.find(query).toArray();
      console.log(result);
      res.send(result);
    });

    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: new ObjectId(id) };
      // console.log("query" + query);
      // const result = await productCollection.findOne(query);
      const result = await productCollection.findOne(query);
      console.log(result);
      res.send(result);
      // product details
    });

    app.delete("/cart/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: new ObjectId(id) };
      // console.log("query" + query);
      // const result = await productCollection.findOne(query);
      const result = await addCartCollection.deleteOne(query);
      console.log(result);
      res.send(result);
      // product details
    });

    app.put("/products/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const filter = { _id: new ObjectId(id) };
      const options = { upset: true };
      const updatedProduct = req.body;
      const product = {
        $set: {
          photo: updatedProduct.photo,
          brand: updatedProduct.brand,
          name: updatedProduct.name,
          price: updatedProduct.price,
          type: updatedProduct.type,
          description: updatedProduct.description,
          rating: updatedProduct.rating,
        },
      };
      // console.log("query" + query);
      // const result = await productCollection.findOne(query);
      const result = await productCollection.updateOne(
        filter,
        product,
        options
      );
      console.log(result);
      res.send(result);
      // product details
    });

    app.post("/products", async (req, res) => {
      const newProducts = req.body;
      console.log(newProducts);
      const result = await productCollection.insertOne(newProducts);
      res.send(result);
    });
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("fashion server is running");
});

app.listen(port, (req, res) => {
  console.log(`running ${port}`);
});
