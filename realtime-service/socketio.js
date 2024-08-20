const http = require('http');
require('dotenv').config({ path: '../.env' })
const { Server } = require('socket.io');
const server = http.createServer();
const io = new Server(server, {
  maxHttpBufferSize: 1e7,
  cors: {
    origin: process.env.CORS_ALLOW_ORIGIN
  }
})
const { Models } = require('../db/db.js');
const { default: mongoose } = require('mongoose');

io.on('connection', socket => {
  console.log(socket.id + " has connected")
  
  var email, _id
  try {
    const headers = socket.handshake.headers
    const verified = JSON.parse(headers.verified);
    const {sub: email, _id} = verified

    socket.data.email = email
    socket.data._id = _id

  } catch (error) {
    // console.log("Verified header not present")
    console.log(error)
    socket.emit("failed-token")
    socket.disconnect()
    console.log("Kicked " + socket.id)
  }


  socket.on('disconnect', reason => {
    console.log(`${socket.id} has disconnected`)

  })

  socket.on('join-room', roomObject => {

  })

  socket.on('hello', () => {
    console.log('hello')
  })

  socket.on('changed-transactions', async (newData) => {
    console.log('changed-transactions')
    const _id = socket.data._id
    const family = await Models.Family.findOne({ users: { $in: [new mongoose.Types.ObjectId(_id)] } }).populate('users');
    const familyMembersIds  = family.users.map(user => user.id)
    .filter(id => id !== _id)

    io.sockets.sockets.forEach((socket) => {
      if (familyMembersIds.includes(socket.data._id)) {
        // Emit a test event to this socket
        console.log(`emitting to ${socket.id}`)
        socket.emit('receive-changes', {...newData, sender: _id});
      }
    });
  })

})




module.exports = {server}