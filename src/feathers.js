import feathers from '@feathersjs/client';
import socketio from '@feathersjs/socketio-client';
import io from 'socket.io-client';

const socket = io('http://localhost:3030');
const client = feathers();
// https://docs.feathersjs.com/api/client.html#node
client.configure(socketio(socket));
// const app = feathers();
// const socketio = require('@feathersjs/socketio');
// app.configure(socketio({
//   pingInterval: 10000,
//   pingTimeout: 50000
// }));
client.configure(
  feathers.authentication({
    storage: window.localStorage,
  })
);

export default client;