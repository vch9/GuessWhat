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
    var width = 600;
    var height = 600;

    var canvas = document.getElementById('canvas');

    var img = resizeImage(path, canvas, width, height);

    img.onload = function () {
        var ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        var imgData = ctx.getImageData(0, 0, width, height);
        pixelizeImage(imgData, ctx, 0, iteration, 0, width, 0, height);
    }
}

function renderButton(path, iteration) {
    let button = document.createElement("button");
    button.id = "next";
    button.innerHTML = "Next iteration";

    document.getElementById("game").appendChild(button);
    document.querySelector('#next').addEventListener("click", function() {
        iteration += 1;
        renderImage(path, iteration)
    });
}

function renderHome(path, iteration) {
    renderButton(path, iteration);
    renderImage(path, iteration);
}