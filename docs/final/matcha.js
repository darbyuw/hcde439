const BAUD_RATE = 9600; // This should match the baud rate in your Arduino sketch

let port, connectBtn; // Declare global variables
let bgImg, startScreen, logoImg;
let stage = 0; // This variable will keep track of which page we are on in the game
let kettleChoice = 2; // This variable will keep track of the user's choice of kettle
// make variable for which kettle is currently highlighted:
let currentHighlighted = 2; // default to center kettle option being highlighted
// store the start time when counting time elapsed:
let stageStartTime = 0;
// keep track of the user's bowl:
let bowlChoice = 2;
// keep track of time elapsed during tasks:
let totalTime = 0;
// keep track of cup choice
let cupChoice = 2;
// store font
var jersey25;
// store whether a new joystick move can register
let joystickReady = true; 
// store accumulated homework time in seconds:
let totalHomeworkTime = 0;
// initialize confetti variables
let confettiParticles = [];
let confettiInitialized = false;

function preload() {
    logoImg = loadImage("./assets/logo.png");
    jersey25 = loadFont("Jersey25-Regular.ttf");
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
}

function setup() {
  setupSerial(); // Run our serial setup function (below)
  canvas = createCanvas(800, 500);
  centerCanvas();
}

function draw() {
    const portIsOpen = checkPort(); // Check whether the port is open (see checkPort function below)
    if (!portIsOpen) return; // If the port is not open, exit the draw loop

    // Depending on the stage of the game, we will call different functions to draw different pages.
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
}

// ------------------ PAGE FUNCTIONS ------------------

function startPage() {
    let str = port.readUntil("\n"); // Read from the port until the newline
    if (str.length == 0) return; // If we didn't read anything, return.

    // grab all values and put them in an array of variables
    let [buttonState, xVal, yVal] = str.trim().split(",");
    
    // If the button is not pressed, stay on the start page
    if (Number(buttonState) === 0) {
        background("#BACDB0");
        image(logoImg, 100, 100, 634, 199.84); // draw logo at top of the page
        // create a button:
        fill("#134611");
        rect(325, 300, 150, 40); // draw button
        textSize(24);
        fill("#DEE9D8");
        textAlign(CENTER, CENTER);
        textFont(jersey25); // change font to jersey25 font
        text("Start Game", 400, 319);
        fill("#134611");
        text(">", 305, 319); // draw ">" to indicate the button can be pressed
        text("<", 495, 319);
    } else if (Number(buttonState) === 1) {
        // If the button is pressed
        stage = 1; // if so, move to next stage
    }
}

function instructionsPage() {
    let str = port.readUntil("\n"); // Read from the port until the newline
    if (str.length == 0) return; // If we didn't read anything, return.

    // grab all values and put them in an array of variables
    let [buttonState, xVal, yVal] = str.trim().split(",");
    
    // If the button is not pressed, stay on the start page
    if (Number(buttonState) === 0) {
        background("#BACDB0");
        fill("#DEE9D8");
        rect(50, 50, 700, 400); // draw box for instructions
        fill("#134611");
        textFont(jersey25); // change font to jersey25 font
        textSize(28);
        textAlign(LEFT);
        text("Instructions", 75, 100);
        textSize(20);
        text("Before starting, remove any distractions, and put away your phone.", 75, 145);
        text("Break up your homework into four tasks. This could be one assignment split into smaller parts, or four separate assignments.", 75, 187, 650);
        text("Each task will be paired with a step while making a matcha latte. You will move onto the next step in the game when you finish your homework task!", 75, 244, 650);
        text("You will get to customize your matcha as you go, at the end you will have a customized matcha latte!", 75, 305, 650);
        text("Grab a study drink and lets get started by choosing our first item!", 75, 352);
        fill("#134611");
        // draw start button:
        rect(350, 390, 150, 40); 
        textSize(24);
        fill("#DEE9D8");
        textAlign(CENTER, CENTER);
        textFont(jersey25); // change font to jersey25 font
        text("Start", 425, 408);
        fill("#134611");
        text(">", 335, 410); // draw ">" to indicate the button can be pressed
        text("<", 515, 410);
    } else if (Number(buttonState) === 1) {
        // If the button is pressed
        stage = 2; // if so, move to next stage
    }
}

function chooseKettlePage() {
    let str = port.readUntil("\n"); // Read from the port until the newline
    if (str.length == 0) return; // If we didn't read anything, return.

    // grab all values and put them in an array of variables
    let [buttonState, xVal, yVal] = str.trim().split(",");

    // display kettles weather or not the button is pressed:
    background("#DEE9D8");
    fill("#134611");
    textAlign(CENTER);
    textFont(jersey25); // change font to jersey25 font
    textSize(40);
    text("Pick a kettle to boil your water in!", 400, 50);
    // draw three rectangles for the buttons of the three kettles:
    rect(65, 315, 170, 40); // left kettle option
    rect(320, 315, 150, 40); // center kettle option
    rect(535, 315, 210, 40); // right kettle option
    fill("#DEE9D8");
    textAlign(LEFT, TOP);
    textSize(24);
    // Label the buttons: 
    text("Classic Electric", 80, 325);
    text("Green Electric", 330, 325);
    text("Graves Stove Kettle", 550, 325);
    // Put Kettle images above each button:
    image(kettle1Img, 65, 125, 190, 190);
    image(kettle2Img, 300, 125, 210, 210);
    image(kettle3Img, 550, 125, 190, 190);

    // if button not pressed, allow user to switch between highlighted kettle options
    if (Number(buttonState) === 0) {
        let xNum = Number(xVal);

        if (xNum >= 500 && xNum <= 525) {
            joystickReady = true; // joystick is back at center, ready for next input
        }

        if (joystickReady) {
            // if highlighted kettle is 2 (default), highlight the center kettle option (using > < symbols on either side of the option)
            if (currentHighlighted === 2) {
                fill("#134611");
                text(">", 300, 325);
                text("<", 475, 325);
                // if joystick left, goto left kettle, change highlighted kettle variable to 1
                if (xNum < 500) {
                    currentHighlighted = 1;
                    joystickReady = false;
                } else if (xNum > 525) {
                    currentHighlighted = 3;
                    joystickReady = false;
                }
            } else if (currentHighlighted === 1) { // if highlighted kettle is 1, highlight the left kettle option
                fill("#134611");
                text(">", 45, 325);
                text("<", 245, 325);
                // if joystick right, goto center kettle, change highlighted kettle variable to 2
                if (xNum > 525) {
                    currentHighlighted = 2;
                    joystickReady = false;
                }
            } else if (currentHighlighted === 3) { // if highlighted kettle is 3, highlight the right kettle option
                fill("#134611");
                text(">", 515, 325);
                text("<", 755, 325);
                // if joystick left, goto center kettle, change highlighted kettle variable to 2
                if (xNum < 500) {
                    currentHighlighted = 2;
                    joystickReady = false;
                }
            } 
        }
    } else if (Number(buttonState) === 1) {
        // if highlighted kettle is 1, set the kettle choice variable to 1, move to next stage
        if (currentHighlighted === 1) {
            kettleChoice = 1; // This will be used in stage 4
            stage = 3; // move to next stage
        } else if (currentHighlighted === 2) { // if highlighted kettle is 2, set the kettle choice variable to 2, move to next stage
            kettleChoice = 2;
            stage = 3; // move to next stage
        } else if (currentHighlighted === 3) { // if highlighted kettle is 3, set the kettle choice variable to 3, move to next stage
            kettleChoice = 3;
            stage = 3; // move to next stage
        }
    }
}  

function kettleChosen() {
    let str = port.readUntil("\n"); // Read from the port until the newline
    if (str.length == 0) return; // If we didn't read anything, return.

    // grab all values and put them in an array of variables
    let [buttonState, xVal, yVal] = str.trim().split(",");

    // reset joystick ready
    joystickReady = true;

    // display the selected kettle and other options from stage 2:
    background("#DEE9D8");
    fill("#134611");
    textAlign(CENTER);
    textFont(jersey25); // change font to jersey25 font
    textSize(40);
    if (kettleChoice === 1) {
        text("You have chosen the Classic Electric kettle!", 400, 50);
        // draw the button with opposite colors to make it look selected
        stroke("#355834");
        strokeWeight(2);
        fill("#DEE9D8");
        rect(65, 315, 170, 40);
        strokeWeight(0);
        fill("#134611");
        textAlign(LEFT, TOP);
        textSize(24);
        text("Classic Electric", 80, 325);
        // Label the buttons:   
        fill("#134611");
        textAlign(LEFT, TOP);
        textSize(24);
        text("Green Electric", 330, 325);
        text("Graves Stove Kettle", 550, 325);
    } else if (kettleChoice === 2) {
        text("You have chosen the Green Electric kettle!", 400, 50);
        // draw the button with opposite colors to make it look selected
        stroke("#355834");
        strokeWeight(2);
        fill("#DEE9D8");
        rect(320, 315, 150, 40);
        strokeWeight(0);
        fill("#134611");
        textAlign(LEFT, TOP);
        textSize(24);
        text("Green Electric", 330, 325);
        // Label the buttons:   
        fill("#134611");
        textAlign(LEFT, TOP);
        textSize(24);
        text("Classic Electric", 80, 325);
        text("Graves Stove Kettle", 550, 325);
    } else if (kettleChoice === 3) {
        text("You have chosen the Graves Stove Kettle!", 400, 50);
        // draw the button with opposite colors to make it look selected
        stroke("#355834");
        strokeWeight(2);
        fill("#DEE9D8");
        rect(535, 315, 210, 40); // right kettle option
        strokeWeight(0);
        fill("#134611");
        textAlign(LEFT, TOP);
        textSize(24);
        text("Graves Stove Kettle", 550, 325);
        // Label the buttons:   
        fill("#134611");
        textAlign(LEFT, TOP);
        textSize(24);
        text("Classic Electric", 80, 325);
        text("Green Electric", 330, 325);
    }
    // Put Kettle images above each button:
    image(kettle1Img, 65, 125, 190, 190);
    image(kettle2Img, 300, 125, 210, 210);
    image(kettle3Img, 550, 125, 190, 190);
    // make start task button at the bottom of the page:
    strokeWeight(0);
    fill("#134611");
    rect(420, 400, 330, 40); 
    fill("#DEE9D8");
    textSize(24);
    text("Click to start first homework task", 430, 410);
    // highlight the start ask button so user knows to move onto the next task: 
    fill("#134611");
    text(">", 400, 410);
    text("<", 760, 410);

    if (Number(buttonState) === 1) {
        stage = 4; // move to next stage
        stageStartTime = millis(); // store the time when moving to stage 4 for the first time
    }
}

function taskOnePage() {
    let str = port.readUntil("\n"); // Read from the port until the newline
    if (str.length == 0) return; // If we didn't read anything, return.

    // grab all values and put them in an array of variables
    let [buttonState, xVal, yVal] = str.trim().split(",");

    // count the time elapsed since displaying this page:
    let timeElapsed = Math.floor((millis() - stageStartTime) / 1000); // seconds since stage started
    // convert the time elasped into a clock format (mm:ss):
    let minutes = Math.floor(timeElapsed / 60);
    let seconds = timeElapsed % 60;

    let timeElapsedFormatted = nf(minutes, 2) + ":" + nf(seconds, 2);    
    totalTime = timeElapsedFormatted;

    // if button not pressed, display the chosen kettle
    if (Number(buttonState) === 0) {
        background("#DEE9D8");
        fill("#134611");
        // position text based on the center of the text box:
        textAlign(LEFT);
        textFont(jersey25);
        textSize(24);
        // display the amount of time that has elapsed since displaying this page:
        text("Time Elapsed: " + timeElapsedFormatted, 25, 470);
        // make first text box:
        fill("#BACDB0");
        rect(25, 25, 235, 100);
        fill("#134611");
        text("Complete your first homework task while the water boils!", 35, 35, 225);
        // make second text box:
        fill("#BACDB0");
        rect(520, 370, 240, 65);
        fill("#134611");
        textSize(18);
        text("Press the button to continue making your latte", 530, 380, 250);
        // make Ive finished button at the bottom of the page:
        strokeWeight(0);
        fill("#134611");
        rect(600, 450, 150, 40); 
        textSize(24);
        fill("#DEE9D8");
        text("I've Finished!", 610, 460);
        // highlight the button so user knows to move onto the next task: 
        fill("#134611");
        text(">", 580, 460);
        text("<", 760, 460);
        // Display the chosen kettle: 
        if (kettleChoice === 1) {
            image(kettle1Img, 250, 125, 300, 300);
        } else if (kettleChoice === 2) {
            image(kettle2Img, 250, 125, 300, 300);
        } else if (kettleChoice === 3) {
            image(kettle3Img, 230, 125, 300, 300);
        }
    } else if (Number(buttonState) === 1) {
        // store total homework time to use referenced on the end page
        totalHomeworkTime += Math.floor((millis() - stageStartTime) / 1000);
        stage = 4.5; // move to next stage
    }
}

// diaplsy celebration modal when a user has finished a homework task
function celebrationModal(message, nextStage) {
    let str = port.readUntil("\n");
    if (str.length == 0) return;
    let [buttonState, xVal, yVal] = str.trim().split(",");

    background("#DEE9D8");

    // Dimmed overlay
    fill(0, 0, 0, 80);
    rect(0, 0, width, height);

    // Modal box
    fill("#BACDB0");
    stroke("#134611");
    strokeWeight(1);
    rect(175, 150, 450, 200);

    // Modal text
    strokeWeight(0);
    fill("#134611");
    textFont(jersey25);
    textSize(22);
    textAlign(CENTER, CENTER);
    text(message, 210, 225, 390);

    // Continue button
    fill("#134611");
    rect(300, 295, 200, 40);
    fill("#DEE9D8");
    textSize(24);
    text("Continue", 400, 314);
    fill("#134611");
    text(">", 278, 314);
    text("<", 522, 314);

    if (Number(buttonState) === 1) {
        stage = nextStage;
        currentHighlighted = 2; // reset joystick highlight for next selection page
    }
}

function chooseBowlPage() {
    let str = port.readUntil("\n"); // Read from the port until the newline
    if (str.length == 0) return; // If we didn't read anything, return.

    // grab all values and put them in an array of variables
    let [buttonState, xVal, yVal] = str.trim().split(",");
    
    // display bowls weather or not the button is pressed:
    background("#DEE9D8");
    // Make title
    fill("#134611");
    textAlign(CENTER);
    textFont(jersey25); 
    textSize(40);
    text("Pick a bowl to sift your matcha into!", 400, 50);
    // draw three rectangles for the buttons of the three kettles:
    rect(65, 315, 190, 40); // left option
    rect(320, 315, 160, 40); // center option
    rect(535, 315, 175, 40); // right option
    fill("#DEE9D8");
    textAlign(LEFT, TOP);
    textSize(24);
    // Label the buttons: 
    text("Two Tone Chawan", 80, 325);
    text("Bubble Chawan", 330, 325);
    text("Flower Chawan", 550, 325);
    // Put bowl images above each button:
    image(bowlImg1, 65, 125, 190, 190);
    image(bowlImg2, 300, 125, 190, 190);
    image(bowlImg3, 550, 125, 190, 190);

    // if button not pressed, allow user to switch between highlighted options
    if (Number(buttonState) === 0) {
        let xNum = Number(xVal);

        if (xNum >= 500 && xNum <= 525) {
            joystickReady = true; // joystick is back at center, ready for next input
        }

        if (joystickReady) {
            // if highlighted kettle is 2 (default), highlight the center kettle option (using > < symbols on either side of the option)
            if (currentHighlighted === 2) {
                fill("#134611");
                text(">", 300, 325);
                text("<", 485, 325);
                // if joystick left, goto left kettle, change highlighted kettle variable to 1
                if (xNum < 500) {
                    currentHighlighted = 1;
                    joystickReady = false;
                } else if (xNum > 525) {
                    currentHighlighted = 3;
                    joystickReady = false;
                }
            } else if (currentHighlighted === 1) { // if highlighted kettle is 1, highlight the left kettle option
                fill("#134611");
                text(">", 45, 325);
                text("<", 265, 325);
                // if joystick right, goto center kettle, change highlighted kettle variable to 2
                if (xNum > 525) {
                    currentHighlighted = 2;
                    joystickReady = false;
                }
            } else if (currentHighlighted === 3) { // if highlighted kettle is 3, highlight the right kettle option
                fill("#134611");
                text(">", 515, 325);
                text("<", 725, 325);
                // if joystick left, goto center kettle, change highlighted kettle variable to 2
                if (xNum < 500) {
                    currentHighlighted = 2;
                    joystickReady = false;
                }
            } 
        }
    } else if (Number(buttonState) === 1) {
        // if highlighted is 1, set the choice variable to 1, move to next stage
        if (currentHighlighted === 1) {
            bowlChoice = 1; // This will be used in stage 6
            stage = 6; // move to next stage
        } else if (currentHighlighted === 2) { // if highlighted is 2, set the choice variable to 2, move to next stage
            bowlChoice = 2;
            stage = 6; // move to next stage
        } else if (currentHighlighted === 3) { // if highlighted is 3, set the choice variable to 3, move to next stage
            bowlChoice = 3;
            stage = 6; // move to next stage
        }
    }
}

// Display user's bowl choice and allow them to click the start second task button. 
function bowlChosen() {
    let str = port.readUntil("\n"); // Read from the port until the newline
    if (str.length == 0) return; // If we didn't read anything, return.

    // grab all values and put them in an array of variables
    let [buttonState, xVal, yVal] = str.trim().split(",");
    // reset joystick ready
    joystickReady = true;

    // Note: the following text is not put into a funciton be be reused for each stage because 
    // the images are each slightly different dimentions and the text are slightly different lengths 
    // and I dont want to make the rectangle wrap around the text length

    // Display the selected bowl and other options:
    background("#DEE9D8");
    fill("#134611");
    textAlign(CENTER);
    textFont(jersey25);
    textSize(40);
    if (bowlChoice === 1) {
        text("You have chosen the Two Tone Chawan!", 400, 50);
        // draw the button with opposite colors to make it look selected
        stroke("#355834");
        strokeWeight(2);
        fill("#DEE9D8");
        rect(65, 315, 190, 40); // left option
        strokeWeight(0);
        fill("#134611");
        textAlign(LEFT, TOP);
        textSize(24);
        text("Two Tone Chawan", 80, 325);
        // Label the buttons:   
        fill("#134611");
        textAlign(LEFT, TOP);
        textSize(24);
        text("Bubble Chawan", 330, 325);
        text("Flower Chawan", 550, 325);
    } else if (bowlChoice === 2) {
        text("You have chosen the Bubble Chawan!", 400, 50);
        // draw the button with opposite colors to make it look selected
        stroke("#355834");
        strokeWeight(2);
        fill("#DEE9D8");
        rect(320, 315, 160, 40); // center option
        strokeWeight(0);
        fill("#134611");
        textAlign(LEFT, TOP);
        textSize(24);
        text("Bubble Chawan", 330, 325);
        // Label the buttons:   
        fill("#134611");
        textAlign(LEFT, TOP);
        textSize(24);
        text("Two Tone Chawan", 80, 325);
        text("Flower Chawan", 550, 325);
    } else if (bowlChoice === 3) {
        text("You have chosen the Flower Chawan!", 400, 50);
        // draw the button with opposite colors to make it look selected
        stroke("#355834");
        strokeWeight(2);
        fill("#DEE9D8");
        rect(535, 315, 175, 40); // right option
        strokeWeight(0);
        fill("#134611");
        textAlign(LEFT, TOP);
        textSize(24);
        text("Flower Chawan", 550, 325);
        // Label the buttons:   
        fill("#134611");
        textAlign(LEFT, TOP);
        textSize(24);
        text("Two Tone Chawan", 80, 325);
        text("Bubble Chawan", 330, 325);
    }
    // Put bowl images above each button:
    image(bowlImg1, 65, 125, 190, 190);
    image(bowlImg2, 300, 125, 190, 190);
    image(bowlImg3, 550, 125, 190, 190);
    // make start task button at the bottom of the page:
    strokeWeight(0);
    fill("#134611");
    rect(400, 400, 355, 40); 
    fill("#DEE9D8");
    textSize(24);
    text("Click to start second homework task", 410, 410);
    // highlight the start ask button so user knows to move onto the next task: 
    fill("#134611");
    text(">", 380, 410);
    text("<", 765, 410);

    if (Number(buttonState) === 1) {
        stage = 7; // move to next stage
        stageStartTime = millis(); // store the time when moving to stage 7 
    }
}

function taskTwoPage() {
    let str = port.readUntil("\n"); // Read from the port until the newline
    if (str.length == 0) return; // If we didn't read anything, return.

    // grab all values and put them in an array of variables
    let [buttonState, xVal, yVal] = str.trim().split(",");

    // count the time elapsed since displaying this page:
    let timeElapsed = Math.floor((millis() - stageStartTime) / 1000); // seconds since stage started
    // convert the time elasped into a clock format (mm:ss):
    let minutes = Math.floor(timeElapsed / 60);
    let seconds = timeElapsed % 60;

    let timeElapsedFormatted = nf(minutes, 2) + ":" + nf(seconds, 2);    
    totalTime = timeElapsedFormatted;

    // if button not pressed, display the chosen bowl
    if (Number(buttonState) === 0) {
        background("#DEE9D8");
        fill("#134611");
        // position text based on the left of the text box:
        textAlign(LEFT);
        textFont(jersey25);
        textSize(24);
        // display the amount of time that has elapsed since displaying this page:
        text("Time Elapsed: " + timeElapsedFormatted, 25, 470);
        // make second text box:
        fill("#BACDB0");
        rect(620, 130, 125, 170);
        fill("#134611");
        textSize(18);
        text("While the whisk is soaking and the matcha powder is sifting, work on your second homework task.", 625, 135, 115);
        // make Ive finished button at the bottom of the page:
        strokeWeight(0);
        fill("#134611");
        rect(600, 450, 150, 40); 
        textSize(24);
        fill("#DEE9D8");
        text("I've Finished!", 610, 460);
        // highlight the button so user knows to move onto the next task: 
        fill("#134611");
        text(">", 575, 460);
        text("<", 760, 460);
        // Display the chosen bowl: 
        if (bowlChoice === 1) {
            image(bowlImg1, 230, 130, 380, 380);
            // insert sift above bowl
            image(sift, 230, 30, 350, 350);
        } else if (bowlChoice === 2) {
            image(bowlImg2, 230, 130, 380, 380);
            // insert sift above bowl
            image(sift, 230, 40, 350, 350);
        } else if (bowlChoice === 3) {
            image(bowlImg3, 230, 120, 380, 380);
            // insert sift above bowl
            image(sift, 230, 40, 350, 350);
        }
        
        // insert soaking whisk image to the left
        image(soakWhisk, 10, 125, 250, 250);
    } else if (Number(buttonState) === 1) {
        totalHomeworkTime += Math.floor((millis() - stageStartTime) / 1000);
        stage = 8; // move to next stage
    }
} 

function finishTaskTwo() {
    let str = port.readUntil("\n"); // Read from the port until the newline
    if (str.length == 0) return; // If we didn't read anything, return.

    // grab all values and put them in an array of variables
    let [buttonState, xVal, yVal] = str.trim().split(",");
    
    // If the button is not pressed, display intructions
    if (Number(buttonState) === 0) {
        background("#DEE9D8");
        // fill("#BACDB0");
        // rect(200, 130, 400, 180); // draw box for instructions

        // Dimmed overlay
        fill(0, 0, 0, 80);
        rect(0, 0, width, height);

        // Modal box
        fill("#BACDB0");
        stroke("#134611");
        strokeWeight(1);
        rect(200, 130, 400, 180);
        // text
        strokeWeight(0);
        fill("#134611");
        textFont(jersey25); 
        textAlign(LEFT);
        textSize(20);
        text("Great job finishing a second task! You finished your second task in " + totalTime + ".", 210, 170, 390);
        text("Now you're ready to add the hot water to the matcha powder and start whisking.", 210, 230, 400);
        text("Get ready to complete your third homework task!", 210, 280, 400);
        fill("#134611");
        // draw start button:
        rect(250, 390, 330, 40); 
        textSize(24);
        fill("#DEE9D8");
        textAlign(CENTER, CENTER);
        textFont(jersey25); // change font to jersey25 font
        text("Click to start third homework task", 415, 408);
        fill("#134611");
        text(">", 235, 410); // draw ">" to indicate the button can be pressed
        text("<", 600, 410);
    } else if (Number(buttonState) === 1) {
        // If the button is pressed
        stage = 9; // if so, move to next stage
        stageStartTime = millis(); // store the time when moving to stage 9
    }
}

function taskThreePage() {
    let str = port.readUntil("\n"); // Read from the port until the newline
    if (str.length == 0) return; // If we didn't read anything, return.

    // grab all values and put them in an array of variables
    let [buttonState, xVal, yVal] = str.trim().split(",");

    // count the time elapsed since displaying this page:
    let timeElapsed = Math.floor((millis() - stageStartTime) / 1000); // seconds since stage started
    // convert the time elasped into a clock format (mm:ss):
    let minutes = Math.floor(timeElapsed / 60);
    let seconds = timeElapsed % 60;

    let timeElapsedFormatted = nf(minutes, 2) + ":" + nf(seconds, 2);    
    totalTime = timeElapsedFormatted;

    // if button not pressed, display the chosen bowl
    if (Number(buttonState) === 0) {
        background("#DEE9D8");
        fill("#134611");
        // position text based on the left of the text box:
        textAlign(LEFT);
        textFont(jersey25);
        textSize(24);
        // display the amount of time that has elapsed since displaying this page:
        text("Time Elapsed: " + timeElapsedFormatted, 25, 470);
        // make second text box:
        fill("#BACDB0");
        rect(290, 10, 350, 60);
        fill("#134611");
        textSize(18);
        text("While the matcha is whisking, complete your next homework task.", 300, 40, 340);
        // make Ive finished button at the bottom of the page:
        strokeWeight(0);
        fill("#134611");
        rect(600, 450, 150, 40); 
        textSize(24);
        fill("#DEE9D8");
        text("I've Finished!", 610, 470);
        // highlight the button so user knows to move onto the next task: 
        fill("#134611");
        text(">", 575, 470);
        text("<", 760, 470);
        // Display the chosen bowl: 
        if (bowlChoice === 1) {
            image(bowlImg1, 310, 130, 380, 380);
            // insert whisk gif into bowl
            image(whisk, 330, 70, 270, 270);
        } else if (bowlChoice === 2) {
            image(bowlImg2, 250, 130, 370, 370);
            // insert whisk gif into bowl
            image(whisk, 290, 70, 270, 270);
        } else if (bowlChoice === 3) {
            image(bowlImg3, 270, 130, 380, 380);
            // insert whisk gif into bowl
            image(whisk, 290, 70, 270, 270);
        }

        // insert hot water on the side
        image(water, 10, 100, 250, 250);
    } else if (Number(buttonState) === 1) {
        totalHomeworkTime += Math.floor((millis() - stageStartTime) / 1000);
        stage = 9.5; // move to next stage
    }
}

function chooseCupPage() {
    let str = port.readUntil("\n"); // Read from the port until the newline
    if (str.length == 0) return; // If we didn't read anything, return.

    // grab all values and put them in an array of variables
    let [buttonState, xVal, yVal] = str.trim().split(",");
   
    // display bowls weather or not the button is pressed:
    background("#DEE9D8");
    // make title
    fill("#134611");
    textAlign(CENTER);
    textFont(jersey25); 
    textSize(40);
    text("Pick a cup to drink your matcha in!", 400, 50);
    // draw three rectangles for the buttons of the three kettles:
    rect(65, 315, 190, 40); // left option
    rect(320, 315, 160, 40); // center option
    rect(555, 315, 175, 40); // right option
    fill("#DEE9D8");
    textAlign(LEFT, TOP);
    textSize(24);
    // Label the buttons: 
    text("Glass with Ice", 90, 325);
    text("Hot Mug", 365, 325);
    text("Jar with Ice", 580, 325);
    // Put bowl images above each button:
    image(cupImg1, 65, 125, 190, 190);
    image(cupImg2, 310, 125, 210, 210);
    image(cupImg3, 540, 125, 180, 180);

    // if button not pressed, allow user to switch between highlighted options
    if (Number(buttonState) === 0) {
        let xNum = Number(xVal);

        if (xNum >= 500 && xNum <= 525) {
            joystickReady = true; // joystick is back at center, ready for next input
        }

        if (joystickReady) {
            // if highlighted kettle is 2 (default), highlight the center kettle option (using > < symbols on either side of the option)
            if (currentHighlighted === 2) {
                fill("#134611");
                text(">", 300, 325);
                text("<", 485, 325);
                // if joystick left, goto left kettle, change highlighted kettle variable to 1
                if (xNum < 500) {
                    currentHighlighted = 1;
                    joystickReady = false;
                } else if (xNum > 525) {
                    currentHighlighted = 3;
                    joystickReady = false;
                }
            } else if (currentHighlighted === 1) { // if highlighted kettle is 1, highlight the left kettle option
                fill("#134611");
                text(">", 45, 325);
                text("<", 265, 325);
                // if joystick right, goto center kettle, change highlighted kettle variable to 2
                if (xNum > 525) {
                    currentHighlighted = 2;
                    joystickReady = false;
                }
            } else if (currentHighlighted === 3) { // if highlighted kettle is 3, highlight the right kettle option
                fill("#134611");
                text(">", 530, 325);
                text("<", 740, 325);
                // if joystick left, goto center kettle, change highlighted kettle variable to 2
                if (xNum < 500) {
                    currentHighlighted = 2;
                    joystickReady = false;
                }
            } 
        }
    } else if (Number(buttonState) === 1) {
        // if highlighted is 1, set the choice variable to 1, move to next stage
        if (currentHighlighted === 1) {
            cupChoice = 1; 
            stage = 11; // move to next stage
        } else if (currentHighlighted === 2) { // if highlighted is 2, set the choice variable to 2, move to next stage
            cupChoice = 2;
            stage = 11; // move to next stage
        } else if (currentHighlighted === 3) { // if highlighted is 3, set the choice variable to 3, move to next stage
            cupChoice = 3;
            stage = 11; // move to next stage
        }
    }
}

function cupChosen() {
    let str = port.readUntil("\n"); // Read from the port until the newline
    if (str.length == 0) return; // If we didn't read anything, return.

    // grab all values and put them in an array of variables
    let [buttonState, xVal, yVal] = str.trim().split(",");

    // reset joystick ready
    joystickReady = true;

    // Display the selected bowl and other options:
    background("#DEE9D8");
    fill("#134611");
    textAlign(CENTER);
    textFont(jersey25);
    textSize(40);
    if (cupChoice === 1) {
        text("You have chosen the Glass with Ice!", 400, 50);
        // draw the button with opposite colors to make it look selected
        stroke("#355834");
        strokeWeight(2);
        fill("#DEE9D8");
        rect(65, 315, 190, 40); // left option
        strokeWeight(0);
        fill("#134611");
        textAlign(LEFT, TOP);
        textSize(24);
        text("Glass with Ice", 90, 325);
        // Label the buttons:   
        fill("#134611");
        textAlign(LEFT, TOP);
        textSize(24);
        text("Hot Mug", 365, 325);
        text("Jar with Ice", 580, 325);
    } else if (cupChoice === 2) {
        text("You have chosen the Hot Mug!", 400, 50);
        // draw the button with opposite colors to make it look selected
        stroke("#355834");
        strokeWeight(2);
        fill("#DEE9D8");
        rect(320, 315, 160, 40); // center option
        strokeWeight(0);
        fill("#134611");
        textAlign(LEFT, TOP);
        textSize(24);
        text("Hot Mug", 365, 325);
        // Label the buttons:   
        fill("#134611");
        textAlign(LEFT, TOP);
        textSize(24);
        text("Glass with Ice", 90, 325);
        text("Jar with Ice", 580, 325);
    } else if (cupChoice === 3) {
        text("You have chosen the Jar with Ice!", 400, 50);
        // draw the button with opposite colors to make it look selected
        stroke("#355834");
        strokeWeight(2);
        fill("#DEE9D8");
        rect(555, 315, 175, 40); // right option
        strokeWeight(0);
        fill("#134611");
        textAlign(LEFT, TOP);
        textSize(24);
        text("Jar with Ice", 580, 325);
        // Label the buttons:   
        fill("#134611");
        textAlign(LEFT, TOP);
        textSize(24);
        text("Glass with Ice", 90, 325);
        text("Hot Mug", 365, 325);
    }
    // Put bowl images above each button:
    image(cupImg1, 65, 125, 190, 190);
    image(cupImg2, 310, 125, 210, 210);
    image(cupImg3, 540, 125, 180, 180);
    // make start task button at the bottom of the page:
    strokeWeight(0);
    fill("#134611");
    rect(450, 400, 240, 40); 
    fill("#DEE9D8");
    textSize(24);
    text("Click to start last task!", 465, 410);
    // highlight the start ask button so user knows to move onto the next task: 
    fill("#134611");
    text(">", 430, 410);
    text("<", 705, 410);

    if (Number(buttonState) === 1) {
        stage = 12; // move to next stage
        stageStartTime = millis(); // store the time 
    }
}

function taskFourPage() {
    let str = port.readUntil("\n"); // Read from the port until the newline
    if (str.length == 0) return; // If we didn't read anything, return.

    // grab all values and put them in an array of variables
    let [buttonState, xVal, yVal] = str.trim().split(",");

    // count the time elapsed since displaying this page:
    let timeElapsed = Math.floor((millis() - stageStartTime) / 1000); // seconds since stage started
    // convert the time elasped into a clock format (mm:ss):
    let minutes = Math.floor(timeElapsed / 60);
    let seconds = timeElapsed % 60;

    let timeElapsedFormatted = nf(minutes, 2) + ":" + nf(seconds, 2);    
    totalTime = timeElapsedFormatted;

    // if button not pressed, display the chosen cup
    if (Number(buttonState) === 0) {
        background("#DEE9D8");
        fill("#134611");
        // position text based on the left of the text box:
        textAlign(LEFT);
        textFont(jersey25);
        textSize(24);
        // display the amount of time that has elapsed since displaying this page:
        text("Time Elapsed: " + timeElapsedFormatted, 25, 470);
        // make second text box:
        fill("#BACDB0");
        rect(20, 300, 200, 100);
        fill("#134611");
        textSize(18);
        text("While the milk is being poured into the glass with sweetener, complete your last homework task", 30, 310, 200);
        // make Ive finished button at the bottom of the page:
        strokeWeight(0);
        fill("#134611");
        rect(600, 450, 150, 40); 
        textSize(24);
        fill("#DEE9D8");
        text("I've Finished!", 610, 460);
        // highlight the button so user knows to move onto the next task: 
        fill("#134611");
        text(">", 575, 460);
        text("<", 760, 460);
        // Display the chosen cup: 
        if (cupChoice === 1) {
            image(cupImg1, 250, 150, 330, 330);
            // display the measuring cup pouring into the glass
            image(milk, 210, -15, 240, 240);
            // display the spoon with sweatener
            image(spoon, 400, 20, 240, 240);
        } else if (cupChoice === 2) {
            image(cupImg2, 230, 150, 370, 370);
            // display the measuring cup pouring into the glass
            image(milk, 120, 5, 300, 300);
            // display the spoon with sweatener
            image(spoon, 360, 40, 240, 240);
        } else if (cupChoice === 3) {
            image(cupImg3, 230, 150, 310, 310);
            // display the measuring cup pouring into the glass
            image(milk, 180, 0, 240, 240);
            // display the spoon with sweatener
            image(spoon, 390, 40, 240, 240);
        }
    } else if (Number(buttonState) === 1) {
        totalHomeworkTime += Math.floor((millis() - stageStartTime) / 1000);
        stage = 13; // move to next stage
    }
}

function endPage() {
    let str = port.readUntil("\n"); // Read from the port until the newline
    if (str.length == 0) return; // If we didn't read anything, return.

    // grab all values and put them in an array of variables
    let [buttonState, xVal, yVal] = str.trim().split(",");
    
    // If the button is not pressed, display intructions
    if (Number(buttonState) === 0) {
        background("#DEE9D8");

            // initialize confetti once when arriving on this page
        if (!confettiInitialized) {
            initConfetti();
            confettiInitialized = true;
        }
        drawConfetti(); // draw confetti behind everything else

        fill("#BACDB0");
        rect(25, 100, 220, 260); // draw box for instructions
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
        // calculate the total time spent doing homework
        let totalMins = Math.floor(totalHomeworkTime / 60);
        let totalSecs = totalHomeworkTime % 60;
        // display total time in minutes and seconds:
        text("Total Time: " + nf(totalMins, 2) + ":" + nf(totalSecs, 2), 35, 330);
        fill("#134611");

        // draw the final matcha image in the center: 
        if (cupChoice === 1) {
            image(cupFinal, 290, 80, 270, 270);
        } else if (cupChoice === 2) {
            image(mugFinal, 290, 100, 250, 250);
        } else if (cupChoice === 3) {
            image(jarFinal, 290, 100, 250, 250);
        }

         // draw chosen kettle to the right of the cup:
        if (kettleChoice === 1) {
            image(kettle1Img, 590, 80, 130, 130);
        } else if (kettleChoice === 2) {
            image(kettle2Img, 590, 80, 130, 130);
        } else if (kettleChoice === 3) {
            image(kettle3Img, 590, 80, 130, 130);
        }

        // draw chosen bowl below the kettle:
        if (bowlChoice === 1) {
            image(bowlImg1, 590, 230, 130, 130);
        } else if (bowlChoice === 2) {
            image(bowlImg2, 590, 230, 130, 130);
        } else if (bowlChoice === 3) {
            image(bowlImg3, 590, 230, 130, 130);
        }

        // small labels under each accessory image:
        fill("#134611");
        textSize(14);
        textAlign(CENTER);
        text("Your Kettle", 655, 215);
        text("Your Bowl", 655, 365);

        // draw start over button:
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

    } else if (Number(buttonState) === 1) {
        // If the button is pressed
        stage = 0; // if so, move to next stage
        // Restart all global variables:
        kettleChoice = 2; // This variable will keep track of the user's choice of kettle
        // make variable for which kettle is currently highlighted:
        currentHighlighted = 2; // default to center kettle option being highlighted
        // store the start time when counting time elapsed:
        stageStartTime = 0;
        // keep track of the user's bowl:
        bowlChoice = 2;
        // keep track of time elapsed during tasks:
        totalTime = 0;
        // keep track of cup choice
        cupChoice = 2;
        // reset joystick ready
        joystickReady = true;
        // reset total time spent doing hw
        totalHomeworkTime = 0;
        // 
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
            y: random(-200, 0),         // start above the canvas
            size: random(6, 14),
            color: random(colors),
            speedY: random(2, 5),
            speedX: random(-1.5, 1.5),
            rotation: random(TWO_PI),
            rotationSpeed: random(-0.1, 0.1),
            shape: random(["rect"]) // shapes
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

        // update position each frame
        p.y += p.speedY;
        p.x += p.speedX;
        p.rotation += p.rotationSpeed;

        // if a particle falls off the bottom, reset it to the top
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

// ------------------ HELPER FUNCTIONS ------------------
// Three helper functions for managing the serial connection.

function setupSerial() {
  port = createSerial();

  // Check to see if there are any ports we have used previously
  let usedPorts = usedSerialPorts();
  if (usedPorts.length > 0) {
    // If there are ports we've used, open the first one
    port.open(usedPorts[0], BAUD_RATE);
  }

  // create a connect button
  connectBtn = createButton("Connect to Arduino");
  connectBtn.position(5, 5); // Position the button in the center of the screen.
  connectBtn.mouseClicked(onConnectButtonClicked); // When the button is clicked, run the onConnectButtonClicked function
}

function checkPort() {
  if (!port.opened()) {
    // If the port is not open, change button text
    connectBtn.html("Connect to Arduino");
    // Set background to gray
    background("gray");
    return false;
  } else {
    // Otherwise we are connected
    connectBtn.html("Disconnect");

    return true;
  }
}

function onConnectButtonClicked() {
  // When the connect button is clicked
  if (!port.opened()) {
    // If the port is not opened, we open it
    port.open(BAUD_RATE);
  } else {
    // Otherwise, we close it!
    port.close();
  }
}
