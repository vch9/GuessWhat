function resizeImage(path, canvas, ctx, width, height) {
    var img = new Image();
    img.src = path

    canvas.width = width;
    canvas.height = height;

    img.onload = function () {
        ctx.drawImage(img, 0, 0, width, height);
    }

    return img
}


function renderImage(path) {
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');

    resizeImage(path, canvas, ctx, 600, 600);
}

function renderButton(iteration) {
    let button = document.createElement("button");
    button.id = "next";
    button.innerHTML = "Next iteration";

    document.getElementById("game").appendChild(button);
    document.querySelector('#next').addEventListener("click", function() {
        iteration += 1;
        console.log(iteration);
    });
}

function renderHome(path, iteration) {
    renderButton(iteration);
    renderImage(path);
}