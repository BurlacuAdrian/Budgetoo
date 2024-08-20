import { io } from 'socket.io-client';

const URL = import.meta.env.VITE_SOCKET_IO_URL

export const socket = io(URL, {
  autoConnect: false,
  // protocols: ['http'],
  withCredentials: true
});

export const socketEmitTransactions = (newData) => {
  if(socket.connected){
    socket.emit('changed-transactions', newData)
  }
}