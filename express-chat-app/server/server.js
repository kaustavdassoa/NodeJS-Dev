const path= require('path');
const express= require('express');

const publicPath = path.join(__dirname,'../public');

console.log("setting public path to ["+publicPath+"]")

var app=express();
app.set('port', (process.env.PORT || 5000))

app.use(express.static(publicPath));

app.listen(app.get('port'),()=>{ console.log('server is listing on '+app.get('port'))});