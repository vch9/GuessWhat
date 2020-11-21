let current_img = {
    image: '/public/images/god.jpg',
    solution: 'god of war',
    iteration: 1
};

function updateImage(socket) {
    socket.emit('image', current_img);
}

function updateScore(players, socket) {
    let scores = [];
    players.forEach(pl => {
        scores.push({
            pseudo: pl.pseudo,
            score: pl.score
        });
    });
    socket.emit('scores', scores);
}

function updateClients(players, f){
    for(let i = 0; i < players.length; i++) {
        const socket = players[i].socket;
        updateImage(socket);
        updateScore(players, socket);
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
                updateClients(players);
            }
        });
        nextImage();
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