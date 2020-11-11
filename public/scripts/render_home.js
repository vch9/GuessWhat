function renderImage(path) {
    var img = new Image();
    img.src = path

    var ctx = document.getElementById('canvas').getContext('2d');
    img.onload = function() {
        ctx.drawImage(img, 0, 0);
        img.style.display = 'none';
    }
}