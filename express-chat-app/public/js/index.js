var socket = io();

function scrollToBottom () {
  // Selectors
  var messages = jQuery('#messages');
  var newMessage = messages.children('li:last-child')
  // Heights
  var clientHeight = messages.prop('clientHeight');
  var scrollTop = messages.prop('scrollTop');
  var scrollHeight = messages.prop('scrollHeight');
  var newMessageHeight = newMessage.innerHeight();
  var lastMessageHeight = newMessage.prev().innerHeight();

  if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
    messages.scrollTop(scrollHeight);
  }
}




socket.on('connect', function () {
  console.log('Connected to server');
});

socket.on('disconnect', function () {
  console.log('Disconnected from server');
});

socket.on('newMessage', function (message) {
  /* 
  console.log('newMessage', message);

  var messageTime=moment(message.createdAt).format("h:mm a"); 
  var li = jQuery('<li></li>');
  li.text(`${message.from}:${messageTime}>${message.text}`);

  jQuery('#messages').append(li);
  */
  console.log('newMessage', message);
  var messageTime=moment(message.createdAt).format("h:mm a"); 
  var template = jQuery('#message-template').html();
  var html= Mustache.render(template,{
	  text:message.text,
	  from:message.from,
	  createdAt:messageTime
  });
  jQuery('#messages').append(html);
  scrollToBottom ();
 
  /** 
  var user_count_template = jQuery('#user-count').html();
  var userCount= Mustache.render(user_count_template,
  {
  count:`${message.currentUserCount}`
  });
  jQuery('#count').val(userCount);
  **/
  
});


socket.on('newLocationMessage', function (message) {
  /**console.log(message);
 	
  var li = jQuery('<li></li>');
  var a = jQuery('<a target="_blank">My current location</a>');
  var messageTime=moment(message.createdAt).format("h:mm a"); 
  li.text(`${message.from}:${messageTime}>`);
  a.attr('href', message.url);
  li.append(a);
  jQuery('#messages').append(li);**/
  
  var messageTime=moment(message.createdAt).format("h:mm a"); 
  var template = jQuery('#location-message-template').html();
  var html= Mustache.render(template,{
	  from:message.from,
	  url:message.url,
	  createdAt:messageTime
  });
  jQuery('#messages').append(html);
  scrollToBottom ();
 
});


jQuery('#message-form').on('submit', function (e) {
  e.preventDefault();


  
  socket.emit('createMessage', {
    from: 'User',
    text: jQuery('[name=message]').val()
  }, function () {

  });
});

var locationButton= jQuery('#send-location');

locationButton.on('click', function() {
	console.log("User clicked the button");
	if(!navigator.geolocation)
	{
		 return alert("Geolocation NOT Supported");
	}	
	
	navigator.geolocation.getCurrentPosition(function(position){
	  console.log(position);
	   socket.emit('createLocationMessage', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });

	  
	},function(error){
		console.log("geolocation error: "+error);
		return alert("Unable to load position");
	});
});