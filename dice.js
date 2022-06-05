//Canvas variables
var canvas;
var ctx;
var originalImage = new Image();
var scaledImage;

//Brightness threshold array
var thresholds = []; 

var nDice = 6;
var scaleFactor = 100000.0;
var showBorders = false;
var dotSize = 0.1;

var rows = 80;
var cols = 80;
var width = 800;
var height = 800;

originalImage.onload = function() {
    //ctx.drawImage(originalImage, 0, 0);
    //scaleImage();
    drawDice();
    updateAspect();
}

function scaleImage(){
    var newCanvas = document.createElement('canvas');
    scaledImage = newCanvas.getContext('2d');

    newCanvas.width = cols;
    newCanvas.height = rows;
    scaledImage.drawImage(originalImage, 0, 0, originalImage.width, originalImage.height, 0, 0, cols, rows);
}

function drawDice(){
    //Scale Image
    scaleImage();

    //Get pixel data
    var pixels = scaledImage.getImageData(0,0, cols, rows);

    //Create Dice objects
    var dice = [];
    for(var i = 0; i < rows; i++){
        for(var j = 0; j < cols; j++){
            var pixelIndex = ((i * (cols * 4)) + (j * 4));
            var r = pixels.data[pixelIndex];
            var g = pixels.data[pixelIndex + 1];
            var b = pixels.data[pixelIndex + 2];
            
            var brightness = (r + g + b) / 3.0;
            brightness /= 255.0; //normalise
            
            var hstep = width/cols;
            var vstep = height/rows;

            var die = new Die(j*hstep, i*vstep, hstep, vstep, brightness);
            dice.push(die);
        }
    }

    //Render Dice
    for(var i = 0; i < dice.length; i++){
        dice[i].render();
    }
}

function handleFile() {
    const inputElement = document.getElementById("input");
    const imageFile = inputElement.files[0];
    
    //var image = new Image();
    originalImage.src = URL.createObjectURL(imageFile);

    //return image;
}

class Die {
    constructor(x, y, w, h, b) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.n = 1;
        this.isWhite = false;
        this.brightness = b;
        this.showBorder = showBorders;
        this.dotScale = dotSize;

        this.setNumber();
    }

    setNumber(){
        var colour = document.getElementById('colour');

        if(colour.value != 'bw'){
            if(this.brightness < thresholds[0]){
                this.n = 1;
            }
            else if(this.brightness < thresholds[1]){
                this.n = 2;
            }
            else if(this.brightness < thresholds[2]){
                this.n = 3;
            }
            else if(this.brightness < thresholds[3]){
                this.n = 4;
            }
            else if(this.brightness < thresholds[4]){
                this.n = 5;
            }
            else{
                this.n = 6;
            }

            //this.isWhite = false;
            if(colour.value == 'w'){
                this.n = 7 - this.n;
                this.isWhite = true;
            }
        }
        else
        {
            if(this.brightness < thresholds[0]){
                this.n = 1;
            }
            else if(this.brightness < thresholds[1]){
                this.n = 2;
            }
            else if(this.brightness < thresholds[2]){
                this.n = 3;
            }
            else if(this.brightness < thresholds[3]){
                this.n = 4;
            }
            else if(this.brightness < thresholds[4]){
                this.n = 5;
            }
            else if(this.brightness < thresholds[5]){
                this.n = 6;
            }
            else if(this.brightness < thresholds[6]){
                this.n = 6;
                this.isWhite = true;
            }
            else if(this.brightness < thresholds[7]){
                this.n = 5;
                this.isWhite = true;
            }
            else if(this.brightness < thresholds[8]){
                this.n = 4;
                this.isWhite = true;
            }
            else if(this.brightness < thresholds[9]){
                this.n = 3;
                this.isWhite = true;
            }
            else if(this.brightness < thresholds[10]){
                this.n = 2;
                this.isWhite = true;
            }
            else{
                this.n = 1;
                this.isWhite = true;
            }
        }
    }

    render() {
        //Set fill colour 
        if(this.isWhite){
            ctx.fillStyle = "white";
        }
        else{
            ctx.fillStyle = "black";
        }

        //draw the base square
        ctx.fillRect(this.x, this.y, this.w, this.h);

        //Set colour of dots
        if(this.isWhite){
            ctx.fillStyle = "black";
            ctx.strokeStyle = "black"
        }
        else{
            ctx.fillStyle = "white";
            ctx.strokeStyle = "white";
        }

        //Draw dots
        if(this.n == 1){
            drawCircle(this.x + this.w/2,  this.y + this.h/2, this.dotScale * this.w);
        }
        else if(this.n == 2){
            drawCircle(this.x + this.w/4,  this.y + this.h/4, this.dotScale * this.w);
            drawCircle(this.x + 3*this.w/4,  this.y + 3*this.h/4, this.dotScale * this.w);
        }
        else if(this.n == 3){
            drawCircle(this.x + this.w/2,  this.y + this.h/2, this.dotScale * this.w);
            drawCircle(this.x + this.w/4,  this.y + this.h/4, this.dotScale * this.w);
            drawCircle(this.x + 3*this.w/4,  this.y + 3*this.h/4, this.dotScale * this.w);
        }
        else if(this.n == 4){
            drawCircle(this.x + this.w/4,  this.y + this.h/4, this.dotScale * this.w);
            drawCircle(this.x + 3*this.w/4,  this.y + 3*this.h/4, this.dotScale * this.w);
            drawCircle(this.x + 3*this.w/4,  this.y + this.h/4, this.dotScale * this.w);
            drawCircle(this.x + this.w/4,  this.y + 3*this.h/4, this.dotScale * this.w);
        }
        else if(this.n == 5){
            drawCircle(this.x + this.w/2,  this.y + this.h/2, this.dotScale * this.w);
            drawCircle(this.x + this.w/4,  this.y + this.h/4, this.dotScale * this.w);
            drawCircle(this.x + 3*this.w/4,  this.y + 3*this.h/4, this.dotScale * this.w);
            drawCircle(this.x + 3*this.w/4,  this.y + this.h/4, this.dotScale * this.w);
            drawCircle(this.x + this.w/4,  this.y + 3*this.h/4, this.dotScale * this.w);
        }
        else{
            drawCircle(this.x + this.w/4,  this.y + this.h/6, this.dotScale * this.w);
            drawCircle(this.x + 3*this.w/4,  this.y + 5*this.h/6, this.dotScale * this.w);
            drawCircle(this.x + 3*this.w/4,  this.y + this.h/6, this.dotScale * this.w);
            drawCircle(this.x + this.w/4,  this.y + 5*this.h/6, this.dotScale * this.w);
            drawCircle(this.x + this.w/4,  this.y + this.h/2, this.dotScale * this.w);
            drawCircle(this.x + 3*this.w/4,  this.y + this.h/2, this.dotScale * this.w);
        }

        //Draw border
        if(this.showBorder){
            if(this.isWhite){
                ctx.strokeStyle = "black";
            }
            else
            {
                ctx.strokeStyle = "white";
            }
            
            ctx.strokeRect(this.x, this.y, this.w, this.h);
        }
        else
        {
            if(this.isWhite){
                ctx.strokeStyle = "white";
            }
            else
            {
                ctx.strokeStyle = "black";
            }
            
            ctx.strokeRect(this.x, this.y, this.w, this.h);
        }
    }
}

function initializeThresholds() {
    thresholds = [];
    
    for (let i = 0; i < nDice; i++){
        thresholds.push(1.0/nDice * (i + 1));
    }

    initializeSliders();
}

function initializeSliders() {
    for(let i = 1; i < nDice; i++) {
        var slider = document.getElementById("thresh"+i);
        slider.value = thresholds[i-1]*scaleFactor;
    }
}

function updateSliders(n) {
    var left = null;
    var current = document.getElementById("thresh"+n);
    var right = null;
    
    var l = null;
    var r = null;

    if (n > 1){
        left = document.getElementById("thresh"+(n-1));
        l = n - 1;
    }
    if (n < thresholds.length){
        right = document.getElementById("thresh"+(n+1));
        r = n + 1;
    }

    while (left != null){
        if(parseInt(current.value) < parseInt(left.value)){
            left.value = current.value;
        }

        l -= 1;

        if(l < 1) {
            left = null;
        }
        else {
            current = left;
            left = document.getElementById("thresh"+l);
        }
    }

    current = document.getElementById("thresh"+n);

    while (right != null){
        if(parseInt(current.value) > parseInt(right.value)){
            right.value = current.value;
        }

        r += 1;

        if(r > thresholds.length) {
            right = null;
        }
        else {
            current = right;
            right = document.getElementById("thresh"+r);
        }
    }

    updateThresholds();
}

function updateThresholds() {
    thresholds = [];

    for(let i = 1; i < nDice; i++) {
        var slider = document.getElementById("thresh"+i);
        var threshold = parseFloat(slider.value)/scaleFactor;
        thresholds.push(threshold);
    }

    redraw();
}

function drawCircle(x, y, r){
    //args x, y, radius, start angle, end angle
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2*Math.PI);
    ctx.fill();
    ctx.stroke();
}

function updateColour(){
    var colour = document.getElementById("colour");
    if (colour.value == "bw"){
        var sliders = document.getElementById("extraSliders");
        sliders.style.display = "block";
        
        nDice = 12;
    }
    else {
        var sliders = document.getElementById("extraSliders");
        sliders.style.display = "none";

        nDice = 6;
    }

    initializeThresholds(nDice);
    redraw();
}

function redraw(){
    scaleImage();
    drawDice();
}

function updateAspect(){
    var aspect = document.getElementById('aspectRatio');

    if(aspect.checked){
        var rowsInput = document.getElementById('rows');

        var h = Math.round(cols/originalImage.width * originalImage.height);
        rowsInput.value = h;
        rows = h;

        var heightInput = document.getElementById('height');
        h = Math.round(width/originalImage.width * originalImage.height);
        heightInput.value = h;
        height = h;

        canvas.width = width;
        canvas.height = height;
        redraw();
    }
}

function updateRes(field){
    var aspect = document.getElementById('aspectRatio');

    if(aspect.checked){
        if(field == 'c'){
            //update cols
            cols = parseInt(document.getElementById('columns').value);

            //update rows based on new cols
            var rowsInput = document.getElementById('rows');

            var h = Math.round(cols/originalImage.width * originalImage.height);
            rowsInput.value = h;
            rows = h;
        }
        else if (field == 'r'){
            //update rows
            rows = parseInt(document.getElementById('rows').value);

            //update cols based on rows
            var colsInput = document.getElementById('columns');

            var h = Math.round(rows/originalImage.height * originalImage.width);
            colsInput.value = h;
            cols = h;
        }
        else if (field == 'w'){
            //update width
            width = parseInt(document.getElementById('width').value);

            //update height based on new width
            var heightInput = document.getElementById('height');

            var h = Math.round(width/originalImage.width * originalImage.height);
            heightInput.value = h;
            height = h;
        }
        else{
            //update height
            height = parseInt(document.getElementById('height').value);

            //update width based on new height
            var widthInput = document.getElementById('width');

            var h = Math.round(height/originalImage.height * originalImage.width);
            widthInput.value = h;
            width = h;
        }
    }
    else{
        cols = parseInt(document.getElementById('columns').value);
        rows = parseInt(document.getElementById('rows').value);
        width = parseInt(document.getElementById('width').value);
        height = parseInt(document.getElementById('height').value);
    }

    canvas.width = width;
    canvas.height = height;
    redraw();
}

function showLines(){
    showBorders = !showBorders;
    redraw(); 
}

function updateDotSize(){
    var dotSlider = document.getElementById('dotScale');
    dotSize = parseInt(dotSlider.value) / 10000;
    redraw();
}

window.addEventListener("load", () => {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");

    //Set default thresholds
    initializeThresholds();

    //set canvas size
    canvas.width = width;
    canvas.height = height;

    //Set dot size slider
    var dotSlider = document.getElementById('dotScale');
    dotScale.value = 1000;
})

function main() {  
    //Show canvas
    canvas.style.display = "block";

    //Process image file
    handleFile();

    //Show options
    var options = document.getElementById("options");
    options.style.display = "block";

}

