let gameCanvas = document.getElementById("gameCanvas");
let ctx = gameCanvas.getContext("2d");



let backgroundImg = document.getElementById("background");

let clickSound = new Audio("resources/sounds/click.wav");
let speakSound = new Audio("resources/sounds/dialogue.wav")
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
        this.wordFrame = 0;
        this.wordslength = 0;
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
        if(this.scroll < this.pageWords.length - 1){
            textLeft = ctx.measureText("next").width;
        }
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
        this.wordslength = words.length;
        let currLength = 0;
        let lineY = dialogue.top+fontSize+padding;
        for(let word = 0; word < this.wordFrame; word++){
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
        if(this.wordFrame < words.length){
            return;
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
class Button{
    constructor(x, y, width, height){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    draw(){
        ctx.fillStyle = "black";
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    touchingMouse(x, y){
        if(x >= this.x && x <= this.x + this.width && y >= this.y && y <= this.y + this.height){
            return true;
        }
        return false;
    }
}


function drawAll(){
    if(gameState == 0){
        startScreen();
    }
    else if(gameState == 1){
        currentPoint.getPages();
        ctx.drawImage(backgroundImg, 0, 0);
        requestAnimationFrame(animateText);
    }
    
}
function animateText(){

    dialogue.draw();
    currentPoint.draw();
    if(!(currentPoint.wordFrame < currentPoint.wordslength)){
        return;
    }
    speakSound.play();
    currentPoint.wordFrame += 1;
    if(currentPoint.wordFrame <= currentPoint.wordslength){
        requestAnimationFrame(animateText);
    }
    
}
var startButton = new Button(gameCanvas.width/2-50, gameCanvas.height/2-25, 100, 50)
function startScreen(){
    ctx.drawImage(backgroundImg, 0, 0);
    startButton.draw();
}

let points = {
    start: new point("Ringg… Ringgg…. ☺ “Hi David. What’s up? Is there any problem with the research paper passed in?” ☺ “No, your research paper is fine.” ☺ “Then what’s the call about?” ☺ “The field team uncovered a new temple in the Amazon Rainforest, and I want you to explore it. This is a once in a lifetime opportunity, in fact I heard some whispers of a treasure hidden in the temple. However the temple is completely undiscovered so there will be risks. Do you accept the offer or not?”"),

    accept: new point("“Good, I’ll send a file with all the information we have right now. The field team will clear out two days from now, so you must be there by then. I expect a full report on your findings by next Monday. Remember that this project is highly classified, do not share this information with just anyone” ☺ Beep(or whatever sound your phone makes when a call ends)/Call Ends ☺ Preparing for his trip, John had an idea to invite his assistant, Sean, to help him with this assignment; after all, two heads were better than one. But David did say to keep the information classified, so maybe inviting Sean wouldn't be such a good idea."),
    reject: new point("“I’m sorry David but I don’t think the risk is worth it. I think someone else might be better suited for this job” ☺ “Of course, I’ll contact you if there are any other sites you can possibly explore” ☺ “Thank you sir” ☺ Beep/Call Ends"),
    
    bringSean: new point("John quickly calls Sean to inform him of the details and plan the arrangements. Two days later and an hour too long road trip John and Sean found themselves standing in front of the temple. ☺ As they approached the temple they noticed that there were two levers at the base of the wall of the temple. One lever had mud crusted all over it, the other one looked thinner than a typical lever. ☺ “According to the file pulling one of the levers should lead into an entrance inside the temple” - Sean ☺ Which one should they pick?"),
    notBringSean: new point("Two days later and an hour too long road trip John found himself standing in front of the temple. ☺ As they approached the temple he noticed that there were two levers at the base of the wall of the temple. One lever had mud crusted all over it, the other one looked thinner than a typical lever. ☺ “According to the file pulling one of the levers should lead into an entrance inside the temple” - John ☺ Which one should they pick?"),
    neutralEnding: new point("You got neutral ending"),

    lever1: new point("John decided to pull the first lever. A rumbling sound echoed through the jungle, suddenly the stone that John was previously standing on slid open, which dropped them onto a pile of mud. Then they started sinking, and more quicksand was flowing in. John saw a ledge he could climb up but it did not look stable, the other choice is to find a way to stop the quicksand?"),
    lever2: new point("There was a creaking sound then a piece of slab slid open revealing an entrance. John and Sean ventured into the temple. The passageway appeared to be never ending, and getting narrower and narrower. When the way was only as wide as John and Sean’s shoulders the path diverged into two."),
    
    higherGround: new point("While John tries to reach higher ground he notices a crack in the wall that is letting all the sand in. He finds a stone and uses it to stop the quicksand. For a minute or so the quicksand seemed to be lessening, but then more quicksand started flooding in, John tried to get out but he failed and his body was lost forever in the quicksand. ☺ What should John do?"),
    stopSand: new point("John hurriedly looked around for a way to stop the sand. However the sand was too fast and soon he was under. "),
    bigSpace: new point("John picked up a random bone on the floor and tried to loosen a few stones to get a wider space. However he accidentally managed to get the roof collapse on him."),
    continueGoing: new point("So he kept on walking and walking and walking and walking and walking. After a while the tunnel widened and he arrived in front of two entrances. ☺ Where should they go next?"),

    neutralEnding2: new point(""),
    die1: new point(""),
    die2: new point(""),
    entrance1: new point("Entrance 1 turns out to be a trap and John ends up falling into the pit. Luckily the pit turned out to be not that deep so he managed to survive. At the bottom of the pit there are two holes leading to different ways. ☺ Which way should John go?"),
    entrance2: new point("John enters through the entrance but accidentally triggers the trap door and falls to his death."),

    lever1S: new point("John and Sean decided to pull the first lever. A rumbling sound echoed through the jungle, suddenly the stone that John and Sean were previously standing on slid open, which dropped them onto a pile of mud. Then they started sinking, and more quicksand was flowing in. ☺ “Quick! We need to get out of here, it's not mud its quicksand” - Sean ☺ “Even if we find higher ground we might not find a way out, we need to block the quicksand from getting in.” - John ☺ What should John and Sean do?"),
    lever2S: new point("There was a creaking sound then a piece of slab slid open revealing an entrance. John and Sean ventured into the temple. The passageway appeared to be never ending, and getting narrower and narrower. When the way was only as wide as John and Sean’s shoulders the path diverged into two. ☺ Which path should they take?"),

    higherGroundS: new point("Sean tried to grab on the ledge and climb out of the sand. Despite him managing to grab the ledge, the ledge was too unstable and the wall collapsed on John and Sean."),
    stopSandS: new point("John sees that the quicksand was coming through a slot in the wall. Sean found a rock big enough to jam the flow and blocked the hole. Soon the level of quicksand stopped flowing and after a few tries John and Sean got out of the quicksand and through the opening of the wall(which was previously hidden by the quicksand). ☺ Past the openings they saw two entrances leading to different paths. ☺ Which way should they go?"),
    path1: new point(""),
    path2: new point(""),

    badEnding: new point(""),
    entrance1S: new point(""),
    entrance2S: new point(""),
    entrance1P: new point(""),
    entrance2P: new point(""),
    neutralEnding3: new point(""),

    dieS: new point(""),
    gotopath1: new point(""),
    cricket: new point(""),
    mouse: new point(""),
    attempt: new point(""),
    leave: new point(""),
    gotopath12: new point(""),
    dieS2: new point(""),
    puzzle: new point(""),
    pickLock: new point(""),
    neutralEnding4: new point(""),

    dieS3: new point(""),
    goodEnding: new point(""),

}


//choices is [choicePoint, choiceText]
points.start.choices = [{_point: points.accept, text: "Accept the offer"}, {_point: points.reject, text: "Reject the offer"}];
points.accept.choices = [{_point: points.bringSean, text: "Bring Sean"}, {_point: points.notBringSean, text: "Don't bring Sean"}];
points.reject.choices = [{_point: points.neutralEnding, text: "Next"}];
points.notBringSean.choices = [{_point: points.lever1, text: "lever 1"}, {_point: points.lever2, text: "lever 2"}];
points.lever1.choices = [{_point: points.higherGround, text: "Go to higher ground"}, {_point: points.stopSand, text: "Find a way to stop the quicksand"}];
points.higherGround.choices = [{_point: points.neutralEnding2, text: "Next"}];
points.stopSand.choices = [{_point: points.die, text: "Next"}];
points.lever2.choices = [{_point: points.bigSpace, text: "big space"}, {_point: points.continueGoing, text: "go"}];
points.bigSpace.choices = [{_point: points.die, text: "Next"}];
points.continueGoing.choices = [{_point: points.entrance1, text: "entrance 1"}, {_point: points.entrance2, text: "entrance 2"}];

points.bringSean.choices = [{_point: points.lever1S, text: "Lever 1"}, {_point: points.lever2S, text: "Lever 2"}];

points.lever1S.choices =  [{_point: points.higherGroundS, text: "Go to higher ground"}, {_point: points.stopSandS, text: "Find a way to stop the quicksand"}];
points.higherGroundS.choices = [{_point: points.badEnding, text: "Next"}];
points.stopSandS.choices = [{_point: points.entrance1S, text: "Entrance 1"}, {_point: points.entrance2S, text: "Entrance 2"}];
points.entrance1S.choices = [{_point: points.dieS, text: "Next"}];
points.entrance2S.choices = [{_point: points.gotopath1, text: "Next"}];

points.lever2S.choices = [{_point: points.path1, text: "path1"}, {_point: points.path2, text: "path2"}];
points.path2.choices = [{_point: points.neutralEnding3, text: "next"}];
points.path1.choices = [{_point: points.entrance1P, text: "entrance 1"}, {_point: points.entrance2P, text: "entrance 2"}];
points.entrance1P.choices = [{_point: points.cricket, text: "entrance 1"}, {_point: points.mouse, text: "entrance 2"}];
points.cricket.choices = [{_point: points.gotopath1, text: "next"}];
points.mouse.choices = [{_point: points.dieS2, text: "next"}];
points.entrance2P.choices = [{_point: points.attempt, text: "attempt"}, {_point: points.leave, text: "leave"}];
points.leave.choices = [{_point: points.neutralEnding4, text: "next"}];
points.puzzle.choices = [{_point: points.dieS3, text: "next"}];
points.pickLock.choices = [{_point: points.goodEnding, text: "next"}];
var currentPoint = points.start;
var dialogue = new dialogueBox(120, "black");
var gameState = 0;
drawAll();


rect = gameCanvas.getBoundingClientRect();
addEventListener("mousemove", function(e){
    document.body.style.cursor = "default";
    let mX = e.clientX - rect.x;
    let mY = e.clientY - rect.y;
    if(gameState == 0){
        if(startButton.touchingMouse(mX, mY)){
            document.body.style.cursor = "pointer";
        }
    }
    else if(gameState == 1){
        currentPoint.getHighlightedChoice(mX, mY)
        if(currentPoint.highligtedChoice > -1 || currentPoint.next == 1){
            document.body.style.cursor = "pointer";
        }
        drawAll();
    }
});
gameCanvas.addEventListener("click", function(e){
    let mX = e.clientX - rect.x;
    let mY = e.clientY - rect.y;
    if(gameState == 0){
        if(startButton.touchingMouse(mX, mY)){
            gameState = 1;
        }
    }
    else if(gameState == 1){
        currentPoint.getHighlightedChoice(mX, mY);
        if(currentPoint.scroll < currentPoint.pageWords.length - 1){
            if(currentPoint.next == 1){
                currentPoint.wordFrame = 0;
                currentPoint.scroll += 1;
                clickSound.play();
            }
        }else{
            if(currentPoint.highligtedChoice > -1){
                currentPoint.wordFrame = 0;
                currentPoint = currentPoint.choices[currentPoint.highligtedChoice]._point;
                clickSound.play();
                
            }
            
        }
        
        drawAll()
    }
});
