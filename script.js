document.addEventListener("DOMContentLoaded", function () {
    setTimeout(function () {
        document.querySelector(".preloader").classList.add("fade-out");
    }, 1000);

    setTimeout(function () {
        document.querySelector(".container-fluid").style.display = "inherit";
        document.querySelector(".preloader").style.display = "none";
    }, 1500);

    setTool('brush');

    document.getElementById('hamburgerBtn').addEventListener('click', toggleMobileSidebar);
    document.getElementById('closeBtn').addEventListener('click', toggleMobileSidebar);
});

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let drawing = false;
let tool = 'brush';
let brushSize = 5;
let color = '#000000';
let startX, startY;
const shapes = [];
const drawingHistory = [];

canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);

function toggleMobileSidebar() {
    const mobileSidebar = document.getElementById('mobileSidebar');
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    if (mobileSidebar.style.left === '0px') {
        mobileSidebar.style.left = '-100%';
        setTimeout(() => hamburgerBtn.style.display = 'block', 100);
    } else {
        hamburgerBtn.style.display = 'none';
        mobileSidebar.style.left = '0';
    }
}

function setTool(selectedTool) {
    tool = selectedTool;
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    document.querySelector(`.nav-link[onclick="setTool('${tool}')"]`).classList.add('active');
}

function setColor(selectedColor) {
    color = selectedColor;
}

function setBrushSize(size) {
    brushSize = size;
}

function startDrawing(e) {
    drawing = true;
    startX = e.offsetX;
    startY = e.offsetY;
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    saveState();
}

function draw(e) {
    if (!drawing) return;

    switch (tool) {
        case 'brush':
        case 'erase':
            ctx.lineWidth = brushSize;
            ctx.lineCap = 'round';
            ctx.strokeStyle = tool === 'brush' ? color : '#ffffff';
            ctx.lineTo(e.offsetX, e.offsetY);
            ctx.stroke();
            break;
        case 'rectangle':
        case 'circle':
            redrawShapes();
            drawShape(e);
            break;
    }
}

function drawShape(e) {
    const endX = e.offsetX;
    const endY = e.offsetY;
    const width = endX - startX;
    const height = endY - startY;

    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;

    if (tool === 'rectangle') {
        ctx.strokeRect(startX, startY, width, height);
    } else if (tool === 'circle') {
        const radius = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2)) / 2;
        const centerX = startX + width / 2;
        const centerY = startY + height / 2;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.stroke();
    }
}

function redrawShapes() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    shapes.forEach(shape => {
        ctx.strokeStyle = shape.color;
        ctx.lineWidth = shape.lineWidth;
        if (shape.type === 'rectangle') {
            ctx.strokeRect(shape.startX, shape.startY, shape.width, shape.height);
        } else if (shape.type === 'circle') {
            ctx.beginPath();
            ctx.arc(shape.centerX, shape.centerY, shape.radius, 0, Math.PI * 2);
            ctx.stroke();
        }
    });
}

function stopDrawing() {
    if (!drawing) return;
    drawing = false;

    if (tool === 'rectangle' || tool === 'circle') {
        const endX = event.offsetX;
        const endY = event.offsetY;
        const width = endX - startX;
        const height = endY - startY;

        if (tool === 'rectangle') {
            shapes.push({
                type: 'rectangle',
                color: '#000000',
                lineWidth: 2,
                startX: startX,
                startY: startY,
                width: width,
                height: height,
            });
        } else if (tool === 'circle') {
            const radius = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2)) / 2;
            const centerX = startX + width / 2;
            const centerY = startY + height / 2;
            shapes.push({
                type: 'circle',
                color: '#000000',
                lineWidth: 2,
                centerX: centerX,
                centerY: centerY,
                radius: radius,
            });
        }
    }
    ctx.beginPath();
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    shapes.length = 0;
    saveState();
}

function saveCanvas() {
    const link = document.createElement('a');
    link.download = 'canvas_image.png';
    link.href = canvas.toDataURL();
    link.click();
}

function openGitHub() {
    window.open('https://github.com/iam-baivab/SketchFlow', '_blank');
}

function saveState() {
    const canvasImage = canvas.toDataURL();
    drawingHistory.push(canvasImage);
}

function undo() {
    if (drawingHistory.length > 0) {
        const previousState = drawingHistory.pop();
        const img = new Image();
        img.src = previousState;
        img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
        };
        shapes.pop();
    }
}
