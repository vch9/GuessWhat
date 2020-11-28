function resizeImage(path, canvas, width, height) {
    var img = new Image();
    img.src = path;
    img.crossOrigin = "anonymous";

    canvas.width = width;
    canvas.height = height;

    return img
}

function pixelizeImage(imgData, ctx, i, max, startx, endx, starty, endy) {
    var middlex = Math.floor((startx + endx) / 2);
    var middley = Math.floor((starty + endy) / 2);

    var nb_pixels = ((endx-startx) * (endy-starty))
    if (nb_pixels <= 0) {
        return;
    }

    if (i < max) {
        /* Left bottom corner */
        pixelizeImage(imgData, ctx, i+1, max, startx, middlex, starty, middley);
        /* Top left corner */
        pixelizeImage(imgData, ctx, i+1, max, startx, middlex, middley+1, endy);
        /* Right bottom corner */
        pixelizeImage(imgData, ctx, i+1, max, middlex+1, endx, starty, middley);
        /* Right top corner */
        pixelizeImage(imgData, ctx, i+1, max, middlex+1, endx, middley+1, endy);
        return;
    }

    var xrand = Math.floor((Math.random() * endx) + startx);
    var yrand = Math.floor((Math.random() * endy) + starty);

    var index = yrand * (imgData.width*4) + (xrand * 4);

    var red = 0;
    var green = 0;
    var blue = 0;

    for(var x = startx; x < endx; x++) {
        for(var y = starty; y < endy; y++) {
            index = y * (imgData.width*4) + x * 4;
            red += imgData.data[index];
            green += imgData.data[index+1];
            blue += imgData.data[index+2];
        }
    }
    ctx.fillStyle = "rgb(" + red/nb_pixels + "," + green/nb_pixels + "," + blue/nb_pixels + ")";
    ctx.fillRect(startx, starty, endx-startx+1, endy-starty+1);
}

function renderImage(path, iteration) {
    var width = 800;
    var height = 800;

    var canvas = document.getElementById('canvas');

    var img = resizeImage(path, canvas, width, height);

    img.onload = function () {
        var ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        var imgData = ctx.getImageData(0, 0, width, height);

        if (iteration > 8) {
            return;
        }

        pixelizeImage(imgData, ctx, 0, iteration, 0, width, 0, height);
    }
}

function renderScores(scores) {
    document.getElementById("scores").innerHTML = "";
    let table = document.createElement("table");
    let table_body = document.createElement("tbody");

    scores.forEach(row => {
        let tr = document.createElement('tr');
        let td = document.createElement('td');

        td.appendChild(document.createTextNode(row.pseudo + ' : ' + row.score));

        tr.appendChild(td);
        table_body.appendChild(tr);
    });

    table.appendChild(table_body);
    document.getElementById("scores").appendChild(table);
}
function renderButton(pseudo) {
    var answer = document.getElementById('answer');
    answer.addEventListener('submit', function(e) {
        var try_answer = document.getElementById('answer_player');
        socket.emit('try answer', {
            pseudo: pseudo,
            answer: try_answer.value
        });
        try_answer.value = "";
    });
}
function renderGame(pseudo, socket) {
    if(!pseudo){
        const url = window.location.origin;
        window.location.href = url;
        window.location.replace(url);
        return;
    }
    renderButton(pseudo);
    socket.emit('join game', pseudo);

    var answer = document.getElementById('answer');
    answer.addEventListener('submit', function(e) {
        var try_answer = document.getElementById('answer_player').value;
        if (try_answer !== "") {
            socket.emit('try answer', {
                pseudo: pseudo,
                answer: try_answer.value
            });
            try_answer.value = "";
        }
    });

    var image, solution, iteration;
    socket.on('image', function(msg) {
        image = msg.image;
        solution = msg.solution;
        iteration = msg.iteration;

        renderImage(image, iteration);
    });

    socket.on('scores', function(msg) {
        renderScores(msg);
    });
}