const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors())
app.use(express.json());


// brand-shop
// OebKBOMoYPN01fZE



const uri = "mongodb+srv://brand-shop:OebKBOMoYPN01fZE@cluster0.acqlwci.mongodb.net/?retryWrites=true&w=majority";

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
    await client.connect();
const productCollection = client.db('brandShopDB').collection('brandShop')
const cartCollection = client.db('brandShopDB').collection('cartShop')



// add product
app.post('/product',async(req,res)=>{
    const newProduct = req.body;
    console.log(newProduct);
    const result = await productCollection.insertOne(newProduct)
    res.send(result)
})

// get from db
app.get('/product',async(req,res)=>{
    const cursor = productCollection.find();
    const result= await cursor.toArray();
    res.send(result)
})

// delete
app.delete('/cart/:id',async(req,res)=>{
  const id = req.params.id;
  const query = {_id: id}
  const result = await cartCollection.deleteOne(query);
  res.send(result)
})

app.get('/cart/:id', async (req, res) => {
  const id = req.params.id;
  const query = { id }
  const result = await cartCollection.findOne(query)
  res.send(result)
})



// add to cart
app.post('/cart', async (req, res) => {
  const cartProduct = req.body;
  const productDetails = await cartCollection.findOne({_id:cartProduct._id})
  if(productDetails){
    return res.send({msg:'Already Added'})
  }
  const result = await cartCollection.insertOne(cartProduct)
  res.send(result)
})

app.get('/cart', async (req, res) => {
  const cursor = await cartCollection.find();
  const result = await cursor.toArray();
  res.send(result)
})


// update product
app.get('/product/:id',async(req,res)=>{
  const id = req.params.id;
  const query = {_id:new ObjectId(id)}
  const result = await productCollection.findOne(query)
  res.send(result)
})
app.put('/product/:id', async(req,res)=>{
  const id = req.params.id;
  const filter = {_id: new ObjectId(id)}
  const options = {upsert:true};
  const updatedProduct = req.body; 
  const product = {
    $set:{
      image:updatedProduct.image, brandName:updatedProduct.brandName, name:updatedProduct.name, rating:updatedProduct.rating,type:updatedProduct.type, price:updatedProduct.price, description:updatedProduct.description
    }
  }


  const result = await productCollection.updateOne(filter,product,options)
  res.send(result)
})



app.get('/product/id/:id',async(req,res)=>{
  const id=req.params.id;
  const query={_id:new ObjectId(id)}
  const result=await productCollection.findOne(query)
   res.send(result)
})

app.get('/product/brand/:brandName',async(req,res)=>{
  const brandName = req.params.brandName;
  const query = {brandName}
  const result = await productCollection.find(query).toArray()
  res.send(result)
})


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/',(req,res)=>{
    res.send('brand shop server is running')
})

app.listen(port,()=>{
    console.log(`Brand shop is running on port:${port}`);
})