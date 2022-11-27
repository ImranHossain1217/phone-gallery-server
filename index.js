const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_User}:${process.env.DB_Password}@cluster0.vwrnpfj.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const categoryCollection = client
      .db("phoneGallery")
      .collection("categories");
      const bookingCollection = client.db("phoneGallery").collection("bookings");

    app.get("/category", async (req, res) => {
      const query = {};
      const cursor = categoryCollection.find(query);
      const category = await cursor.toArray();
      res.send(category);
    });

    app.get("/category/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await categoryCollection.findOne(query);
      res.send(result);
    });

    app.get('/bookings',async(req,res)=> {
       const email = req.query.email;
       const query = {email:email};
       const bookings = await bookingCollection.find(query).toArray();
       res.send(bookings);
    })

    app.post('/bookings', async(req,res)=> {
      const booking = req.body;
      const result = await bookingCollection.insertOne(booking);
      res.send(result);
    });
    
  } finally {
  }
}

run().catch((err) => console.error(err));

app.get("/", (req, res) => {
  res.send("Phone gallery server Running..!!!");
});

app.listen(port, () => {
  console.log(`Phone Gallery server running on ${port}`);
});
