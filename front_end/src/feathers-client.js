import auth from '@feathersjs/authentication-client';
import { busError } from 'components/home/ErrorMessage.vue';
import { busPixi } from 'components/home/PixiCanvas.vue';
import feathers from '@feathersjs/feathers';
import io from 'socket.io-client';
import socketio from '@feathersjs/socketio-client';

const socket = io();
socket.on('disconnect', function() {
  socket.emit('user disconnected');
  busError.$emit('error', new Error('network'));
});

const feathersClient = feathers()
  .configure(socketio(socket))
  .configure(auth({ storage: window.localStorage }));

feathersClient.service('knights').on('attacked', function() {
  busPixi.$emit('monsterAttack');
});
export default feathersClient;
