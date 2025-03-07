let gameCanvas = document.getElementById("gameCanvas");
let ctx = gameCanvas.getContext("2d");



let backgroundImg = document.getElementById("background");

let clickSound = new Audio("resources/sounds/click.wav");
let backgroundSound = new Audio("resources/sounds/background.m4a");
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
        this.img = "";
        this.imgs = [];
        
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
            if(currLength+ctx.measureText(words[word] + " ").width > gameCanvas.width-padding*2-this.getLongestChoice()){
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
        if(longestLength == 0){
            longestLength = ctx.measureText("next").width;
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
        if(choice > this.choices.length-1 && this.choices.length > 0){
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
        let tempImg = document.createElement("img");
        if(this.img == ""){
            tempImg.src = this.imgs[this.scroll];
        }else{
            tempImg.src = this.img;
        }
        ctx.drawImage(tempImg, 0, 0);
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
            if(currLength+ctx.measureText(words[word] + " ").width   > gameCanvas.width-padding*2-this.getLongestChoice()){
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
    constructor(x, y, width, height, text){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.text = text;
    }
    draw(){
        ctx.fillStyle = "black";
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.font = 40 + "px Arial";
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.fillText(this.text, this.x+this.width/2, this.y+38);
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
        requestAnimationFrame(animateText);
    }
    
}
function animateText(){

    dialogue.draw();
    currentPoint.draw();
    if(!(currentPoint.wordFrame < currentPoint.wordslength)){
        return;
    }
    currentPoint.wordFrame += 1;
    if(currentPoint.wordFrame <= currentPoint.wordslength){
        requestAnimationFrame(animateText);
    }
    
}
var startButton = new Button(gameCanvas.width/2-50, gameCanvas.height/2-25, 100, 50, "Play");
function startScreen(){
    ctx.drawImage(backgroundImg, 0, 0);
    startButton.draw();
}

let points = {
    start: new point("Ringg… Ringgg…. ☺ “Hi David. What’s up? Is there any problem with the research paper passed in?” ☺ “No, your research paper is fine.” ☺ “Then what’s the call about?” ☺ “The field team uncovered a new temple in the Amazon Rainforest, and I want you to explore it. This is a once in a lifetime opportunity, in fact I heard some whispers of a treasure hidden in the temple. However the temple is completely undiscovered so there will be risks. Do you accept the offer or not?”"),
    
    reject: new point("“I’m sorry David but I don’t think the risk is worth it. I think someone else might be better suited for this job” ☺ “Of course, I’ll contact you if there are any other sites you can possibly explore” ☺ “Thank you sir” ☺ Beep/Call Ends"),
    accept: new point("“Good, I’ll send a file with all the information we have right now. The field team will clear out two days from now, so you must be there by then. I expect a full report on your findings by next Monday. Remember that this project is highly classified, do not share this information with just anyone” ☺ Beep(or whatever sound your phone makes when a call ends)/Call Ends ☺ Preparing for his trip, John had an idea to invite his assistant, Sean, to help him with this assignment; after all, two heads were better than one. But David did say to keep the information classified, so maybe inviting Sean wouldn't be such a good idea."),

    notBringSean: new point("Two days later and an hour too long road trip John found himself standing in front of the temple. ☺  ☺ As he approached the temple he noticed that there were two levers at the base of the wall of the temple. One lever had mud crusted all over it, the other one looked thinner than a typical lever. ☺ “According to the file pulling one of the levers should lead into an entrance inside the temple” - John ☺ Which one should they pick?"),
    
    lever1: new point("John decided to pull the first lever. ☺ ☺ ☺ A rumbling sound echoed through the jungle, suddenly the stone that John was previously standing on slid open, which dropped him onto a pile of mud. Then they started sinking, and more quicksand was flowing in. John saw a ledge he could climb up but it did not look stable, the other choice is to find a way to stop the quicksand? ☺ What should John do?"),
    lever2: new point("There was a creaking sound then a piece of slab slid open revealing an entrance. John ventured into the temple. The passageway appeared to be never ending, and getting narrower and narrower. When the way was only as wide as John's shoulders the path diverged into two."),

    higherGround: new point("While John tries to reach higher ground he notices a crack in the wall that is letting all the sand in. He finds a stone and uses it to stop the quicksand. For a minute or so the quicksand seemed to be lessening, but then more quicksand started flooding in  ☺  ☺  ☺  John tried to get out but he failed and his body was lost forever in the quicksand. "),
    stopSand: new point("John hurriedly looked around for a way to stop the sand.  ☺  ☺  ☺ However the sand was too fast and soon he was under. "),
    biggerPath: new point("John picked up a random bone on the floor and tried to loosen a few stones to get a wider space.  ☺  ☺ However he accidentally managed to get the roof collapse on him."),
    continue: new point("So he kept on walking and walking and walking and walking and walking. After a while the tunnel widened and he arrived in front of two entrances.  ☺ Where should he go next?"),

    entrance1: new point("Entrance 1 turns out to be a trap and John ends up falling into the pit. Luckily the pit turned out to be not that deep so he managed to survive. At the bottom of the pit there are two holes leading to different ways. ☺ Which way should John go?"),
    entrance2: new point("John enters through the entrance but accidentally triggers the trap door and falls to his death."),

    hole1: new point("John crawls into the first hole and sees skeletons and carcasses of dead people and animals in the hole.  ☺  ☺ He turned around to try and get out but somehow the hole he went through was gone. John tried to find other ways to get out but eventually failed, after a while he joined the pile of bones in the corner"),
    hole2: new point("After crawling through mud and door he ended up in a room with an unlocked door. John entered the room and found stacks of all sorts of treasure. He stuffed all he could find in his bag and retraced his steps until he finally made his way out with the treasure."),
    findEscape: new point("John turned around to try to find another way out but he slipped and fell into Hole 1. ☺  ☺   The impact was too much for John’s body to handle so he died."),

    BringSean: new point("John quickly calls Sean to inform him of the details and plan the arrangements. Two days later and an hour too long road trip John and Sean found themselves standing in front of the temple. ☺ As they approached the temple they noticed that there were two levers at the base of the wall of the temple. One lever had mud crusted all over it, the other one looked thinner than a typical lever. ☺ “According to the file pulling one of the levers should lead into an entrance inside the temple” - Sean ☺ Which one should they pick?"),

    lever1b: new point("John and Sean decided to pull the first lever. A rumbling sound echoed through the jungle, suddenly the stone that John and Sean were previously standing on slid open, which dropped them onto a pile of mud. Then they started sinking, and more quicksand was flowing in. ☺ “Quick! We need to get out of here, it's not mud its quicksand” - Sean ☺ “Even if we find higher ground we might not find a way out, we need to block the quicksand from getting in.” - John ☺ What should John and Sean do?"),
    lever2b: new point("There was a creaking sound then a piece of slab slid open revealing an entrance. John and Sean ventured into the temple. The passageway appeared to be never ending, and getting narrower and narrower. When the way was only as wide as John and Sean’s shoulders the path diverged into two. ☺ Which path should they take?"),

    higherGroundb: new point("Sean tried to grab on the ledge and climb out of the sand. Despite him managing to grab the ledge, the ledge was too unstable and the wall collapsed on John and Sean."),
    stopSandb: new point("John sees that the quicksand was coming through a slot in the wall. Sean found a rock big enough to jam the flow and blocked the hole. Soon the level of quicksand stopped flowing and after a few tries John and Sean got out of the quicksand and through the opening of the wall(which was previously hidden by the quicksand). ☺ Past the openings they saw two entrances leading to different paths. ☺ Which way should they go?"),

    path1: new point("So they kept on walking and walking and walking. After a while the tunnel widened and they arrived in front of two entrances.  ☺ Where should they go next?"),
    path2: new point("Following the second path they kept on walking. Shortly they could see a light at the end of the tunnel. They were able to escape and make it out alive in the temple!"),

    entrance1b: new point("Entrance 1 led to two other tunnels, one emitting the sound of crickets and the other John could hear the squeaking of mice. Which one should they approach?"),
    entrance2b: new point("Choosing to enter the second entrance, they find a golden door which had a vault style lock. ☺ “Maybe we should avoid this and find a way out” - Sean ☺ “After all we went through we should at least try to find a way to crack the code” - John"),

    mouse: new point("John and Sean took a step to the tunnel leading to the sounds of mice. There were actually a lot of them, so John and Sean became the next meal of the mice."),
    cricket: new point("John and Sean easily get past the crickets, but find that it’s a dead end, so they turn around and go back to Path 1."),

    attempt: new point("John and Sean go to the door, which is sealed by a lock. ☺ “It seems like there are two ways to open it, through a puzzle or try to pick the lock“ - John"),
    leave: new point("Sean searched around for a way out and found a hidden tunnel covered by some plants. John and Sean followed the tunnel out of the tunnel safely."),
    
    puzzle: new point("John is now trying to solve the puzzle but it said that it needs one person to die. John and Sean thought that this seemed wrong, but still tried to find a solution. While John tried to figure out the problem he found two knives lying on the ground. ☺ Should they use the knives to their advantage or leave them?"),
    pickLock: new point("John attempted to pick the lock using the knives and after a few tries it actually worked. The door slid open leading to piles of gold and other treasure. Taking note on how to reach the treasure they eventually find their way out and lived happily ever after."),

    pickUp: new point("John picks it up, but Sean betrays you and stabs you dead, but ultimately kills himself too because of guilt."),
    ignore: new point("John tried to ignore knives and find a way out. Alas they couldn’t find one and they decided that a quick death would be better than dying of starvation so they chose to put the knife into good use."),


}

points.start.img = "resources/images/start.png";
points.accept.img = "resources/images/accept.png";
points.reject.img = "resources/images/reject.png";
points.BringSean.img = "resources/images/bring sean 1.png";
points.notBringSean.imgs = ["resources/images/dont bring sean 1.png", "resources/images/dont bring sean 2.png", "resources/images/dont bring sean 3.png", "resources/images/dont bring sean 3.png"];
points.lever1.imgs = ["resources/images/lever 1 1.png", "resources/images/lever 1 2.png", "resources/images/lever 1 3.png", "resources/images/lever 1 5.png", "resources/images/lever 1 5.png"];
points.stopSand.imgs = ["resources/images/stop sand 1.png", "resources/images/stop sand 2.png"];
points.higherGround.imgs = ["resources/images/find higher ground 1.png", "resources/images/find higher ground 2.png", "resources/images/find higher ground 3.png"];
points.lever2.imgs = ["resources/images/lever 2 1.png", "resources/images/lever 2 2.png", "resources/images/lever 2 3.png", "resources/images/lever 2 4.png"];
points.biggerPath.imgs = ["resources/images/bigger space 1.png", "resources/images/bigger space 2.png"];
points.continue.img = "resources/images/continue going.png";
points.entrance2.img = "resources/images/entrance 2.png";
points.entrance1.img = "resources/images/entrance 1.png";
points.hole1.imgs = ["resources/images/hole 1 1.png", "resources/images/hole 1 2.png"];
points.findEscape.imgs = ["resources/images/ignore holes.png", "resources/images/ignore holes 2.png"];


//choices is [choicePoint, choiceText]
points.start.choices = [{_point: points.accept, text: "Accept the offer"}, {_point: points.reject, text: "Reject the offer"}];
points.accept.choices = [{_point: points.BringSean, text: "Bring Sean"}, {_point: points.notBringSean, text: "Don't bring Sean"}];
points.notBringSean.choices = [{_point: points.lever1, text: "Lever 1"}, {_point: points.lever2, text: "Lever 2"}];
points.lever1.choices = [{_point: points.higherGround, text: "Go to higher ground"}, {_point: points.stopSand, text: "Find a way to stop the quicksand"}];
points.lever2.choices = [{_point: points.biggerPath, text: "Use a bone to create a bigger space"}, {_point: points.continue, text: "Continue going"}];
points.continue.choices = [{_point: points.entrance1, text: "Entrance 1"}, {_point: points.entrance2, text: "Entrance 2"}];
points.entrance1.choices = [{_point: points.hole1, text: "Hole 1"}, {_point: points.hole2, text: "Hole 2"}, {_point: points.findEscape, text: "Ignore and find more ways to escape"}];

points.BringSean.choices = [{_point: points.lever1b, text: "Lever 1"}, {_point: points.lever2b, text: "Lever 2"}];
points.lever1b.choices = [{_point: points.higherGroundb, text: "Go to higher ground"}, {_point: points.stopSandb, text: "Find a way to stop the quicksand"}];
points.lever2b.choices = [{_point: points.path1, text: "Path 1"}, {_point: points.path2, text: "Path 2"}];

points.path1.choices = [{_point: points.entrance1b, text: "Entrance 1"}, {_point: points.entrance2b, text: "Entrance 2"}];
points.stopSandb.choices = [{_point: points.entrance1b, text: "Entrance 1"}, {_point: points.entrance2b, text: "Entrance 2"}];

points.entrance1b.choices = [{_point: points.mouse, text: "Mouse"}, {_point: points.cricket, text: "Cricket"}];
points.cricket.choices = [{_point: points.path1, text: "Next"}];

points.entrance2b = [{_point: points.attempt, text: "Go and attempt"}, {_point: points.leave, text: "Leave"}];
points.attempt.choices = [{_point: points.puzzle, text: "Puzzle"}, {_point: points.pickLock, text: "Pick the lock"}];
points.puzzle.choices = [{_point: points.pickUp, text: "Pick up"}, {_point: points.ignore, text: "Ignore"}];

var currentPoint = points.entrance1;
var dialogue = new dialogueBox(120, "black");
var gameState = 0;
drawAll();

function update(e){
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
}

rect = gameCanvas.getBoundingClientRect();
addEventListener("mousemove", update);
addEventListener("mouseup", update);
gameCanvas.addEventListener("click", function(e){
    let mX = e.clientX - rect.x;
    let mY = e.clientY - rect.y;
    if(gameState == 0){
        if(startButton.touchingMouse(mX, mY)){
            gameState = 1;
            clickSound.play();
            drawAll();
            
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
        
        drawAll();
    }
});
