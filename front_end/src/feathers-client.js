import auth from '@feathersjs/authentication-client';
import feathers from '@feathersjs/feathers';
import io from 'socket.io-client';
import socketio from '@feathersjs/socketio-client';

const socket = io('http://localhost:3030', { transports: ['websocket'] });

const feathersClient = feathers()
  .configure(socketio(socket))
  .configure(auth({ storage: window.localStorage }));

export default feathersClient;
