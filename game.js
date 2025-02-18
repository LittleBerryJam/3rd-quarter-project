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
        this.textTooLong = false;
        this.scroll = 0;
        this.pageWords = [];
    }
    getPages(){
        let words = this.text.split(" ");
        let currLength = 0;
        let currWords = "";
        let lineY = dialogue.top+fontSize+padding;
        for(let word = 0; word < words.length; word++){
            if(currLength+ctx.measureText(words[word] + " ").width   > gameCanvas.width-padding-this.getLongestChoice()){
                currLength = 0;
                lineY += fontSize + choicePadding;
            }
            if(lineY > gameCanvas.height){
                this.textTooLong = true;
                this.pageWords.push(currWords);
                currWords = "";
                currLength = 0;
            }
            currWords += words[word] + " ";
            currLength += ctx.measureText(words[word] + " ").width;
            
            
        }
    }
    getLongestChoice(){
        let longestLength = 0;
        for(let choiceNum = 0; choiceNum < this.choices.length; choiceNum++){
            let length = ctx.measureText(this.choices[choiceNum].text).width;
            if(length > longestLength){
                longestLength = length;
            }
        }
        return longestLength;
    }
    getHighlightedChoice(x, y){
        let choice = Math.floor((y-dialogue.top-padding)/(fontSize+choicePadding));
        let textLeft = this.getLongestChoice();
        if(x < gameCanvas.width-padding-textLeft || x > gameCanvas.width){
            choice = -1;
        }
        if(choice > this.choices.length-1){
            this.highligtedChoice = -1;
        }else{
            this.highligtedChoice = choice;
        }
        if(this.textTooLong){
            this.highligtedChoice = -1;
        }
        
        
    }
    draw(){
        ctx.font = fontSize + "px Arial";
        ctx.fillStyle = "white";
        ctx.textAlign = "left";
        let words = this.text.split(" ");
        let currLength = 0;
        let lineY = dialogue.top+fontSize+padding;
        for(let word = 0; word < words.length; word++){
            if(currLength+ctx.measureText(words[word] + " ").width   > gameCanvas.width-padding-this.getLongestChoice()){
                currLength = 0;
                lineY += fontSize + choicePadding;
            }
            if(lineY > gameCanvas.height){
                this.textTooLong = true;
                break;
            }
            ctx.fillText(words[word], padding+currLength, lineY);
            currLength += ctx.measureText(words[word] + " ").width;
            
            
        }
        // ctx.fillText(this.text, padding, dialogue.top+fontSize+padding);
        ctx.textAlign = "right";
        if(!this.textTooLong){
            
            for(let choiceNum = 0; choiceNum < this.choices.length; choiceNum++){
                if(choiceNum == this.highligtedChoice){
                    ctx.fillStyle = "#999999";
                }else{
                    ctx.fillStyle = "white";
                }
                ctx.fillText(this.choices[choiceNum].text, gameCanvas.width-padding, dialogue.top+padding+(fontSize+choicePadding)*(choiceNum+1)-choicePadding);
            }
        }else{
            ctx.fillText("next", gameCanvas.width-padding, dialogue.top+padding+fontSize);
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
    explore: new point("Explore"),

    levers: new point("John goes to the temple with Sean and you notice there are two levers at the entrances. Which one do you choose?"),
    entrances: new point("You go to the temple alone and you notice there are two entrances to the temple (insert descriptions of entrances). Which one do you choose?"),

    lever1: new point("John and Sean decide to pull the first lever. A rumbling sound echoed through the jungle, then the stone that John and Sean were previously standing on slid open, which dropped them onto a pile of (insert description of quicksand)."),
    lever2: new point("There was a creaking sound then a piece of slab slid open revealing an entrance. Blah blah Hallway getting smaller and smaller"),

    entrance1: new point("Entrance 1 has a kind of eerie vibe, emitting random particles while the sounds of somewhat small groups of insects sound near, you decide to follow the sound, but you're faced with 2 obstacles, a cricket, and a mouse, what do you pick?"),
    entrance2: new point("Entrance 2"),

    getHigh: new point("They tried to climb out of the quicksand but they failed and they died an unfortunate death blah blah"),
    stopSand: new point("______ notices(find other synonyms for notices) that the quicksand was coming through a slot in the wall. (they find smth to block the hole blah blah and they make it out alive"),

    

}


//choices is [choicePoint, choiceText]

points.start.choices = [{_point: points.ignore, text: "Ignore"}, {_point: points.explore, text: "Explore"}];
points.explore.choices = [{_point: points.levers, text: "Bring friend"}, {_point: points.entrances, text: "Dont bring friend"}];
points.levers.choices = [{_point: points.lever1, text: "Lever 1"}, {_point: points.lever2, text: "Lever 2"}];
points.entrances.choices = [{_point: points.entrance1, text: "Entrance 1"}, {_point: points.entrance2, text: "Entrance 2"}];
points.lever1.choices = [{_point: points.getHigh, text: "Go to higher ground"}, {_point: points.stopSand, text: "Find a way to stop the quicksand"}];
points.lever2.choices = [{_point: points.getHigh, text: "Path 1"}, {_point: points.stopSand, text: "Path 2"}]
var currentPoint = points.start;

var dialogue = new dialogueBox(120, "black");

drawAll();

rect = gameCanvas.getBoundingClientRect();
addEventListener("mousemove", function(e){
    document.body.style.cursor = "default";
    let mX = e.clientX - rect.x;
    let mY = e.clientY - rect.y;
    currentPoint.getHighlightedChoice(mX, mY)
    if(currentPoint.highligtedChoice > -1){
        document.body.style.cursor = "pointer";
    }
    drawAll();
});
gameCanvas.addEventListener("click", function(e){
    let mX = e.clientX - rect.x;
    let mY = e.clientY - rect.y;
    currentPoint.getHighlightedChoice(mX, mY);
    currentPoint = currentPoint.choices[currentPoint.highligtedChoice]._point;
    drawAll()
});
