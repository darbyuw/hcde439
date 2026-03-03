const BAUD_RATE = 9600; // This should match the baud rate in your Arduino sketch
const MIN_DIAMETER = 10;
const MAX_DIAMETER = 40;

let port, connectBtn; // Declare global variables
let bgImg, startScreen, logoImg;
let stage = 0; // This variable will keep track of which page we are on in the game
let kettleChoice = 2; // This variable will keep track of the user's choice of kettle
// make variable for which kettle is currently highlighted
    let highlightedKettle = 2; // default to center kettle option being highlighted


var jersey25;

function preload() {
    // bgImg = loadImage("background.png");
    // startScreen = loadImage("startScreen.png");
    logoImg = loadImage("temp-logo.png");
    jersey25 = loadFont("Jersey25-Regular.ttf");
}

function setup() {
  setupSerial(); // Run our serial setup function (below)
  createCanvas(800, 500);
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
        taskOnePage();
    } else if (stage === 4) {
        chooseBowlPage();
    } else if (stage === 5) {
        taskTwoPage();
    } else if (stage === 6) {
        taskThreePage();
    } else if (stage === 7) {
        chooseCupPage();
    } else if (stage === 8) {
        taskFourPage();
    } else if (stage === 9) {
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
        image(logoImg, 300, 50, 200, 100); // draw logo at top of the page
        // create a button:
        fill("#134611");
        rect(300, 275, 200, 50); // draw button
        textSize(24);
        fill("#DEE9D8");
        textAlign(CENTER);
        textFont(jersey25); // change font to jersey25 font
        text("Start Game", 400, 310);
        text(">", 300, 310); // draw ">" to indicate the button can be pressed
        text("<", 500, 310);
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
        rect(100, 100, 700, 400); // draw box for instructions
        fill("#134611");
        textAlign(CENTER);
        textFont(jersey25); // change font to jersey25 font
        textSize(24);
        text("Instructions", 400, 100);
        text("Before starting, remove any distractions, and put away your phone.", 400, 200);
        text("Break up your homework into four tasks. This could be one assignment split into smaller parts, or four separate assignments.", 400, 250);
        text("Each task will be paired with a step while making a matcha latte. You will move onto the next step in the game when you finish your homework task!", 400, 300);
        text("You will get to customize your matcha as you go, at the end you will have a customized matcha latte!", 400, 350);
        text("Grab a study drink and lets get started by choosing our first item!", 400, 400);
        fill("#134611");
        rect(300, 275, 200, 50); // draw button
        textSize(24);
        fill("#DEE9D8");
        textAlign(CENTER);
        textFont(jersey25); // change font to jersey25 font
        text("Start", 400, 310);
        text(">", 300, 310); // draw ">" to indicate the button can be pressed
        text("<", 500, 310);
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

    // if button not pressed, display all of the kettle options
    if (Number(buttonState) === 0) {
        // display kettles
        // if highlighted kettle is 2 (default), highlight the center kettle option (using > < symbols on either side of the option)
            // if joystick left, goto left kettle, change highlighted kettle variable to 1
            // if joystick right, goto right kettle, change highlighted kettle variable to 3
            // if joystick down, goto start task button, change highlighted kettle variable to 4

        // if highlighted kettle is 1, highlight the left kettle option
            // if joystick right, goto center kettle, change highlighted kettle variable to 2
            // if joystick down, goto start task button, change highlighted kettle variable to 4
                
        // if highlighted kettle is 3, highlight the right kettle option
            // if joystick left, goto center kettle, change highlighted kettle variable to 2
            // if joystick down, goto start task button, change highlighted kettle variable to 4
                
        // if highlighted kettle is 4, highlight the 'start task' button
            // if joystick up, goto center kettle, change highlighted kettle variable to 2
            
    } else if (Number(buttonState) === 1) {
        // if highlighted kettle is 1, change the look of the button to make it selected, and set the kettle choice variable to 1
        // if highlighted kettle is 2, change the look of the button to make it selected, and set the kettle choice variable to 2
        // if highlighted kettle is 3, change the look of the button to make it selected, and set the kettle choice variable to 3
        // if highlighted kettle is 4 (start task), move to the next stage
    }
            
        
        









        // // if the joystick is moved to the left, highlight the first kettle option
        // if (Number(xVal) < 500) {
        //     // if the button is pressed while on the first kettle option, change that button to selected
        // // if the joystick is moved to the right, highlight the second kettle option
        // } else if (Number(xVal) > 525) {
        //     // if the button is pressed while on the second kettle option, change that button to selected
        //     // set the kettle choice variable to the user's choice 
        // } else if (Number(xVal) >= 450 && Number(xVal) <= 550) {

        // // if the joystick is centered, highlight the center option
        //     // if the button is pressed while on the center option, change that button to selected
        
            
    } else if (Number(buttonState) === 1) {
        // if the button is pressed while on the 'start task' button, move to the next stage (task one)
        // keep track of the user's choice of kettle
        // if the button is pressed, move to the next stage (task one)
        stage = 3;
    }
        
    

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
