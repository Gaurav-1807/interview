
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const connect = require('./config/db');
const router = require('./routes/route');
const app = express();
app.set("view engine", "ejs")

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(router)
app.listen(3000,()=>{
    connect()
    console.log('listening on port 3080');
    
})