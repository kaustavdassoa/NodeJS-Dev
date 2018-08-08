const path    = require('path');
const express = require('express');
const http  = require('http');
const socketIO  = require('socket.io');

const {generateMessage,generateLocationMessage} = require('./utils/message.js')

const publicPath = path.join(__dirname,'../public');
var clientCount=0;


console.log("setting public path to ["+publicPath+"]")

var app=express();
var server=http.createServer(app);
var io = socketIO(server);



io.on('connection', (socket) => {

  clientCount=clientCount+1;
  console.log('New user connected to the server [client count='+clientCount+"]");
   
  //Broadcasting event 
  socket.broadcast.emit('newMessage',generateMessage("chat-server","New user joined current usercount :"+clientCount,clientCount));
  
  //welcome event
  socket.emit("newMessage",generateMessage("chat-server","welcome to  Node Express Chat App",clientCount));
  
  //receiving client event
  socket.on('createMessage',(message,callback) =>{
	  console.log("received client event"+"welcome "+message.from+" message received-"+message.text);
	  io.emit("newMessage",generateMessage("user",message.text,clientCount));
	  callback();
  });

   socket.on('createLocationMessage', (coords) => {
   console.log("Inside createLocationMessage event");
   console.log(JSON.stringify(generateLocationMessage('chat-server', coords.latitude, coords.longitude),undefined,2));
   io.emit('newLocationMessage', generateLocationMessage('chat-server', coords.latitude, coords.longitude));
  });
	

  
  //On disconecting 
  socket.on('disconnect', () => {
	clientCount=clientCount-1;
	console.log('User was disconnected from the server [client count='+clientCount+"]");
  });
});

app.get("/usercount",(req,res)=>{
	
	res.status(200).send(`${clientCount}`);
	
});

app.use(express.static(publicPath));
app.set('port', (process.env.PORT || 3000))
//app.listen(app.get('port'),()=>{ console.log('server is listing on '+app.get('port'))}); // in order to make socket to listen to a specific port need to use server.listen(port-number)
server.listen(app.get('port'),()=>{ console.log('server is listing on '+app.get('port'))});


module.exports =  {clientCount};