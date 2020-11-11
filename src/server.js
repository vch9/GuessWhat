/**
 * Manage server configuration
 */

const http = require('http');
const app = require('./app');
const config = require('./config');
const game = require('./game.js');

const server = http.createServer(app);
const io = require('socket.io')(server);

game.handleEvents(io);

server.listen(config.port, () => {
    console.log("Server is listening on " + config.port);
});