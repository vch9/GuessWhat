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

    resizeImage(path, canvas, ctx, 1024, 1024);
}