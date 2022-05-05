const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;

const app = express();

//middleware 
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cck3g.mongodb.net/myFirstDatabase?retryWrites=true&w=majority` ;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run (){
    try{
        await client.connect();
        const laptopCollection = client.db('laptops').collection('inventories');

        app.get('/inventory', async (req, res) => {
            const query = {};
            const cursor = laptopCollection.find(query);
            const inventories = await cursor.toArray();
            res.send(inventories);
        });

        app.get('/inventory/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const inventory = await laptopCollection.findOne(query);
            res.send(inventory);
        });

        // Post
        app.post('/inventory', async(req, res) => {
            const newItem = req.body;
            const result = await laptopCollection.insertOne(newItem);
            res.send(result);
        });

        // DELETE 
        app.delete('/inventory/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await laptopCollection.deleteOne(query);
            res.send(result);
        })


    }
    finally{
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Running Laptop Inventories Server');
});

app.listen(port, () => {
    console.log('Listening to the port', port);
});


