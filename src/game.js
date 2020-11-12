let current_img = {
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

function nextImage() {
    // TODO: this should change current_img to a new one.
    current_img = {
        image: '/public/images/god.jpg',
        solution: 'god of war',
        iteration: 1
    };
}

function tryAnswer(players, pseudo, answer) {
    if (answer === current_img.solution) {
        players.forEach(player => {
            if (player.pseudo === pseudo) {
                player.score += 1;
            }
        });
        nextImage();
        console.log(players);
    }
}

exports.handleEvents = function (io) {
    let players = [];
    interval = play(players);
    io.on('connection', socket => {
        socket.on('join game', pseudo => {
            console.log(pseudo + ' has joined.');
            players.push({
                socket: socket,
                pseudo: pseudo,
                score: 0
            });
        });

        socket.on('try answer', msg => {
            console.log(msg.pseudo + ' has tried: ' + msg.answer);
            tryAnswer(players, msg.pseudo, msg.answer);
        });
    });
}