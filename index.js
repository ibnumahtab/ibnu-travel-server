const express = require('express');
const app = express();
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();
app.use(express.json());

const port = process.env.PORT || 5000;
// middleware
var cors = require('cors');
app.use(cors());

// MongoDB Connect
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dgqlg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

async function run() {
    try {
        await client.connect();
        const database = client.db('IbnuTravel');
        const coursesCollection = database.collection('services');
        const ordersCollection = database.collection('orders');

        //get all services
        app.get('/services', async (req, res) => {
            const cursor = coursesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        });

        //get all orders
        app.get('/orders', async (req, res) => {
            const cursor = ordersCollection.find({});
            const orders = await cursor.toArray();
            res.send(orders);
        });

        // get single service details get api
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await coursesCollection.findOne(query);
            res.json(result);
        });

        // post api add single service
        app.post('/services', async (req, res) => {
            const newServices = req.body;
            const result = await coursesCollection.insertOne(newServices);
            res.json(result);
        });

        // post api add single order
        app.post('/orders', async (req, res) => {
            const newOrders = req.body;
            const result = await ordersCollection.insertOne(newOrders);
            res.json(result);
        });

        // update user orders api
        app.put('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    status: true,
                },
            };
            const result = await ordersCollection.updateOne(
                query,
                updateDoc,
                options
            );
            res.json(result);
        });

        // orders delete
        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await ordersCollection.deleteOne(query);
            console.log(result);
            res.json(result);
        });
    } finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Running Node Server');
});

app.listen(port, () => {
    console.log(`Running Node Server at http://localhost:${port}`);
});
