const canvas = document.querySelector("#canvas")

canvas.width = window.innerWidth
canvas.height = window.innerHeight

const context = canvas.getContext("2d")
context.scale(1, 1)

let currentX = window.innerWidth / 2
let currentY = window.innerHeight / 2
let mouseX = window.innerWidth / 2
let mouseY = window.innerHeight / 2

let nameDrawn = "Han Zhang";
let drawnWords = [];
var i = 0;
var moving = false;

const draw = function () {
    context.font = 'bold 2em Arial';
    context.fillStyle = '#ffffff';
    // context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "black";
    context.textAlign = "center";

    context.save();
    context.translate(currentX, currentY);
    context.rotate((-Math.PI + i) / 180);
    if (moving) {
        i += 10
        context.fillText(nameDrawn, 0, 10);
    } else {
        i -= 10
    }
    context.restore();
    
    // context.fillText(nameDrawn, currentX, currentY + 10);
    drawPreviouslyDrawnWords()

    currentX = currentX + (mouseX - currentX) * 0.1
    currentY = currentY + (mouseY - currentY) * 0.1

    requestAnimationFrame(draw)
}

// document.addEventListener('click', function () {
//     drawnWords.push({
//         word: nameDrawn,
//         x: currentX,
//         y: currentY + 10
//     })
// }, false);

document.addEventListener('mousedown', function () {
    if (moving) {
        moving = !moving
    } else {
        moving = true
    }
}, false);

document.addEventListener('mouseup', function () {
    if (moving) {
        moving = !moving
    } else {
        moving = true
    }
}, false);

function drawPreviouslyDrawnWords() {
    drawnWords.forEach(item => {
        context.fillText(item.word, item.x, item.y);
    })
}

document.addEventListener("mousemove", function (event) {
    mouseX = event.pageX
    mouseY = event.pageY
    if (currentX === null) {
        currentX = event.pageX
        currentY = event.pageY
    }
})

draw()