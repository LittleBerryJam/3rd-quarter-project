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
        this.next = -1;
    }
    getPages(){
        ctx.font = fontSize + "px Arial";
        this.pageWords = [];
        let words = this.text.split(" ");
        let currLength = 0;
        let currWords = "";
        let lineY = dialogue.top+fontSize+padding;
        for(let word = 0; word < words.length; word++){
            if(words[word] == "☺"){
                currLength = 0;
                lineY += fontSize + choicePadding;
            }
            if(currLength+ctx.measureText(words[word] + " ").width > gameCanvas.width-padding-this.getLongestChoice()){
                currLength = 0;
                lineY += fontSize + choicePadding;
            }
            if(lineY > gameCanvas.height){
                this.textTooLong = true;
                this.pageWords.push(currWords);
                lineY = dialogue.top+fontSize+padding;
                currWords = "";
                currLength = 0;
            }
            if(words[word] == "☺"){
                if(currWords.length > 0){
                    currWords += words[word] + " ";
                }
                
            }else{
                currWords += words[word] + " ";
                currLength += ctx.measureText(words[word] + " ").width;
            }
            
            
        }
        this.pageWords.push(currWords);
        
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
        this.next = -1;
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
        if(this.scroll < this.pageWords.length - 1){
            if(this.highligtedChoice == 0){
                this.next = 1;
            }
            this.highligtedChoice = -1;
        }
        
        
    }
    draw(){
        ctx.font = fontSize + "px Arial";
        ctx.fillStyle = "white";
        ctx.textAlign = "left";
        let words = this.pageWords[this.scroll].split(" ");
        let currLength = 0;
        let lineY = dialogue.top+fontSize+padding;
        for(let word = 0; word < words.length; word++){
            if(words[word] == "☺"){
                currLength = 0;
                lineY += fontSize + choicePadding;
                continue;
            }
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
        ctx.textAlign = "right";
        if(this.scroll == this.pageWords.length - 1){
            
            for(let choiceNum = 0; choiceNum < this.choices.length; choiceNum++){
                if(choiceNum == this.highligtedChoice){
                    ctx.fillStyle = "#999999";
                }else{
                    ctx.fillStyle = "white";
                }
                ctx.fillText(this.choices[choiceNum].text, gameCanvas.width-padding, dialogue.top+padding+(fontSize+choicePadding)*(choiceNum+1)-choicePadding);
            }
        }else{
            if(this.next == 1){
                ctx.fillStyle = "#999999";
            }else{
                ctx.fillStyle = "white";
            }
            ctx.fillText("next", gameCanvas.width-padding, dialogue.top+padding+fontSize);
        }
        
    }
}



function drawAll(){
    currentPoint.getPages();
    ctx.drawImage(backgroundImg, 0, 0);
    dialogue.draw();
    currentPoint.draw();
    
}

let points = {
    start: new point("Ringg… Ringgg…. ☺ “Hi David. What’s up? Is there any problem with the research paper passed in?” ☺ “No, your research paper is fine.” ☺ “Then what’s the call about?” ☺ “The field team uncovered a new temple in the Amazon Rainforest, and I want you to explore it. This is a once in a lifetime opportunity, in fact I heard some whispers of a treasure hidden in the temple. However the temple is completely undiscovered so there will be risks. Do you accept the offer or not?”"),

    accept: new point("“Good, I’ll send a file with all the information we have right now. The field team will clear out two days from now, so you must be there by then. I expect a full report on your findings by next Monday. Remember that this project is highly classified, do not share this information with just anyone” ☺ Beep(or whatever sound your phone makes when a call ends)/Call Ends ☺ Preparing for his trip, John had an idea to invite his assistant, Sean, to help him with this assignment; after all, two heads were better than one. But David did say to keep the information classified, so maybe inviting Sean wouldn't be such a good idea."),
    reject: new point("“I’m sorry David but I don’t think the risk is worth it. I think someone else might be better suited for this job” ☺ “Of course, I’ll contact you if there are any other sites you can possibly explore” ☺ “Thank you sir” ☺ Beep/Call Ends"),
    
    bringSean: new point("John quickly calls Sean to inform him of the details and plan the arrangements. Two days later and an hour too long road trip John and Sean found themselves standing in front of the temple. ☺ As they approached the temple they noticed that there were two levers at the base of the wall of the temple. One lever had mud crusted all over it, the other one looked thinner than a typical lever. ☺ “According to the file pulling one of the levers should lead into an entrance inside the temple” - Sean ☺ Which one should they pick?"),
    notBringSean: new point("In the beninging"),
    neutralEnding: new point("You got neutral ending"),

    lever1: new point("In the beninging"),
    lever2: new point(""),
    
    higherGround: new point(""),
    stopSand: new point(""),
    bigSpace: new point(""),
    continueGoing: new point(""),

    neutralEnding2: new point(""),
    die: new point(""),
    entrance1: new point(""),   
    entrance2: new point("")

}


//choices is [choicePoint, choiceText]
points.start.choices = [{_point: points.accept, text: "Accept the offer"}, {_point: points.reject, text: "Reject the offer"}];
points.accept.choices = [{_point: points.bringSean, text: "Bring Sean"}, {_point: points.notBringSean, text: "Don't bring Sean"}];
points.reject.choices = [{_point: points.neutralEnding, text: "Next"}];
points.notBringSean.choices = [{_point: points.lever1, text: "lever 1"}, {_point: points.lever2, text: "lever 2"}];
points.lever1.choices = [{_point: points.higherGround, text: "higher ground"}, {_point: points.stopSand, text: "stopsand"}];
points.higherGround.choices = [{_point: points.neutralEnding2, text: "Next"}];
points.higherGround.choices = [{_point: points.die, text: "Next"}];
points.lever2.choices = [{_point: points.bigSpace, text: "big space"}, {_point: points.continueGoing, text: "go"}];
points.bigSpace.choices = [{_point: points.die, text: "Next"}];
points.continueGoing.choices = [{_point: points.entrance1, text: "entrance 1"}, {_point: points.entrance2, text: "entrance 2"}];

var currentPoint = points.start;
var dialogue = new dialogueBox(120, "black");

drawAll();


rect = gameCanvas.getBoundingClientRect();
addEventListener("mousemove", function(e){
    document.body.style.cursor = "default";
    let mX = e.clientX - rect.x;
    let mY = e.clientY - rect.y;
    currentPoint.getHighlightedChoice(mX, mY)
    if(currentPoint.highligtedChoice > -1 || currentPoint.next == 1){
        document.body.style.cursor = "pointer";
    }
    drawAll();
});
gameCanvas.addEventListener("click", function(e){
    let mX = e.clientX - rect.x;
    let mY = e.clientY - rect.y;
    currentPoint.getHighlightedChoice(mX, mY);
    if(currentPoint.scroll < currentPoint.pageWords.length - 1){
        if(currentPoint.next == 1){
            currentPoint.scroll += 1;
        }
    }else{
        if(currentPoint.highligtedChoice > -1){
            currentPoint = currentPoint.choices[currentPoint.highligtedChoice]._point;
        }
        
    }
    
    drawAll()
});
