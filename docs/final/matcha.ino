// code for the arduino for assignmnet 6
// initialize button pin
const int BUTTON_PIN = 2;
// Initialize a variable for the analog input pin for x values
int x = A0;
// Initialize a variable for the analog input pin for y values
int y = A1;
// Initialize a variable for the joystick x values 
int xVal = 0;
// Initialize a variable for the joystick y values
int yVal = 0;
// Initialize variable for keeping track of the button status:
int currBtnState = 0;  
// Initialize variable for keeping track of the previous button status:
int prevBtnState = currBtnState;


void setup() {
    // start serial communication at 9600 baud rate
    Serial.begin(9600);
    // set the button pin as an input
    pinMode(BUTTON_PIN, INPUT);
}

void loop() {
    // Read the state of the push button value:
    currBtnState = digitalRead(BUTTON_PIN);
    // Check if the push button is pressed:
    Serial.print(currBtnState);
    // Send a comma between each value
    Serial.print(",");
    // Read in the x value from the joystick
    xVal = analogRead(x);
    // Read in the y value from the joystick
    yVal = analogRead(y);
    // Print the x value to the serial monitor
    Serial.print(xVal);
    // Send a comma between each value
    Serial.print(",");
    // Print the y value to the serial monitor
    Serial.println(yVal);

    // reset the previous stored state of the button to the current state:
    prevBtnState = currBtnState;

    // wait 200 miliseconds so that multiple button pushses dont happen back to back
    delay(100);
}
