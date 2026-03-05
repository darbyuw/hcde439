const BAUD_RATE = 9600; // This should match the baud rate in your Arduino sketch

let port, connectBtn; // Declare global variables
let bgImg, startScreen, logoImg;
let stage = 0; // This variable will keep track of which page we are on in the game
let kettleChoice = 2; // This variable will keep track of the user's choice of kettle
// make variable for which kettle is currently highlighted:
let highlightedKettle = 2; // default to center kettle option being highlighted


var jersey25;

function preload() {
    logoImg = loadImage("temp-logo.png");
    jersey25 = loadFont("Jersey25-Regular.ttf");
    kettle1Img = loadImage("classic_electric_kettle.png");
    kettle2Img = loadImage("green_kettle.png");
    kettle3Img = loadImage("graves_kettle.png");
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
        startFirstTask();
    } else if (stage === 4) {
        taskOnePage();
    } else if (stage === 5) {
        chooseBowlPage();
    } else if (stage === 6) {
        taskTwoPage();
    } else if (stage === 7) {
        taskThreePage();
    } else if (stage === 8) {
        chooseCupPage();
    } else if (stage === 9) {
        taskFourPage();
    } else if (stage === 10) {
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
        image(logoImg, 150, 100, 446.48, 144.16); // draw logo at top of the page
        // create a button:
        fill("#134611");
        rect(300, 300, 150, 40); // draw button
        textSize(24);
        fill("#DEE9D8");
        textAlign(CENTER);
        textFont(jersey25); // change font to jersey25 font
        text("Start Game", 375, 326);
        fill("#134611");
        text(">", 280, 326); // draw ">" to indicate the button can be pressed
        text("<", 470, 326);
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
        textSize(24);
        textAlign(LEFT);
        text("Instructions", 75, 100);
        textSize(20);
        text("Before starting, remove any distractions, and put away your phone.", 75, 150);
        text("Break up your homework into four tasks. This could be one assignment split into smaller parts, or four separate assignments.", 75, 185, 650);
        text("Each task will be paired with a step while making a matcha latte. You will move onto the next step in the game when you finish your homework task!", 75, 245, 650);
        text("You will get to customize your matcha as you go, at the end you will have a customized matcha latte!", 75, 305, 650);
        text("Grab a study drink and lets get started by choosing our first item!", 75, 365);
        fill("#134611");
        rect(300, 390, 200, 50); // draw button
        textSize(24);
        fill("#DEE9D8");
        textAlign(CENTER);
        textFont(jersey25); // change font to jersey25 font
        text("Start", 400, 420);
        fill("#134611");
        text(">", 280, 420); // draw ">" to indicate the button can be pressed
        text("<", 520, 420);
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
        // if highlighted kettle is 2 (default), highlight the center kettle option (using > < symbols on either side of the option)
        if (highlightedKettle === 2) {
            fill("#134611");
            text(">", 300, 325);
            text("<", 475, 325);
            // if joystick left, goto left kettle, change highlighted kettle variable to 1
            if (Number(xVal) < 500) {
                highlightedKettle = 1;
            } else if (Number(xVal) > 525) { // if joystick right, goto right kettle, change highlighted kettle variable to 3
                highlightedKettle = 3;
            }
        } else if (highlightedKettle === 1) { // if highlighted kettle is 1, highlight the left kettle option
            fill("#134611");
            text(">", 45, 325);
            text("<", 245, 325);
            if (Number(xVal) > 525) { // if joystick right, goto center kettle, change highlighted kettle variable to 2
                highlightedKettle = 2;
            }
        } else if (highlightedKettle === 3) { // if highlighted kettle is 3, highlight the right kettle option
            fill("#134611");
            text(">", 515, 325);
            text("<", 755, 325);
            if (Number(xVal) < 500) { // if joystick left, goto center kettle, change highlighted kettle variable to 2
                highlightedKettle = 2;
            }
        } 
    } else if (Number(buttonState) === 1) {
        // if highlighted kettle is 1, set the kettle choice variable to 1, move to next stage
        if (highlightedKettle === 1) {
            kettleChoice = 1; // This will be used in stage 4
            stage = 3; // move to next stage
        } else if (highlightedKettle === 2) { // if highlighted kettle is 2, set the kettle choice variable to 2, move to next stage
            kettleChoice = 2;
            stage = 3; // move to next stage
        } else if (highlightedKettle === 3) { // if highlighted kettle is 3, set the kettle choice variable to 3, move to next stage
            kettleChoice = 3;
            stage = 3; // move to next stage
        }
    }
}  

function startFirstTask() {
    let str = port.readUntil("\n"); // Read from the port until the newline
    if (str.length == 0) return; // If we didn't read anything, return.

    // grab all values and put them in an array of variables
    let [buttonState, xVal, yVal] = str.trim().split(",");

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
    rect(480, 400, 270, 40); 
    fill("#DEE9D8");
    textSize(24);
    text("Start First Homework Task!", 490, 410);
    // highlight the start ask button so user knows to move onto the next task: 
    fill("#134611");
    text(">", 455, 410);
    text("<", 760, 410);

    if (Number(buttonState) === 1) {
        stage = 0; // move to next stage
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
  connectBtn.position(5, 5); // Position the button in the top left of the screen.
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
