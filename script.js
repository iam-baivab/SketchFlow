document.addEventListener("DOMContentLoaded", function () {
    setTimeout(function () {
        document.querySelector(".preloader").classList.add("fade-out");
    }, 1000);
  
    setTimeout(function () {
        document.querySelector(".container-fluid").style.display = "inherit";
        document.querySelector(".preloader").style.display = "none";
    }, 1500);
  
    document.getElementById('hamburgerBtn').addEventListener('click', function() {
        document.getElementById('hamburgerBtn').style.display = 'none';
        document.getElementById('mobileSidebar').style.left = '0';
    });

    document.getElementById('closeBtn').addEventListener('click', function() {
        document.getElementById('mobileSidebar').style.left = '-100%';
        setTimeout(function() {
            document.getElementById('hamburgerBtn').style.display = 'block';
        }, 100);
    });
});

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let drawing = false;
let tool = 'brush';
let brushSize = 5;
let color = '#000000';
let startX, startY;
const shapes = [];

canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);

document.addEventListener('DOMContentLoaded', () => {
    setTool('brush');
});

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
}

function draw(e) {
    if (!drawing) return;
    if (tool === 'brush') {
        ctx.lineWidth = brushSize;
        ctx.lineCap = 'round';
        ctx.strokeStyle = color;
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
    } else if (tool === 'erase') {
        ctx.lineWidth = brushSize;
        ctx.lineCap = 'round';
        ctx.strokeStyle = '#ffffff';
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
    } else if (tool === 'rectangle' || tool === 'circle') {
        redrawShapes();

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