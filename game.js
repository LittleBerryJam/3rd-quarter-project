let gameCanvas = document.getElementById("gameCanvas");
let ctx = gameCanvas.getContext("2d");



let backgroundImg = document.getElementById("background");

let clickSound = new Audio("resources/sounds/click.wav");

class dialogueBox{
    constructor(height, color){
        this.height = height;
        this.color = color;
        this.top = gameCanvas.height-this.height;
    }
    draw(){
        ctx.fillStyle = this.color;
        ctx.fillRect(0, this.top, gameCanvas.width, this.height);
    }
}

var fontSize = 25;
var padding = 10;
var choicePadding = 10;
class point{
    constructor(text="", choices=[]){
        this.text = text;
        this.choices = choices;
        this.highligtedChoice = -1;
    }
    getHighlightedChoice(x, y){
        let choice = Math.floor((y-dialogue.top-padding)/(fontSize+choicePadding));
        let textLeft = ctx.measureText(this.choices[0].text).width;
        if(x < gameCanvas.width-padding-textLeft){
            choice = -1;
        }
        this.highligtedChoice = choice;
    }
    draw(){
        ctx.font = fontSize + "px Arial";
        ctx.fillStyle = "white";
        ctx.textAlign = "left";
        ctx.fillText(this.text, padding, dialogue.top+fontSize+padding);
        ctx.textAlign = "right";
        for(let choiceNum = 0; choiceNum < this.choices.length; choiceNum++){
            if(choiceNum == this.highligtedChoice){
                ctx.fillStyle = "#999999";
            }else{
                ctx.fillStyle = "white";
            }
            ctx.fillText(this.choices[choiceNum].text, gameCanvas.width-padding, dialogue.top+padding+(fontSize+choicePadding)*(choiceNum+1)-choicePadding);
        }
        
    }
}



function drawAll(){
    ctx.drawImage(backgroundImg, 0, 0);
    dialogue.draw();
    currentPoint.draw();
    
}


let points = {
    start: new point("In the beninging"),
    ignore: new point("Game ends you are safe - neutral ending"),
    explore: new point("*You and your friend enter the temple")
}
//choices is [choicePoint, choiceText]
points.start.choices = [{_point: points.ignore, text: "Ignore"}, {_point: points.explore, text: "Explore"}, {_point: points.explore, text: "choice3"}]
var currentPoint = points.start;

var dialogue = new dialogueBox(120, "black");

drawAll();

rect = gameCanvas.getBoundingClientRect();
gameCanvas.addEventListener("mousemove", function(e){
    document.body.style.cursor = "default";
    let mX = e.clientX - rect.x;
    let mY = e.clientY - rect.y;
    currentPoint.getHighlightedChoice(mX, mY)
    drawAll();
});
gameCanvas.addEventListener("click", function(e){
    let mX = e.clientX - rect.x;
    let mY = e.clientY - rect.y;
});
