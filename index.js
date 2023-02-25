const express = require('express');
const cors= require('cors');
const PORT=process.env.PORT || 8080; 
const connect= require('./src/config/db');


const app = express();
app.use(cors());
app.use(express.json());


app.get('/',(req,res)=>{
    res.send("hello world!");
})

app.listen(PORT,async(req,res)=>{
    try {
        await connect();
        console.log(`http://localhost:${PORT}`);
    } catch (error) {
        // return  res.send(error)
        console.log(error.message);
    }
});
