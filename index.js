const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;
const app = express();

//middleware
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hgh42.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        // console.log('connected to db');
        const database = client.db("carMechanics");
        const servicesCollection = database.collection("services");

        //GET API
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        });

        //GET single service
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            console.log('getting the service', id);
            const query = { _id: ObjectId(id) };
            const service = await servicesCollection.findOne(query);
            res.json(service);
        });

        //POST API
        app.post('/services', async (req, res) => {
            const service = req.body;
            console.log('hits post req', service);

            const result = await servicesCollection.insertOne(service);
            console.log(result);
            res.json(result);
        });

        //DELETE API

        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await servicesCollection.deleteOne(query);
            res.json(result)
        })

    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello!! From car mechanics server');
});

app.listen(port, () => {
    console.log('Listening from port', port);
});


//CarMechanicsUser 
//nrEmO62KyaYoyMO3