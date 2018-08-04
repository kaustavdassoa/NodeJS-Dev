var socket = io();

socket.on('connect', function (){
 console.log('Client connected to server');
  socket.emit("createMessage", 
	 {
		 from: "kaustav.das@gmail.com",
		 text :"Mesage from Kaustav Das"
	 }
 );
 
 socket.on("newMessage",function (newMessage) { console.log(JSON.stringify(newMessage,undefined,2))})
 

socket.on('disconnect', function() {
 console.log('Client disconnected from server');
});


});