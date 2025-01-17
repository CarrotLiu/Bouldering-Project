let socket;
let sd;
let blinkState = 0; 
let blinkProgress = 0; 
let nextBlinkTime = 0; 
let lastBlinkTime = 0;

let eyeWidth = 60;
let eyeHeight = 60;
let eyeOffsetX = 0; 
let eyeOffsetY = 0; 
let targetEyeOffsetX = 0; 
let targetEyeOffsetY = 0; 
let nextShiftTime = 0; 
let shiftDuration = 2000; 
let openMouth = false; 
let mouthTimer = 0;   
let nextMouthChange;   
let mouthOpenHeight = 0; 
let mouthOpenWidth = 35;

let stage = 0;

const challengeW = ["challenge", "climbing", "fun", "game", "interesting"];
const friendW = ["friend","buddy", "partner"];
const photoW = ["photo", "camera", "picture"];

const statusElement = document.getElementById("status");
const matchedWords = document.getElementById("detectedWords");
const startButton = document.getElementById("startButton");
const stopButton = document.getElementById("stopButton");

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.lang = "en-US";
recognition.continuous = true;
recognition.interimResults = false;

let detected = []; 

startButton.addEventListener("click", () => {
  detected = []; 
  matchedWords.textContent = "";
  statusElement.textContent = "Listening for speech...";
  recognition.start();
  startButton.disabled = true;
  stopButton.disabled = false;
});


stopButton.addEventListener("click", () => {
  recognition.stop();
  statusElement.textContent = "Stopped listening.";
  startButton.disabled = false;
  stopButton.disabled = true;
});


recognition.onresult = (event) => {
  const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase();
  console.log("Recognized:", transcript);


  challengeW.forEach(word => {
    if (transcript.includes(word) && !detected.includes(word)) {
      detected.push(word);
      stage = 2;
    }
  });


  friendW.forEach(word => {
    if (transcript.includes(word) && !detected.includes(word)) {
      detected.push(word);
      stage = 3;
    }
  });
  photoW.forEach(word => {
    if (transcript.includes(word) && !detected.includes(word)) {
      detected.push(word);
      stage = 4;
    }
  });

  matchedWords.textContent = detected.join(", ");
  // console.log(matchedWords);
};


recognition.onerror = (event) => {
  console.error("Speech recognition error:", event.error);
  statusElement.textContent = "Error occurred. Please try again.";
};


recognition.onend = () => {
  if (!stopButton.disabled) {
    statusElement.textContent = "Listening paused. Click 'Start' to resume.";
  }
};

function preload(){
  sd = loadSound('https://cdn.glitch.global/26e72b2d-5b19-4d34-8211-99b75e2441cc/test.m4a?v=1735554953863');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);

  socket = io.connect();
  console.log(socket);
  socket.on("connection_name", receive);
  
  nextBlinkTime = millis() + random(2000, 5000);
  nextShiftTime = millis() + random(3000, 7000); 
  nextMouthChange = millis() + random(2000, 5000); // 2 to 5 seconds
}

function draw() {
  background(0);
  fill(255);
  noStroke();
  if(stage == 0){
    if (millis() > nextMouthChange) {
      openMouth = !openMouth; 
      // mouthOpenHeight = 0; // Reset opening angle
      nextMouthChange = millis() + random(2000, 5000); // Set next random interval
    }
    if (openMouth) {
      mouthOpenHeight = lerp(mouthOpenHeight, 0, 0.1); 
      mouthOpenWidth = lerp(mouthOpenWidth, 25, 0.1);
    } else {
      mouthOpenHeight = lerp(mouthOpenHeight, 35, 0.1); 
      mouthOpenWidth = lerp(mouthOpenWidth, 35, 0.1);
    }
    idling();
  } else if(stage == 1){//intro stage
    
    focusing();
  } else if(stage == 2){//challenge stage
    challenging();
    focusing();
  } else if(stage == 3){//find friend
    
  }
  
}
  

function mouseClicked(){
  if(dist(mouseX, mouseY, width / 2, height / 2) < 100){
    let data = {}; // JS Object
    data.s = true;
    socket.emit("connection_name", data);
  }
}

function mouseDragged() {
  // let data = {}; // JS Object
  // data.x = mouseX;
  // data.y = mouseY;
  

  // noStroke();
  // fill(0, 255, 0);
  // ellipse(data.x, data.y, 10, 10);

  // socket.emit("connection_name", data);
}

function receive(data) {
  console.log(data);
  if(data.s){
    sd.play();
  }
  // noStroke();
  // fill(255, 0, 255);
  // ellipse(data.x, data.y, 10, 10);
}

function blinkControl(){
  if (millis() > nextBlinkTime) {
    lastBlinkTime = millis();
    nextBlinkTime = millis() + random(1000, 6000); 
    blinkState = 1; 
  }
  if (blinkState === 1) {
    blinkProgress += 0.1;
    if (blinkProgress >= 1) {
      blinkState = 2; 
    }
  } else if (blinkState === 2) {
    blinkProgress -= 0.1;
    if (blinkProgress <= 0) {
      blinkState = 0; 
      blinkProgress = 0;
    }
  }
  eyeHeight = lerp(60, 10, blinkProgress);
}

function drawFace(){
  push();
  translate(eyeOffsetX, eyeOffsetY);
  ellipse(width / 2 - 100, height / 2, eyeWidth, eyeHeight);
  ellipse(width / 2 + 100, height / 2, eyeWidth, eyeHeight);
  
  push();
  noFill();
  stroke(255);
  strokeWeight(4);
  arc(width / 2 + eyeOffsetX * 0.35, height / 2 + 20 + eyeOffsetX * 0.05, mouthOpenWidth, mouthOpenHeight, 0, PI); 
  arc(width / 2 + eyeOffsetX * 0.35, height / 2 + 20 + eyeOffsetX * 0.05, mouthOpenWidth, 35 - 0.8 * (mouthOpenHeight - 35), 0, PI); 
  console.log(mouthOpenHeight);
  pop();
  pop();
}

function idling(){
  blinkControl();
  
  if (millis() > nextShiftTime) {
    nextShiftTime = millis() + random(3000, 7000); 
    targetEyeOffsetX = random(-50, 50); 
    targetEyeOffsetY = random(-50, 50);
  }
  eyeOffsetX = lerp(eyeOffsetX, targetEyeOffsetX, 0.05);
  eyeOffsetY = lerp(eyeOffsetY, targetEyeOffsetY, 0.05);
  drawFace();
}


function focusing(){
  push();
  blinkControl();
  
  eyeOffsetX = lerp(eyeOffsetX, 0, 0.05);
  eyeOffsetY = lerp(eyeOffsetY, 0, 0.05);
  
  drawFace();
  pop();
}

function challenging(){
  push();
  translate(width / 2, height / 2 -200);
  fill("#007944");
  noStroke();
  circle(-90, -50, 60);
  fill("#FFE31A");
  circle(-30, 0, 60);
  fill("#F35588");
  circle(30, 0, 60);
  fill("#80C4E9");
  circle(90, -50, 60);
  pop();
}

function socializing(){
  
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function keyPressed() {
  if (key === 'c') {
    if(stage < 4){
      stage ++;
    }else{
      stage = 0;
    }
  }

}
/* global

io

p5 ml5 Stats dat alpha blue brightness color green hue lerpColor lightness red saturation background clear colorMode fill noFill noStroke stroke erase noErase 2D Primitives arc ellipse circle line point quad rect square triangle ellipseMode noSmooth rectMode smooth strokeCap strokeJoin strokeWeight bezier bezierDetail bezierPoint bezierTangent curve curveDetail curveTightness curvePoint curveTangent beginContour beginShape bezierVertex curveVertex endContour endShape quadraticVertex vertex plane box sphere cylinder cone ellipsoid torus loadModel model HALF_PI PI QUARTER_PI TAU TWO_PI DEGREES RADIANS print frameCount deltaTime focused cursor frameRate noCursor displayWidth displayHeight windowWidth windowHeight windowResized width height fullscreen pixelDensity displayDensity getURL getURLPath getURLParams remove disableFriendlyErrors noLoop loop isLooping push pop redraw select selectAll removeElements changed input createDiv createP createSpan createImg createA createSlider createButton createCheckbox createSelect createRadio createColorPicker createInput createFileInput createVideo createAudio VIDEO AUDIO createCapture createElement createCanvas resizeCanvas noCanvas createGraphics blendMode drawingContext setAttributes boolean string number applyMatrix resetMatrix rotate rotateX rotateY rotateZ scale shearX shearY translate storeItem getItem clearStorage removeItem createStringDict createNumberDict append arrayCopy concat reverse shorten shuffle sort splice subset float int str byte char unchar hex unhex join match matchAll nf nfc nfp nfs split splitTokens trim deviceOrientation accelerationX accelerationY accelerationZ pAccelerationX pAccelerationY pAccelerationZ rotationX rotationY rotationZ pRotationX pRotationY pRotationZ turnAxis setMoveThreshold setShakeThreshold deviceMoved deviceTurned deviceShaken keyIsPressed key keyCode keyPressed keyReleased keyTyped keyIsDown movedX movedY mouseX mouseY pmouseX pmouseY winMouseX winMouseY pwinMouseX pwinMouseY mouseButton mouseWheel mouseIsPressed requestPointerLock exitPointerLock touches createImage saveCanvas saveFrames image tint noTint imageMode pixels blend copy filter THRESHOLD GRAY OPAQUE INVERT POSTERIZE BLUR ERODE DILATE get loadPixels set updatePixels loadImage loadJSON loadStrings loadTable loadXML loadBytes httpGet httpPost httpDo Output createWriter save saveJSON saveStrings saveTable day hour minute millis month second year abs ceil constrain dist exp floor lerp log mag map max min norm pow round sq sqrt fract createVector noise noiseDetail noiseSeed randomSeed random randomGaussian acos asin atan atan2 cos sin tan degrees radians angleMode textAlign textLeading textSize textStyle textWidth textAscent textDescent loadFont text textFont orbitControl debugMode noDebugMode ambientLight specularColor directionalLight pointLight lights lightFalloff spotLight noLights loadShader createShader shader resetShader normalMaterial texture textureMode textureWrap ambientMaterial emissiveMaterial specularMaterial shininess camera perspective ortho frustum createCamera setCamera ADD CENTER CORNER CORNERS POINTS WEBGL RGB ARGB HSB LINES CLOSE BACKSPACE DELETE ENTER RETURN TAB ESCAPE SHIFT CONTROL OPTION ALT UP_ARROW DOWN_ARROW LEFT_ARROW RIGHT_ARROW sampleRate freqToMidi midiToFreq soundFormats getAudioContext userStartAudio loadSound createConvolver setBPM saveSound getMasterVolume masterVolume soundOut chain drywet biquadFilter process freq res gain toggle setType pan phase triggerAttack triggerRelease setADSR attack decay sustain release dispose notes polyvalue AudioVoice noteADSR noteAttack noteRelease isLoaded playMode set isPlaying isPaused setVolume getPan rate duration currentTime jump channels frames getPeaks reverseBuffer onended setPath setBuffer processPeaks addCue removeCue clearCues getBlob getLevel toggleNormalize waveform analyze getEnergy getCentroid linAverages logAverages getOctaveBands fade attackTime attackLevel decayTime decayLevel releaseTime releaseLevel setRange setExp width output stream mediaStream currentSource enabled amplitude getSources setSource bands panner positionX positionY positionZ orient orientX orientY orientZ setFalloff maxDist rollof leftDelay rightDelay delayTime feedback convolverNode impulses addImpulse resetImpulse toggleImpulse sequence getBPM addPhrase removePhrase getPhrase replaceSequence onStep musicalTimeMode maxIterations synced bpm timeSignature interval iterations compressor knee ratio threshold reduction record isDetected update onPeak WaveShaperNode getAmount getOversample amp setInput connect disconnect play pause stop start add mult
*/
