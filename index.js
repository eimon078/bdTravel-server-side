const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()
const app = express();
const port = process.env.PORT || 7000;


app.use(cors());
app.use(express.json());

//MongoDB URI
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nxj01.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
// console.log(uri);

//Create Mongodb Client
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('bdTravel');
        //places
        const placesCollection = database.collection('places')
        const bookingCollection = database.collection('booking')

        //places post Api
        app.post('/places', async (req, res) => {
            const singlePlace = req.body
            console.log('post Hiting', singlePlace)
            const result = await placesCollection.insertOne(singlePlace);
            res.json(result);
        })

        //get all places api
        app.get('/places', async (req, res) => {
            const cursor = placesCollection.find({});
            const places = await cursor.toArray();
            res.send(places);
        })

        //get single Place
        app.get('/places/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            console.log(id, query);
            const place = await placesCollection.findOne(query);
            console.log(place)
            res.json(place);

        })

        //booking post api
        app.post('/booking', async (req, res) => {
            const singlebooking = req.body
            console.log('post booking', singlebooking)
            const result = await bookingCollection.insertOne(singlebooking);
            res.json(result);
        })

        // match booking api 
        app.get('/booking/:id', async (req, res) => {
            const id = req.params.id;
            const query = { email: id }
            console.log(id, query);
            const cursor = bookingCollection.find(query);
            const result = await cursor.toArray();
            console.log(result)
            res.json(result);

        })
        // all booking api 
        app.get('/booking', async (req, res) => {
            const cursor = bookingCollection.find({});
            const allBooking = await cursor.toArray();
            res.send(allBooking);

        })

        //Update status booking api
        app.put('/booking/:id', async (req, res) => {
            const id = req.params.id;
            const updateStatus = req.body;
            console.log(updateStatus);
            const filter = { _id: ObjectId(id) };
            const updateDoc = {
                $set: {
                    status: updateStatus.status

                },
            };

            const options = { upsert: true };
            const result = await bookingCollection.updateOne(filter, updateDoc, options);
            res.json(result);

        })

        //delete booking api
        app.delete('/booking/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const query = { _id: ObjectId(id) };
            const result = await bookingCollection.deleteOne(query);
            res.json(result);
        })
    }
    finally {
        // await client.close()
    }

}

run().catch(console.dir)

//Request Method
app.get('/', (req, res) => {
    res.send("Running bdTravle Server");
})

app.listen(port, () => {
    console.log("Listing port:", port);
})