const path= require('path');
const express= require('express');

const publicPath = path.join(__dirname,'../public');

console.log("setting public path to ["+publicPath+"]")

var app=express();

app.use(express.static(publicPath));

app.listen(3000,()=>{ console.log('server is listing on 3000')});