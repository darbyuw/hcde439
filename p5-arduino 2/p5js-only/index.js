const BAUD_RATE = 9600;

let port, connectBtn;
let brightness = 0;

function setup() {
  setupSerial();
  createCanvas(windowWidth, windowHeight);

  textFont("system-ui", 24);
  textStyle(BOLD);
  textAlign(CENTER, CENTER);
}

function draw() {
  const portIsOpen = checkPort();
  if (!portIsOpen) return;

  // Read the Arduino's echo
  let str = port.readUntil("\n");
  if (str.length > 0) {
    brightness = Number(str.trim());
  }

  if (mousePressed) {
    fill("green");
    port.write("1\n"); // Send "1" to the Arduino when the mouse is pressed
  } else {
    fill("red");
    port.write("0\n"); // Send "0" to the Arduino when the mouse is not pressed
  }
  rect(mouseX, mouseY, 55, 55);
}

// function mouseMoved() {
//   if (!port.opened()) return;

//   // Map mouse X position to 0–255
//   let val = Math.floor(map(mouseX, 0, windowWidth, 0, 255));
//   val = constrain(val, 0, 255);

//   // Send the value as a single byte
//   port.write([val]);
// }

// --- Serial helpers ---

function setupSerial() {
  port = createSerial();

  let usedPorts = usedSerialPorts();
  if (usedPorts.length > 0) {
    port.open(usedPorts[0], BAUD_RATE);
  }

  connectBtn = createButton("Connect to Arduino");
  connectBtn.position(5, 5);
  connectBtn.mouseClicked(onConnectButtonClicked);
}

function checkPort() {
  if (!port.opened()) {
    connectBtn.html("Connect to Arduino");
    background("gray");
    return false;
  } else {
    connectBtn.html("Disconnect");
    return true;
  }
}

function onConnectButtonClicked() {
  if (!port.opened()) {
    port.open(BAUD_RATE);
  } else {
    port.close();
  }
}