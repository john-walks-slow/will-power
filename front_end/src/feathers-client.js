import auth from '@feathersjs/authentication-client';
import { busError } from 'views/Home.vue';
import feathers from '@feathersjs/feathers';
import io from 'socket.io-client';
import socketio from '@feathersjs/socketio-client';

const socket = io('http://localhost:3030', { transports: ['websocket'] });
socket.on('disconnect', function() {
  socket.emit('user disconnected');
  busError.$emit('error', new Error('Please check your network connection.'));
});
const feathersClient = feathers()
  .configure(socketio(socket))
  .configure(auth({ storage: window.localStorage }));

export default feathersClient;
