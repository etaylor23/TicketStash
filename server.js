var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/TicketStash');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
/*db.once('open', function (callback) {
  // yay!

  var publicChatSchema = mongoose.Schema({
  	message: String
  });

  var publicChat = mongoose.model('PublicChat', publicChatSchema);

  var silence = new publicChat({ message: 'All the messagessss' });
  console.log(silence.message); // 'Silence'

  silence.save(function (err, message) {
    if (err) return console.error(err);
    console.log("Yeah sure, thats saved");
    console.log(message);
  });

  console.log("Connected to db")
});*/


var publicChatSchema = mongoose.Schema({
	ipString1: String,
	ipString2: String,
	message: String
});

var publicChat = mongoose.model('PublicChat', publicChatSchema);

/* var silence = new publicChat({ message: 'All the messagessss' });
console.log(silence.message); // 'Silence'

silence.save(function (err, message) {
if (err) return console.error(err);
	console.log("Yeah sure, thats saved");
	console.log(message);
});*/




app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/travelled', function(req, res) {
	res.sendFile(__dirname + '/travelled.html')
})

app.get('/will-travel', function(req, res) {
	res.sendFile(__dirname + '/will-travel.html')
})



io.on('connection', function(socket){
  var ip1 = "123.123.123.40";
  var ip2 = "321.321.321.09";

  publicChat.find({ 
  	$and: [ 
  		{ ipString1: "123.123.123.40", ipString2: "321.321.321.09" } 
  	]
  }, function(err, message) {
  	if(!err) {
  		console.log(message);
  	} else {
  		console.log(err);
  	}
  });
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});

io.on('connection', function(socket){


  socket.on('chat message', function(msg){

  //console.log(socket.request.connection.remoteAddress);
  var ip1 = "123.123.123.40";
  var ip2 = "321.321.321.09";
  var quickMessage = new publicChat({ ipString1:ip1, ipString2:ip2, message:msg });

  console.log(quickMessage);
	quickMessage.save(function(err, message) {
	  io.emit('chat message', msg);
	})
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});