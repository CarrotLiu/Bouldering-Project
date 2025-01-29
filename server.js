// express app
const express = require("express");
const app = express();

app.use( express.static("public") );
app.get("/", function(request, response){
  response.sendFile(__dirname + "/views/index.html");
});

// HTTP Server
const http = require("http");
//const hostname = "127.0.0.1";
const port = process.env.PORT || 3000;
const server = http.createServer(app);
//server.listen(port, hostname, function() {}); 
server.listen(port, function(){
  console.log("Server is running: Port: " + port);
});


// socket.io
const socket = require("socket.io");
const io = socket(server);

io.on("connection", newConnection);
function newConnection(sck) {
  console.log("New Connection - ID: " + sck.id);
  sck.on("speak", receive);
  sck.on("scene", rcvscene);
  
  function receive(data) {
    console.log(data);
    //https://socket.io/docs/v3/emit-cheatsheet/index.html
    sck.broadcast.emit("speak", data);
  }
  
  function rcvscene(data){
    sck.broadcast.emit("scene", data);
  }
}
