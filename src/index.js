#!/usr/bin/env node

import { createServer } from 'http';
import app from './app/app';
import config from './config';

const onError = function onErrorEvent(error, port) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string'
    ? `Pipe ${port}`
    : `Port ${port}`;

  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
};

const onListening = function onListeningEvent(addr) {
  const bind = typeof addr === 'string'
    ? `pipe ${addr}`
    : `port ${addr.port}`;
  console.error(`Listening on ${bind}`);
};

const startHTTPServer = async function startHTTPServerListen() {
  try {
    console.error('Starting server');
    const server = createServer(app);
    server.listen(app.get('port'));
    server.on('error', (err) => { onError(err, app.get('port')); });
    server.on('listening', () => { onListening(server.address()); });
  } catch (startHTTPServerError) {
    console.error('', startHTTPServerError.stack);
    process.exit(1);
  }
};

app.set('port', config.server.ports.http);
startHTTPServer();
