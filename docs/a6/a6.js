const BAUD_RATE = 9600; // This should match the baud rate in your Arduino sketch
const MIN_DIAMETER = 10;
const MAX_DIAMETER = 40;

let port, connectBtn; // Declare global variables
let bgImg, startScreen, logoImg;
let stage = 0; // This variable will keep track of which page we are on in the game

var jersey25;

function preload() {
    // bgImg = loadImage("background.png");
    // startScreen = loadImage("startScreen.png");
    // logoImg = loadImage("logo.png");
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

    // trim the whitespace (the newline) and convert the string to a number
    const buttonState = Number(str.trim());
    
    // If the button is not pressed, stay on the start page
    if (buttonState === 0) {
        background("green");
        // image(logoImg, 300, 50); // draw logo at top of the page
        // create a button:
        fill("blue");
        rect(400, 300, 200, 50); // draw button
        textSize(10);
        fill("black");
        textAlign(CENTER);
        textFont(jersey25); // change font to jersey25 font
        text("Start Game", 400, 310);
    } else if (buttonState === 1) {
        background("lightskyblue");
        // If the button is pressed
        // stage = 1; // if so, move to next stage
    }
}

function instructionsPage() {
    background(bgImg);
    fill("black");
    textAlign(CENTER);
    textFont(jersey25); // change font to jersey25 font
    textSize(12);
    text("Instructions go here!!", 400, 100);
    textSize(10);
    text("Press the button to move to the next stage.", 400, 150);
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
