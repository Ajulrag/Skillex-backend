const dotenv = require('dotenv');
dotenv.config({ path: '.env' });
const { app } = require('../app.js');
const { dbConnection } = require('./db.js');
const { Server } = require('socket.io')
const cors = require('cors');




dbConnection().then(() => {
  const httpServer = require('http').createServer(app)
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.REACT,
      methods: ['GET', 'POST'],
      credentials: true
    },
    allowEIO3: true
  })


  //socket connection
  io.on("connection", (socket) => {
    console.log("User connected");

    roomHandler(socket);

    socket.on('disconnect', () => {
      console.log("user disconnected");
    })
  })
  const port = process.env.PORT || 8080;
  httpServer.listen(port, () => console.log(`listening on ${port}`));
}).catch((err) => {
  console.log("Error:", err);
});
