const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let drawing = false;
let tool = 'brush';
let brushSize = 5;
let color = '#000000';

canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);

function setTool(selectedTool) {
    tool = selectedTool;
}

function setColor(selectedColor) {
    color = selectedColor;
}

function setBrushSize(size) {
    brushSize = size;
}

function startDrawing(e) {
    drawing = true;
    ctx.beginPath();
    ctx.moveTo(e.offsetX, e.offsetY);
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
    }
}

function stopDrawing() {
    drawing = false;
    ctx.beginPath();
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function saveCanvas() {
    const link = document.createElement('a');
    link.download = 'canvas_image.png';
    link.href = canvas.toDataURL();
    link.click();
}

canvas.addEventListener('click', function(e) {
    if (tool === 'rectangle') {
        ctx.fillStyle = color;
        ctx.fillRect(e.offsetX, e.offsetY, 100, 50);
    } else if (tool === 'circle') {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(e.offsetX, e.offsetY, 50, 0, Math.PI * 2);
        ctx.fill();
    }
});
