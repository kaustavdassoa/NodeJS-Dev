const path    = require('path');
const express = require('express');
const http  = require('http');
const socketIO  = require('socket.io');

const {isRealString} = require('./utils/validation');
const {generateMessage,generateLocationMessage} = require('./utils/message.js')
const {Users} = require('./utils/users');

const publicPath = path.join(__dirname,'../public');
var clientCount=0;


console.log("setting public path to ["+publicPath+"]")

var app=express();
var server=http.createServer(app);
var io = socketIO(server);
var users = new Users();


io.on('connection', (socket) => {

  var _id=socket.id;	
  clientCount=clientCount+1;
  console.log('New user connected to the server [client count='+clientCount+"]");
   
  
  
  socket.on('join', (params, callback) => {
    if (!isRealString(params.name) || !isRealString(params.room)) {
      return callback('Name and room name are required.');
    }
	socket.join(params.room);
    users.removeUser(socket.id);
    users.addUser(socket.id, params.name, params.room);
    io.to(params.room).emit('updateUserList', users.getUserList(params.room));

	
	
	//welcome message to the connected user
    socket.emit("newMessage",generateMessage("chat-server",`welcome ${params.name} to chat room - ${params.room}`,clientCount));
	//Broadcasting event to a specific room
    socket.broadcast.to(params.room).emit('newMessage',generateMessage("chat-server",`New user '${params.name}' has join the room`));
	
    callback();
  });

  
  
  
 
  
  //receiving createMessage event
  socket.on('createMessage',(message,callback) =>{
	  console.log("received client event"+"welcome "+message.from+" message received-"+message.text);
	// io.emit("newMessage",generateMessage(message.from,message.text,clientCount));
	 io.emit("newMessage",generateMessage(users.getUser(_id).name,message.text,clientCount));
	  callback();
  });

  //receiving createLocationMessage	
   socket.on('createLocationMessage', (coords) => {
   console.log("Inside createLocationMessage event");
   console.log(users.getUser(_id).name);
  // console.log(JSON.stringify(generateLocationMessage(users.getUser(_id).name, coords.latitude, coords.longitude),undefined,2));
   io.emit('newLocationMessage', generateLocationMessage(users.getUser(_id).name, coords.latitude, coords.longitude));
  });
	

  
  //On disconecting 
  socket.on('disconnect', () => {
	clientCount=clientCount-1;
	console.log('User was disconnected from the server [client count='+clientCount+"]");
	var user = users.removeUser(socket.id);

    if (user) {
      io.to(user.room).emit('updateUserList', users.getUserList(user.room));
      io.to(user.room).emit('newMessage', generateMessage('chat-server', `${user.name} has left.`));
    }

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