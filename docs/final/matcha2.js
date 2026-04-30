// NOTE: Arduino serial communication removed. 
// Navigation is now done via:
//   - Mouse click on buttons to confirm/advance
//   - Left/Right arrow keys to move between choices

let bgImg, startScreen, logoImg;
let stage = 0;
let kettleChoice = 2;
let currentHighlighted = 2;
let stageStartTime = 0;
let bowlChoice = 2;
let totalTime = 0;
let cupChoice = 2;
var jersey25;
let totalHomeworkTime = 0;
let confettiParticles = [];
let confettiInitialized = false;
var figTree;

// --- Mouse state ---
// We track a "button was clicked" flag, reset each draw frame after reading
let mouseClickedThisFrame = false;

function preload() {
    logoImg = loadImage("./assets/logo.png");
    jersey25 = loadFont("Jersey25-Regular.ttf");
    figTree = loadFont("./assets/Figtree-VariableFont_wght.ttf")
    kettle1Img = loadImage("./assets/classic_electric_kettle.png");
    kettle2Img = loadImage("./assets/green_kettle.png");
    kettle3Img = loadImage("./assets/graves_kettle.png");
    bowlImg1 = loadImage("./assets/two_tone_bowl.png");
    bowlImg2 = loadImage("./assets/bubble_bowl.png");
    bowlImg3 = loadImage("./assets/flower_bowl.png");
    whisk = loadImage("./assets/whisk.gif");
    water = loadImage("./assets/water.png");
    soakWhisk = loadImage("./assets/soak_whisk.png");
    sift = loadImage("./assets/sift.png");
    cupImg1 = loadImage("./assets/cup_ice.png");
    cupImg2 = loadImage("./assets/hot_mug.png");
    cupImg3 = loadImage("./assets/jar_ice.png");
    milk = loadImage("./assets/pour_milk.png");
    spoon = loadImage("./assets/spoon.png");
    cupFinal = loadImage("./assets/cup_final.png");
    jarFinal = loadImage("./assets/jar_final.png");
    mugFinal = loadImage("./assets/mug_final.png");
    steam = loadImage("./assets/steam.gif");
}

function setup() {
    canvas = createCanvas(800, 500);
    centerCanvas();
}

// p5.js built-in: fires once per mouse click
function mouseClicked() {
    mouseClickedThisFrame = true;
}

// p5.js built-in: fires once per key press — handles left/right arrow navigation
// and Enter/Return key to confirm selections or advance the game
function keyPressed() {
    // Left/Right arrow keys: navigate choices on selection pages
    if (stage === 2 || stage === 5 || stage === 10) {
        if (keyCode === LEFT_ARROW) {
            if (currentHighlighted === 2) currentHighlighted = 1;
            else if (currentHighlighted === 3) currentHighlighted = 2;
        } else if (keyCode === RIGHT_ARROW) {
            if (currentHighlighted === 2) currentHighlighted = 3;
            else if (currentHighlighted === 1) currentHighlighted = 2;
        }
    }

    // Enter/Return key: same as clicking the active button on any stage
    if (keyCode === ENTER || keyCode === RETURN) {
        if (stage === 0) {
            // Start page → go to instructions
            stage = 1;
        } else if (stage === 1) {
            // Instructions page → go to kettle choice
            stage = 2;
        } else if (stage === 2) {
            // Kettle choice: confirm whichever option is highlighted
            kettleChoice = currentHighlighted;
            stage = 3;
        } else if (stage === 3) {
            // Kettle chosen confirmation → start first task
            stage = 4;
            stageStartTime = millis();
        } else if (stage === 4) {
            // Task one → celebration modal
            totalHomeworkTime += Math.floor((millis() - stageStartTime) / 1000);
            stage = 4.5;
        } else if (stage === 4.5) {
            // Celebration modal → bowl choice
            stage = 5;
            currentHighlighted = 2;
        } else if (stage === 5) {
            // Bowl choice: confirm whichever option is highlighted
            bowlChoice = currentHighlighted;
            stage = 6;
        } else if (stage === 6) {
            // Bowl chosen confirmation → start second task
            stage = 7;
            stageStartTime = millis();
        } else if (stage === 7) {
            // Task two → finish task two screen
            totalHomeworkTime += Math.floor((millis() - stageStartTime) / 1000);
            stage = 8;
        } else if (stage === 8) {
            // Finish task two → start third task
            stage = 9;
            stageStartTime = millis();
        } else if (stage === 9) {
            // Task three → celebration modal
            totalHomeworkTime += Math.floor((millis() - stageStartTime) / 1000);
            stage = 9.5;
        } else if (stage === 9.5) {
            // Celebration modal → cup choice
            stage = 10;
            currentHighlighted = 2;
        } else if (stage === 10) {
            // Cup choice: confirm whichever option is highlighted
            cupChoice = currentHighlighted;
            stage = 11;
        } else if (stage === 11) {
            // Cup chosen confirmation → start fourth task
            stage = 12;
            stageStartTime = millis();
        } else if (stage === 12) {
            // Task four → end page
            totalHomeworkTime += Math.floor((millis() - stageStartTime) / 1000);
            stage = 13;
        } else if (stage === 13) {
            // End page → restart, reset all globals
            stage = 0;
            kettleChoice = 2;
            currentHighlighted = 2;
            stageStartTime = 0;
            bowlChoice = 2;
            totalTime = 0;
            cupChoice = 2;
            totalHomeworkTime = 0;
            confettiInitialized = false;
            confettiParticles = [];
        }
    }
}

function draw() {
    if (stage === 0) {
        startPage();
    } else if (stage === 1) {
        instructionsPage();
    } else if (stage === 2) {
        chooseKettlePage();
    } else if (stage === 3) {
        kettleChosen();
    } else if (stage === 4) {
        taskOnePage();
    } else if (stage === 4.5) {
        celebrationModal("Woo hoo! You finished your first task in " + totalTime + " and the water is now boiling!", 5);
    } else if (stage === 5) {
        chooseBowlPage();
    } else if (stage === 6) {
        bowlChosen();
    } else if (stage === 7) {
        taskTwoPage();
    } else if (stage === 8) {
        finishTaskTwo();
    } else if (stage === 9) {
        taskThreePage();
    } else if (stage === 9.5) {
        celebrationModal("Woo hoo! You finished your third task in " + totalTime + " and the matcha has been whisked!", 10);
    } else if (stage === 10) {
        chooseCupPage();
    } else if (stage === 11) {
        cupChosen();
    } else if (stage === 12) {
        taskFourPage();
    } else if (stage === 13) {
        endPage();
    }

    // Reset the click flag at the end of each draw frame
    mouseClickedThisFrame = false;
}

// Helper: returns true if mouse is inside a rectangle (x, y, w, h)
function mouseOverRect(rx, ry, rw, rh) {
    return mouseX >= rx && mouseX <= rx + rw && mouseY >= ry && mouseY <= ry + rh;
}

// ------------------ PAGE FUNCTIONS ------------------

function startPage() {
    background("#BACDB0");
    image(logoImg, 100, 100, 634, 199.84);
    fill("#134611");
    rect(325, 300, 150, 40);
    textSize(24);
    fill("#DEE9D8");
    textAlign(CENTER, CENTER);
    textFont(jersey25);
    text("Start Game", 400, 319);
    fill("#134611");
    text(">", 305, 319);
    text("<", 495, 319);

    // Advance on click inside the button rect
    if (mouseClickedThisFrame && mouseOverRect(325, 300, 150, 40)) {
        stage = 1;
    }
}

function instructionsPage() {
    background("#BACDB0");
    fill("#DEE9D8");
    rect(50, 50, 700, 400);
    fill("#134611");
    textFont(jersey25);
    textSize(28);
    textAlign(LEFT);
    text("Instructions", 75, 100);
    textSize(20);
    textFont(figTree);
    text("Before starting, remove any distractions.", 75, 150);
    text("Break up your homework into four tasks (This could be one assignment split into smaller parts, or four separate assignments).", 75, 200, 650);
    text("Each task will be paired with a step while making a matcha latte. You will move onto the next step in the game when you finish a homework task!", 75, 265, 650);
    text("Lets get started by choosing your first item!", 75, 340);
    fill("#134611");
    rect(350, 390, 150, 40);
    textSize(24);
    fill("#DEE9D8");
    textAlign(CENTER, CENTER);
    textFont(jersey25);
    text("Start", 425, 408);
    fill("#134611");
    text(">", 335, 410);
    text("<", 515, 410);

    if (mouseClickedThisFrame && mouseOverRect(350, 390, 150, 40)) {
        stage = 2;
    }
}

function chooseKettlePage() {
    background("#DEE9D8");
    fill("#134611");
    textAlign(CENTER);
    textFont(jersey25);
    textSize(40);
    text("Pick a kettle to boil your water in!", 400, 50);
    rect(65, 315, 170, 40);
    rect(320, 315, 150, 40);
    rect(535, 315, 210, 40);
    fill("#DEE9D8");
    textAlign(LEFT, TOP);
    textSize(24);
    text("Classic Electric", 80, 325);
    text("Green Electric", 330, 325);
    text("Graves Stove Kettle", 550, 325);
    image(kettle1Img, 65, 125, 190, 190);
    image(kettle2Img, 300, 125, 210, 210);
    image(kettle3Img, 550, 125, 190, 190);

    // Draw highlight indicators based on currentHighlighted
    fill("#134611");
    if (currentHighlighted === 1) {
        text(">", 45, 325);
        text("<", 245, 325);
    } else if (currentHighlighted === 2) {
        text(">", 300, 325);
        text("<", 475, 325);
    } else if (currentHighlighted === 3) {
        text(">", 515, 325);
        text("<", 755, 325);
    }

    // Click on a kettle button OR its image to select it
    if (mouseClickedThisFrame) {
        if (mouseOverRect(65, 125, 190, 230)) {   // left kettle image + button area
            currentHighlighted = 1;
            kettleChoice = 1;
            stage = 3;
        } else if (mouseOverRect(300, 125, 210, 230)) { // center
            currentHighlighted = 2;
            kettleChoice = 2;
            stage = 3;
        } else if (mouseOverRect(535, 125, 210, 230)) { // right
            currentHighlighted = 3;
            kettleChoice = 3;
            stage = 3;
        }
    }
}

function kettleChosen() {
    background("#DEE9D8");
    fill("#134611");
    textAlign(CENTER);
    textFont(jersey25);
    textSize(40);
    if (kettleChoice === 1) {
        text("You have chosen the Classic Electric kettle!", 400, 50);
        stroke("#355834");
        strokeWeight(2);
        fill("#DEE9D8");
        rect(65, 315, 170, 40);
        strokeWeight(0);
        fill("#134611");
        textAlign(LEFT, TOP);
        textSize(24);
        text("Classic Electric", 80, 325);
        fill("#134611");
        textAlign(LEFT, TOP);
        textSize(24);
        text("Green Electric", 330, 325);
        text("Graves Stove Kettle", 550, 325);
    } else if (kettleChoice === 2) {
        text("You have chosen the Green Electric kettle!", 400, 50);
        stroke("#355834");
        strokeWeight(2);
        fill("#DEE9D8");
        rect(320, 315, 150, 40);
        strokeWeight(0);
        fill("#134611");
        textAlign(LEFT, TOP);
        textSize(24);
        text("Green Electric", 330, 325);
        fill("#134611");
        textAlign(LEFT, TOP);
        textSize(24);
        text("Classic Electric", 80, 325);
        text("Graves Stove Kettle", 550, 325);
    } else if (kettleChoice === 3) {
        text("You have chosen the Graves Stove Kettle!", 400, 50);
        stroke("#355834");
        strokeWeight(2);
        fill("#DEE9D8");
        rect(535, 315, 210, 40);
        strokeWeight(0);
        fill("#134611");
        textAlign(LEFT, TOP);
        textSize(24);
        text("Graves Stove Kettle", 550, 325);
        fill("#134611");
        textAlign(LEFT, TOP);
        textSize(24);
        text("Classic Electric", 80, 325);
        text("Green Electric", 330, 325);
    }
    image(kettle1Img, 65, 125, 190, 190);
    image(kettle2Img, 300, 125, 210, 210);
    image(kettle3Img, 550, 125, 190, 190);
    strokeWeight(0);
    fill("#134611");
    rect(420, 400, 330, 40);
    fill("#DEE9D8");
    textSize(24);
    text("Click to start first homework task", 430, 410);
    fill("#134611");
    text(">", 400, 410);
    text("<", 760, 410);

    if (mouseClickedThisFrame && mouseOverRect(420, 400, 330, 40)) {
        stage = 4;
        stageStartTime = millis();
    }
}

function taskOnePage() {
    let timeElapsed = Math.floor((millis() - stageStartTime) / 1000);
    let minutes = Math.floor(timeElapsed / 60);
    let seconds = timeElapsed % 60;
    let timeElapsedFormatted = nf(minutes, 2) + ":" + nf(seconds, 2);
    totalTime = timeElapsedFormatted;

    background("#DEE9D8");
    fill("#134611");
    textAlign(LEFT);
    textFont(jersey25);
    text("Time Elapsed: " + timeElapsedFormatted, 25, 470);
    fill("#BACDB0");
    rect(540, 200, 250, 130);
    fill("#134611");
    textSize(20);
    text("Complete your first homework task while the water boils!", 550, 210, 240);
    text("Press the button to continue making your latte when done.", 550, 270, 250);
    strokeWeight(0);
    fill("#134611");
    rect(600, 450, 150, 40);
    textSize(24);
    fill("#DEE9D8");
    text("I've Finished!", 610, 460);
    fill("#134611");
    text(">", 580, 460);
    text("<", 760, 460);

    if (kettleChoice === 1) {
        image(kettle1Img, 200, 125, 300, 300);
        image(steam, 105, 40, 150, 150);
    } else if (kettleChoice === 2) {
        image(kettle2Img, 200, 125, 300, 300);
        image(steam, 85, 60, 150, 150);
    } else if (kettleChoice === 3) {
        image(kettle3Img, 200, 125, 300, 300);
        image(steam, 85, 60, 150, 150);
    }

    if (mouseClickedThisFrame && mouseOverRect(600, 450, 150, 40)) {
        totalHomeworkTime += Math.floor((millis() - stageStartTime) / 1000);
        stage = 4.5;
    }
}

function celebrationModal(message, nextStage) {
    background("#DEE9D8");
    fill(0, 0, 0, 80);
    rect(0, 0, width, height);
    fill("#BACDB0");
    stroke("#134611");
    strokeWeight(1);
    rect(175, 150, 450, 200);
    strokeWeight(0);
    fill("#134611");
    textFont(jersey25);
    textSize(22);
    textAlign(CENTER, CENTER);
    text(message, 210, 225, 390);
    fill("#134611");
    rect(300, 295, 200, 40);
    fill("#DEE9D8");
    textSize(24);
    text("Continue", 400, 314);
    fill("#134611");
    text(">", 278, 314);
    text("<", 522, 314);

    if (mouseClickedThisFrame && mouseOverRect(300, 295, 200, 40)) {
        stage = nextStage;
        currentHighlighted = 2;
    }
}

function chooseBowlPage() {
    background("#DEE9D8");
    fill("#134611");
    textAlign(CENTER);
    textFont(jersey25);
    textSize(40);
    text("Pick a bowl to sift your matcha into!", 400, 50);
    rect(65, 315, 190, 40);
    rect(320, 315, 160, 40);
    rect(535, 315, 175, 40);
    fill("#DEE9D8");
    textAlign(LEFT, TOP);
    textSize(24);
    text("Two Tone Chawan", 80, 325);
    text("Bubble Chawan", 330, 325);
    text("Flower Chawan", 550, 325);
    image(bowlImg1, 65, 125, 190, 190);
    image(bowlImg2, 300, 125, 190, 190);
    image(bowlImg3, 550, 125, 190, 190);

    fill("#134611");
    if (currentHighlighted === 1) {
        text(">", 45, 325);
        text("<", 265, 325);
    } else if (currentHighlighted === 2) {
        text(">", 300, 325);
        text("<", 485, 325);
    } else if (currentHighlighted === 3) {
        text(">", 515, 325);
        text("<", 725, 325);
    }

    if (mouseClickedThisFrame) {
        if (mouseOverRect(65, 125, 190, 230)) {
            bowlChoice = 1;
            currentHighlighted = 1;
            stage = 6;
        } else if (mouseOverRect(300, 125, 190, 230)) {
            bowlChoice = 2;
            currentHighlighted = 2;
            stage = 6;
        } else if (mouseOverRect(535, 125, 190, 230)) {
            bowlChoice = 3;
            currentHighlighted = 3;
            stage = 6;
        }
    }
}

function bowlChosen() {
    background("#DEE9D8");
    fill("#134611");
    textAlign(CENTER);
    textFont(jersey25);
    textSize(40);
    if (bowlChoice === 1) {
        text("You have chosen the Two Tone Chawan!", 400, 50);
        stroke("#355834");
        strokeWeight(2);
        fill("#DEE9D8");
        rect(65, 315, 190, 40);
        strokeWeight(0);
        fill("#134611");
        textAlign(LEFT, TOP);
        textSize(24);
        text("Two Tone Chawan", 80, 325);
        fill("#134611");
        textAlign(LEFT, TOP);
        textSize(24);
        text("Bubble Chawan", 330, 325);
        text("Flower Chawan", 550, 325);
    } else if (bowlChoice === 2) {
        text("You have chosen the Bubble Chawan!", 400, 50);
        stroke("#355834");
        strokeWeight(2);
        fill("#DEE9D8");
        rect(320, 315, 160, 40);
        strokeWeight(0);
        fill("#134611");
        textAlign(LEFT, TOP);
        textSize(24);
        text("Bubble Chawan", 330, 325);
        fill("#134611");
        textAlign(LEFT, TOP);
        textSize(24);
        text("Two Tone Chawan", 80, 325);
        text("Flower Chawan", 550, 325);
    } else if (bowlChoice === 3) {
        text("You have chosen the Flower Chawan!", 400, 50);
        stroke("#355834");
        strokeWeight(2);
        fill("#DEE9D8");
        rect(535, 315, 175, 40);
        strokeWeight(0);
        fill("#134611");
        textAlign(LEFT, TOP);
        textSize(24);
        text("Flower Chawan", 550, 325);
        fill("#134611");
        textAlign(LEFT, TOP);
        textSize(24);
        text("Two Tone Chawan", 80, 325);
        text("Bubble Chawan", 330, 325);
    }
    image(bowlImg1, 65, 125, 190, 190);
    image(bowlImg2, 300, 125, 190, 190);
    image(bowlImg3, 550, 125, 190, 190);
    strokeWeight(0);
    fill("#134611");
    rect(400, 400, 355, 40);
    fill("#DEE9D8");
    textSize(24);
    text("Click to start second homework task", 410, 410);
    fill("#134611");
    text(">", 380, 410);
    text("<", 765, 410);

    if (mouseClickedThisFrame && mouseOverRect(400, 400, 355, 40)) {
        stage = 7;
        stageStartTime = millis();
    }
}

function taskTwoPage() {
    let timeElapsed = Math.floor((millis() - stageStartTime) / 1000);
    let minutes = Math.floor(timeElapsed / 60);
    let seconds = timeElapsed % 60;
    let timeElapsedFormatted = nf(minutes, 2) + ":" + nf(seconds, 2);
    totalTime = timeElapsedFormatted;

    background("#DEE9D8");
    fill("#134611");
    textAlign(LEFT);
    textFont(jersey25);
    textSize(24);
    text("Time Elapsed: " + timeElapsedFormatted, 25, 470);
    fill("#BACDB0");
    rect(620, 130, 125, 170);
    fill("#134611");
    textSize(18);
    text("While the whisk is soaking and the matcha powder is sifting, work on your second homework task.", 625, 135, 115);
    strokeWeight(0);
    fill("#134611");
    rect(600, 450, 150, 40);
    textSize(24);
    fill("#DEE9D8");
    text("I've Finished!", 610, 460);
    fill("#134611");
    text(">", 575, 460);
    text("<", 760, 460);

    if (bowlChoice === 1) {
        image(bowlImg1, 230, 130, 380, 380);
        image(sift, 230, 30, 350, 350);
    } else if (bowlChoice === 2) {
        image(bowlImg2, 230, 130, 380, 380);
        image(sift, 230, 40, 350, 350);
    } else if (bowlChoice === 3) {
        image(bowlImg3, 230, 120, 380, 380);
        image(sift, 230, 40, 350, 350);
    }
    image(soakWhisk, 10, 125, 250, 250);

    if (mouseClickedThisFrame && mouseOverRect(600, 450, 150, 40)) {
        totalHomeworkTime += Math.floor((millis() - stageStartTime) / 1000);
        stage = 8;
    }
}

function finishTaskTwo() {
    background("#DEE9D8");
    fill(0, 0, 0, 80);
    rect(0, 0, width, height);
    fill("#BACDB0");
    stroke("#134611");
    strokeWeight(1);
    rect(200, 130, 400, 180);
    strokeWeight(0);
    fill("#134611");
    textFont(jersey25);
    textAlign(LEFT);
    textSize(20);
    text("Great job finishing a second task! You finished your second task in " + totalTime + ".", 210, 170, 390);
    text("Now you're ready to add the hot water to the matcha powder and start whisking.", 210, 230, 400);
    text("Get ready to complete your third homework task!", 210, 280, 400);
    fill("#134611");
    rect(250, 390, 330, 40);
    textSize(24);
    fill("#DEE9D8");
    textAlign(CENTER, CENTER);
    textFont(jersey25);
    text("Click to start third homework task", 415, 408);
    fill("#134611");
    text(">", 235, 410);
    text("<", 600, 410);

    if (mouseClickedThisFrame && mouseOverRect(250, 390, 330, 40)) {
        stage = 9;
        stageStartTime = millis();
    }
}

function taskThreePage() {
    let timeElapsed = Math.floor((millis() - stageStartTime) / 1000);
    let minutes = Math.floor(timeElapsed / 60);
    let seconds = timeElapsed % 60;
    let timeElapsedFormatted = nf(minutes, 2) + ":" + nf(seconds, 2);
    totalTime = timeElapsedFormatted;

    background("#DEE9D8");
    fill("#134611");
    textAlign(LEFT);
    textFont(jersey25);
    textSize(24);
    text("Time Elapsed: " + timeElapsedFormatted, 25, 470);
    fill("#BACDB0");
    rect(290, 10, 350, 60);
    fill("#134611");
    textSize(18);
    text("While the matcha is whisking, complete your next homework task.", 300, 40, 340);
    strokeWeight(0);
    fill("#134611");
    rect(600, 450, 150, 40);
    textSize(24);
    fill("#DEE9D8");
    text("I've Finished!", 610, 470);
    fill("#134611");
    text(">", 575, 470);
    text("<", 760, 470);

    if (bowlChoice === 1) {
        image(bowlImg1, 310, 130, 380, 380);
        image(whisk, 330, 70, 270, 270);
    } else if (bowlChoice === 2) {
        image(bowlImg2, 250, 130, 370, 370);
        image(whisk, 290, 70, 270, 270);
    } else if (bowlChoice === 3) {
        image(bowlImg3, 270, 130, 380, 380);
        image(whisk, 290, 70, 270, 270);
    }
    image(water, 10, 100, 250, 250);

    if (mouseClickedThisFrame && mouseOverRect(600, 450, 150, 40)) {
        totalHomeworkTime += Math.floor((millis() - stageStartTime) / 1000);
        stage = 9.5;
    }
}

function chooseCupPage() {
    background("#DEE9D8");
    fill("#134611");
    textAlign(CENTER);
    textFont(jersey25);
    textSize(40);
    text("Pick a cup to drink your matcha in!", 400, 50);
    rect(65, 315, 190, 40);
    rect(320, 315, 160, 40);
    rect(555, 315, 175, 40);
    fill("#DEE9D8");
    textAlign(LEFT, TOP);
    textSize(24);
    text("Glass with Ice", 90, 325);
    text("Hot Mug", 365, 325);
    text("Jar with Ice", 580, 325);
    image(cupImg1, 65, 125, 190, 190);
    image(cupImg2, 310, 125, 210, 210);
    image(cupImg3, 540, 125, 180, 180);

    fill("#134611");
    if (currentHighlighted === 1) {
        text(">", 45, 325);
        text("<", 265, 325);
    } else if (currentHighlighted === 2) {
        text(">", 300, 325);
        text("<", 485, 325);
    } else if (currentHighlighted === 3) {
        text(">", 530, 325);
        text("<", 740, 325);
    }

    if (mouseClickedThisFrame) {
        if (mouseOverRect(65, 125, 190, 230)) {
            cupChoice = 1;
            currentHighlighted = 1;
            stage = 11;
        } else if (mouseOverRect(310, 125, 210, 230)) {
            cupChoice = 2;
            currentHighlighted = 2;
            stage = 11;
        } else if (mouseOverRect(540, 125, 180, 230)) {
            cupChoice = 3;
            currentHighlighted = 3;
            stage = 11;
        }
    }
}

function cupChosen() {
    background("#DEE9D8");
    fill("#134611");
    textAlign(CENTER);
    textFont(jersey25);
    textSize(40);
    if (cupChoice === 1) {
        text("You have chosen the Glass with Ice!", 400, 50);
        stroke("#355834");
        strokeWeight(2);
        fill("#DEE9D8");
        rect(65, 315, 190, 40);
        strokeWeight(0);
        fill("#134611");
        textAlign(LEFT, TOP);
        textSize(24);
        text("Glass with Ice", 90, 325);
        fill("#134611");
        textAlign(LEFT, TOP);
        textSize(24);
        text("Hot Mug", 365, 325);
        text("Jar with Ice", 580, 325);
    } else if (cupChoice === 2) {
        text("You have chosen the Hot Mug!", 400, 50);
        stroke("#355834");
        strokeWeight(2);
        fill("#DEE9D8");
        rect(320, 315, 160, 40);
        strokeWeight(0);
        fill("#134611");
        textAlign(LEFT, TOP);
        textSize(24);
        text("Hot Mug", 365, 325);
        fill("#134611");
        textAlign(LEFT, TOP);
        textSize(24);
        text("Glass with Ice", 90, 325);
        text("Jar with Ice", 580, 325);
    } else if (cupChoice === 3) {
        text("You have chosen the Jar with Ice!", 400, 50);
        stroke("#355834");
        strokeWeight(2);
        fill("#DEE9D8");
        rect(555, 315, 175, 40);
        strokeWeight(0);
        fill("#134611");
        textAlign(LEFT, TOP);
        textSize(24);
        text("Jar with Ice", 580, 325);
        fill("#134611");
        textAlign(LEFT, TOP);
        textSize(24);
        text("Glass with Ice", 90, 325);
        text("Hot Mug", 365, 325);
    }
    image(cupImg1, 65, 125, 190, 190);
    image(cupImg2, 310, 125, 210, 210);
    image(cupImg3, 540, 125, 180, 180);
    strokeWeight(0);
    fill("#134611");
    rect(450, 400, 240, 40);
    fill("#DEE9D8");
    textSize(24);
    text("Click to start last task!", 465, 410);
    fill("#134611");
    text(">", 430, 410);
    text("<", 705, 410);

    if (mouseClickedThisFrame && mouseOverRect(450, 400, 240, 40)) {
        stage = 12;
        stageStartTime = millis();
    }
}

function taskFourPage() {
    let timeElapsed = Math.floor((millis() - stageStartTime) / 1000);
    let minutes = Math.floor(timeElapsed / 60);
    let seconds = timeElapsed % 60;
    let timeElapsedFormatted = nf(minutes, 2) + ":" + nf(seconds, 2);
    totalTime = timeElapsedFormatted;

    background("#DEE9D8");
    fill("#134611");
    textAlign(LEFT);
    textFont(jersey25);
    textSize(24);
    text("Time Elapsed: " + timeElapsedFormatted, 25, 470);
    fill("#BACDB0");
    rect(20, 300, 200, 100);
    fill("#134611");
    textSize(18);
    text("While the milk is being poured into the glass with sweetener, complete your last homework task", 30, 310, 200);
    strokeWeight(0);
    fill("#134611");
    rect(600, 450, 150, 40);
    textSize(24);
    fill("#DEE9D8");
    text("I've Finished!", 610, 460);
    fill("#134611");
    text(">", 575, 460);
    text("<", 760, 460);

    if (cupChoice === 1) {
        image(cupImg1, 250, 150, 330, 330);
        image(milk, 210, -15, 240, 240);
        image(spoon, 400, 20, 240, 240);
    } else if (cupChoice === 2) {
        image(cupImg2, 230, 150, 370, 370);
        image(milk, 120, 5, 300, 300);
        image(spoon, 360, 40, 240, 240);
    } else if (cupChoice === 3) {
        image(cupImg3, 230, 150, 310, 310);
        image(milk, 180, 0, 240, 240);
        image(spoon, 390, 40, 240, 240);
    }

    if (mouseClickedThisFrame && mouseOverRect(600, 450, 150, 40)) {
        totalHomeworkTime += Math.floor((millis() - stageStartTime) / 1000);
        stage = 13;
    }
}

function endPage() {
    background("#DEE9D8");

    if (!confettiInitialized) {
        initConfetti();
        confettiInitialized = true;
    }
    drawConfetti();

    fill("#BACDB0");
    rect(25, 100, 220, 260);
    fill("#134611");
    textFont(jersey25);
    textAlign(LEFT, TOP);
    textSize(20);
    text("Great job on your homework! You finished your fourth task in " + totalTime + ".", 35, 110, 220);
    text("Pour the matcha on top of the milk and we're done!", 35, 200, 230);
    textSize(26);
    text("Session Stats", 35, 270);
    textSize(20);
    text("Tasks Competed: 4", 35, 305);
    let totalMins = Math.floor(totalHomeworkTime / 60);
    let totalSecs = totalHomeworkTime % 60;
    text("Total Time: " + nf(totalMins, 2) + ":" + nf(totalSecs, 2), 35, 330);
    fill("#134611");

    if (cupChoice === 1) {
        image(cupFinal, 290, 80, 270, 270);
    } else if (cupChoice === 2) {
        image(mugFinal, 290, 100, 250, 250);
    } else if (cupChoice === 3) {
        image(jarFinal, 290, 100, 250, 250);
    }

    if (kettleChoice === 1) {
        image(kettle1Img, 590, 80, 130, 130);
    } else if (kettleChoice === 2) {
        image(kettle2Img, 590, 80, 130, 130);
    } else if (kettleChoice === 3) {
        image(kettle3Img, 590, 80, 130, 130);
    }

    if (bowlChoice === 1) {
        image(bowlImg1, 590, 230, 130, 130);
    } else if (bowlChoice === 2) {
        image(bowlImg2, 590, 230, 130, 130);
    } else if (bowlChoice === 3) {
        image(bowlImg3, 590, 230, 130, 130);
    }

    fill("#134611");
    textSize(14);
    textAlign(CENTER);
    text("Your Kettle", 655, 215);
    text("Your Bowl", 655, 365);

    strokeWeight(0);
    rect(325, 420, 150, 40);
    textSize(24);
    fill("#DEE9D8");
    textAlign(CENTER, CENTER);
    textFont(jersey25);
    text("Start over", 400, 438);
    fill("#134611");
    text(">", 305, 438);
    text("<", 495, 438);

    if (mouseClickedThisFrame && mouseOverRect(325, 420, 150, 40)) {
        stage = 0;
        kettleChoice = 2;
        currentHighlighted = 2;
        stageStartTime = 0;
        bowlChoice = 2;
        totalTime = 0;
        cupChoice = 2;
        totalHomeworkTime = 0;
        confettiInitialized = false;
        confettiParticles = [];
    }
}

function initConfetti() {
    confettiParticles = [];
    let colors = ["#134611", "#BACDB0", "#DEE9D8", "#355834", "#7DAF7A", "#F0E68C", "#FFD700"];
    for (let i = 0; i < 120; i++) {
        confettiParticles.push({
            x: random(width),
            y: random(-200, 0),
            size: random(6, 14),
            color: random(colors),
            speedY: random(2, 5),
            speedX: random(-1.5, 1.5),
            rotation: random(TWO_PI),
            rotationSpeed: random(-0.1, 0.1),
            shape: random(["rect"])
        });
    }
}

function drawConfetti() {
    for (let p of confettiParticles) {
        push();
        translate(p.x, p.y);
        rotate(p.rotation);
        fill(p.color);
        noStroke();
        if (p.shape === "rect") {
            rect(0, 0, p.size, p.size * 0.5);
        } else {
            ellipse(0, 0, p.size, p.size);
        }
        pop();
        p.y += p.speedY;
        p.x += p.speedX;
        p.rotation += p.rotationSpeed;
        if (p.y > height) {
            p.y = random(-100, 0);
            p.x = random(width);
        }
    }
}

// ------------------ CANVAS FUNCTIONS ------------------

function centerCanvas() {
    let x = (windowWidth - width) / 2;
    let y = (windowHeight - height) / 2;
    canvas.position(x, y);
}

function windowResized() {
    centerCanvas();
}