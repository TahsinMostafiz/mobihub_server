const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 5000;

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
  res.send("MobiHub Server Running");
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster1.b8fg4md.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    //Database Collections
    const categoriesCollections = client
      .db("mobiHub")
      .collection("categoriesCollection");
    const phonesCollections = client.db("mobiHub").collection("phones");
    const bookingsCollections = client.db("mobiHub").collection("bookings");

    // categories get api
    app.get("/categories", async (req, res) => {
      const query = {};
      const result = await categoriesCollections.find(query).toArray();
      res.send(result);
    });

    app.get("/category/:id", async (req, res) => {
      const id = req.params.id;
      const query = {
        category_id: id,
      };
      const result = await phonesCollections.find(query).toArray();
      res.send(result);
    });

    //booking get api
    app.get("/bookings", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const bookings = await bookingsCollections.find(query).toArray();
      res.send(bookings);
    });

    // bookings post api
    app.post("/bookings", async (req, res) => {
      const booking = req.body;
      const query = {
        name: booking.name,
        email: booking.email,
      };
      const alreadyBooked = await bookingsCollections.find(query).toArray();

      if (alreadyBooked.length) {
        const message = `You already booked ${booking.name}`;
        return res.send({ acknowledged: false, message });
      }
      const result = await bookingsCollections.insertOne(booking);
      res.send(result);
    });
  } finally {
  }
}
run().catch((err) => console.log(err));

app.listen(port, () => {
  console.log(`MobiHub server running on port ${port}`);
});
