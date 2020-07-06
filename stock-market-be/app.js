'use strict';
const config = require('./config')
const ws = require('./src/webserver');
const storage = require('./src/storage');

storage.createFiles();
const server = ws.getWebServer(config.hostname, config.port, config.allowedConnections, config.apikey);
server.start();

storage.save('data.txt', 'Inês');