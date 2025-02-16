let gameCanvas = document.getElementById("gameCanvas");
let ctx = gameCanvas.getContext("2d");



let backgroundImg = document.getElementById("background");
let cursorImg = new Image();
cursorImg.src = "resources/images/cursor.png";

let clickSound = new Audio("resources/sounds/click.wav");






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
    clicked(x, y){
        if(x < this.x || x > this.x+this.width){
            return false;
        }
        if(y < this.y || y > this.y+this.height){
            return false;
        }
        return true;
    }
}

var test = new clickableArea(50, 50, 100, 100);
ctx.drawImage(backgroundImg, 0, 0);
test.draw();

rect = gameCanvas.getBoundingClientRect();
gameCanvas.addEventListener("mousemove", function(e){
    let mX = e.clientX - rect.x;
    let mY = e.clientY - rect.y;
    ctx.drawImage(backgroundImg, 0, 0);
    test.draw();
    ctx.drawImage(cursorImg, mX-cursorImg.width, mY);
});
gameCanvas.addEventListener("click", function(e){
    let mX = e.clientX - rect.x;
    let mY = e.clientY - rect.y;
    if(test.clicked(mX, mY)){
        clickSound.play();
    }
    
});