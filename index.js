const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");
require('dotenv').config();

// middlewares
app.use(cors())
app.use(express.json());
// mongodb

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.user}:${process.env.pass}@cluster0.evakdll.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection

    // database collection
    const todosCollection = client.db("Todos").collection("myTodos");

    app.post("/todos", async(req,res)=>{
      const todo = req.body;
      const result = await todosCollection.insertOne(todo);
      res.send(result);
    })
    app.get("/todos", async(req,res)=>{
      const request = req.query;
      let query = {};
      if(request.email){
        query = {
          user: request.email
        }
      }
      const result = await todosCollection.find(query).toArray();
      res.send(result);
    })

    app.delete("/todos/:id", async(req,res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await todosCollection.deleteOne(query);
      res.send(result);
    })
    app.patch("/todos/:id", async(req,res)=>{
      const id = req.params.id;
      const updatedDoc = {
        $set: {
          status: "completed",
        }
      }
      const query = {_id: new ObjectId(id)};
      const result = await todosCollection.updateOne(query, updatedDoc);
      res.send(result);
    })



    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get("/", (req,res)=>{
    res.send("Taskboook app server is running");
})

app.listen(port, ()=>{
    console.log(`Server is running on ${port}`);
})