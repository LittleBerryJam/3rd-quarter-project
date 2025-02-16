let gameCanvas = document.getElementById("gameCanvas");
let ctx = gameCanvas.getContext("2d");
let img = document.getElementById("background");
let cursorimg = document.getElementById("cursor");


ctx.drawImage(img, 0, 0);

class clickableArea{
    constructor(x, y, width, height){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    draw(){
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

var test = new clickableArea(50, 50, 100, 100);
test.draw();

rect = gameCanvas.getBoundingClientRect();
addEventListener("mousemove", function(e){
    let mX = e.clientX - rect.x;
    let mY = e.clientY - rect.y;
    ctx.drawImage(img, 0, 0);
    test.draw();
    ctx.drawImage(cursorimg, mX-cursorimg.width, mY);
})