let current_img = {
    image: '/public/images/god.jpg',
    solution: 'god of war',
    iteration: 1
};

function updateImage(players, socket) {
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

function updateClients(players) {
    for(let i = 0; i < players.length; i++) {
        const socket = players[i].socket;
        updateImage(players, socket);
        updateScore(players, socket);
    }
}

function updateClientsF(players, f) {
    console.log(players.length);
    for(let i = 0; i < players.length; i++) {
        const socket = players[i].socket;
        f(players, socket);
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
// Array Remove - By John Resig (MIT Licensed)
Array.prototype.remove = function(from, to) {
    var rest = this.slice((to || from) + 1 || this.length);
    this.length = from < 0 ? this.length + from : from;
    return this.push.apply(this, rest);
};

function playerLeave(players, pseudo) {
    let index = -1;
    for(let i = 0; i < players.length; i++) {
        if (players[i].pseudo === pseudo) {
            index = i;
        }
    }
    if (index > -1) {
        players.remove(index);
    }
    updateClientsF(players, updateScore);
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

        socket.on('leave game', pseudo => {
            console.log(pseudo + ' has disconnected.');
            playerLeave(players, pseudo);
        });
    });
}