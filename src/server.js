/**
 * Manage server configuration
 */

const http = require('http');
const app = require('./app');
const config = require('./config');

const server = http.createServer(app);
const io = require('socket.io')(server);

server.listen(config.port, () => {
    console.log("Server is listening on " + config.port);
});