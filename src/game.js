const current_img = {
    image: '/public/images/god.jpg',
    solution: 'god of war',
    iteration: 1
};

function updateClients(players){
    for(let i = 0; i < players.length; i++) {
        players[i].socket.emit('image', current_img);
    }
}

function play(players) {
    var interval = setInterval(function () {
        current_img.iteration += 1;
        updateClients(players);
    }, 2000);

    return interval;
}

exports.handleEvents = function (io) {
    let players = [];
    interval = play(players);
    io.on('connection', socket => {
        console.log('User has connected.');

        socket.on('join game', pseudo => {
            players.push({
                socket: socket,
                pseudo: pseudo
            });
        });
    });
}