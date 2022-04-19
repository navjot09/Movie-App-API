const express = require('express');
const connectToMongo = require('./db');
const cors = require('cors');
require('dotenv').config();
connectToMongo();

const app = express();
const PORT = process.env.PORT || 5000

console.log(process.env);


app.use(cors());

app.use(express.json())

app.get('/', (req, res) =>{
    res.send("Hello World");
})

app.use('/auth', require('./routes/auth'));
app.use('/myList', require('./routes/myList'))

app.listen(PORT, ()=>{
    console.log(PORT);
})