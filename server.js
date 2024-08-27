import express from 'express';
import {product} from './data.js';
import dotenv from 'dotenv';
dotenv.config();
const app = express();
const port=process.env.PORT || 5000;
app.get('/product',(req,res)=>{
    res.send(product);

})

app.listen(port,()=>{
    console.log('server is running on port '+port);
})