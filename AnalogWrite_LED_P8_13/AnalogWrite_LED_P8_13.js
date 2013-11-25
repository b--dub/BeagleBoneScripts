// Swings var value from 0.01 to 0.99 and analogWrite()s value to PWM pin P8_13
// When read w/ analog voltmeter P8_13 shows sweep from ~0 to ~3.3V

var bone = require('bonescript');

var outputPin = "P8_13";
var value = 0;
var inc = 0.01;
console.log("begin");

bone.pinMode(outputPin, bone.OUTPUT);
loop();

function loop() {                               // recursive loop
    if (value < 0.02) inc = 0.01;
    else if (value > 0.98) inc =  -0.01;
    value += inc;
    
    bone.analogWrite(outputPin, value);
    console.log(value);
    setTimeout(loop, 10);
}

