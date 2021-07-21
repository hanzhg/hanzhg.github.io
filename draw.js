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
var mouseDown = false;
var click = true;

const button = document.querySelector('.button');

button.addEventListener('click', function () {
    console.log("hello");
    if (click) {
        click = !click
        document.getElementById('canvas').style.backgroundColor = "black";
        document.getElementById('text').style.color = "white";
    } else {
        click = true
        document.getElementById('canvas').style.backgroundColor = "white";
        document.getElementById('text').style.color = "black";
    }
})

const draw = function () {
    context.font = 'bold 2em Arial';

    // context.fillRect(0, 0, canvas.width, canvas.height);

    if (click) {
        context.fillStyle = "black";
    } else {
        context.fillStyle = "white";
    }

    context.textAlign = "center";

    context.save();

    context.translate(currentX, currentY);

    context.rotate((-Math.PI + i) / 180);

    if (mouseDown) {
        i += 10
        context.fillText(nameDrawn, 0, 10);
    } else {
        i -= 10
    }
    
    context.restore();

    // context.fillText(nameDrawn, currentX, currentY + 10);
    // drawPreviouslyDrawnWords()

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
    if (mouseDown) {
        mouseDown = !mouseDown
    } else {
        mouseDown = true
    }
}, false);

document.addEventListener('mouseup', function () {
    if (mouseDown) {
        mouseDown = !mouseDown
    } else {
        mouseDown = true
    }
}, false);

// function drawPreviouslyDrawnWords() {
//     drawnWords.forEach(item => {
//         context.fillText(item.word, item.x, item.y);
//     })
// }

document.addEventListener("mousemove", function (event) {
    mouseX = event.pageX
    mouseY = event.pageY
    if (currentX === null) {
        currentX = event.pageX
        currentY = event.pageY
    }
})

draw()