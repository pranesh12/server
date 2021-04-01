const express = require("express");
const MongoClient = require("mongodb").MongoClient;
const cors = require("cors");
require("dotenv").config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kjnut.mongodb.net/techStore?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

client.connect((err) => {
  const ProductCollection = client.db("techStore").collection("products");
  const OrderCollection = client.db("techStore").collection("orders");

  //Products
  app.post("/addBook", (req, res) => {
    ProductCollection.insertOne(req.body).then((result) => {
      res.send(result.insertedCount);
    });
  });
  //Reading Books Data from Database
  app.get("/AllBooks", (req, res) => {
    ProductCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });

  // Order part
  app.post("/orders", (req, res) => {
    OrderCollection.insertOne(req.body).then((err, result) => {
      res.send(result);
    });
  });
  app.get("/orders", (req, res) => {
    const email = `${req.query.email}`;
    OrderCollection.find({ email: req.query.email }).toArray(
      (err, documents) => {
        res.send(documents);
      }
    );
  });
  console.log("database connected");
});

app.listen(5000, () => {
  console.log("Port is running on 5000");
});
