// Swings var value from 0.01 to 0.99 and analogWrite()s value to PWM pin P8_13
// When read w/ analog voltmeter P8_13 shows sweep from ~0 to ~3.3V

var bone = require('bonescript');
var readline = require('readline');

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});


var outputPin = "P8_13";
var value = 0;
var inc = 0.01;
console.log("begin");

bone.pinMode(outputPin, bone.OUTPUT);

rl.prompt();
rl.on('line', function(chunk) {
    chunk = Number(chunk);
    if (chunk >= 0 && chunk <= 1) value=chunk;
});

loop();

function loop() {  
    if (value < 0.04) inc = 0.03;
    else if (value > 0.96) inc =  -0.03;
    value += inc;
    
    bone.analogWrite(outputPin, value);
    console.log(value.toFixed(2));
    setTimeout(loop, 25);
}

