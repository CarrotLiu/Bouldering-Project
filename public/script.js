let socket;

let amplitude;
let intro;
let introDone = false;

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

let isSpeaking = false;
let isListening = false;

let openMouth = false;
let mouthTimer = 0;   
let nextMouthChange;   
let mouthOpenHeight = 0; 
let mouthOpenWidth = 35;

let stage = 0;
let scene;

const challenges=[["Climb with left hand only", "Climb with right hand only", "Climb without hands", "Climb without feet", "Grab every boulder with both hands","Skip three holds of your choice."],["climb with one hand only", "skip two holds of your choice"],["climb with", "skip one hold of your choice"],["climb while keeping your back towards the wall all the time"] ];
const challengeColor=["#007944", "#FFE31A", "#F35588", "#80C4E9"];
const challengeW = ["challenge", "climbing", "fun", "game", "interesting"];
const routeW = ["random", "randomize", "route", "new", "which"];
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

  if(stage == 2){
    if(transcript.includes("green") || transcript.includes("dark green") || transcript.includes("two")){
      scene = 0;
    }else if(transcript.includes("yellow") || transcript.includes("lemon") || transcript.includes("three")){
      scene = 1;
    }else if(transcript.includes("pink") || transcript.includes("four")){
      scene = 2;
    }else if(transcript.includes("blue") || transcript.includes("sky blue") || transcript.includes("five") || transcript.includes("five minus")){
      scene = 3;
    }
  }
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
  intro = loadSound('https://cdn.glitch.global/26e72b2d-5b19-4d34-8211-99b75e2441cc/introtest.m4a?v=1737277207094');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);

  socket = io.connect();
  console.log(socket);
  socket.on("connection_name", receive);
  
  nextBlinkTime = millis() + random(2000, 5000);
  nextShiftTime = millis() + random(3000, 7000); 
  nextMouthChange = millis() + random(2000, 5000); 
  
  textFont("Titillium Web");
  
  intro.play();
  amplitude = new p5.Amplitude();
  amplitude.setInput(intro);
}

function draw() {
  background(0);
  fill(255);
  noStroke();
  if(stage == 0){
    scene = null;
    if(intro.isPlaying()){
      isSpeaking = true;
    }else{
      isSpeaking = false;
    }
  } else if(stage == 1){//intro stage
    scene = null;
  } else if(stage == 2){//challenge stage
    challenging();
  } else if(stage == 3){//find friend
    scene = null;
    
  }
  push();
  if(isSpeaking){
    focusing();
  }else{
    idling();
  }
  pop();
  
}
  

function mouseClicked(){
  if(dist(mouseX, mouseY, width / 2, height / 2) < 100){
    let data = {};
    data.s = true;
    socket.emit("connection_name", data);
  }
}

function mouseDragged() {
  // let data = {}; 
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
    intro.play();
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



function assembleFace(){
  push();
  translate(eyeOffsetX, eyeOffsetY);
  ellipse(width / 2 - 100, height / 2, eyeWidth, eyeHeight);
  ellipse(width / 2 + 100, height / 2, eyeWidth, eyeHeight);
  noFill();
  stroke(255);
  strokeWeight(4);
  if(isSpeaking){
    // if (millis() > nextMouthChange) {
    //   openMouth = !openMouth; 
    //   // mouthOpenHeight = 0; 
    //   nextMouthChange = millis() + random(3000, 10000); 
    // }
    // if (openMouth) {
    //   mouthOpenHeight = lerp(mouthOpenHeight, 0, 0.2); 
    //   mouthOpenWidth = lerp(mouthOpenWidth, 25, 0.2);
    // } else {
    //   mouthOpenHeight = lerp(mouthOpenHeight, 35, 0.2); 
    //   mouthOpenWidth = lerp(mouthOpenWidth, 35, 0.2);
    // }
  // }else{
    let level = amplitude.getLevel();
    if(level != 0){
      mouthOpenHeight = lerp(mouthOpenHeight, 35 - level * 360, 0.3); 
      mouthOpenWidth = lerp(mouthOpenWidth, 35 - level * 200, 0.3);
    }else{
      mouthOpenHeight = lerp(mouthOpenHeight, 35, 0.1); 
      mouthOpenWidth = lerp(mouthOpenWidth, 35, 0.1);
    }
    arc(width / 2 + eyeOffsetX * 0.35, height / 2 + 20 + eyeOffsetX * 0.05, mouthOpenWidth, mouthOpenHeight, 0, PI); 
    arc(width / 2 + eyeOffsetX * 0.35, height / 2 + 20 + eyeOffsetX * 0.05, mouthOpenWidth, 35 + level * 100, 0, PI); 
  }else{
    arc(width / 2 + eyeOffsetX * 0.35, height / 2 + 20 + eyeOffsetX * 0.05, 35, 35, 0, PI); 
  }
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
  assembleFace();
}


function focusing(){
  push();
  blinkControl();
  
  eyeOffsetX = lerp(eyeOffsetX, 0, 0.05);
  eyeOffsetY = lerp(eyeOffsetY, 0, 0.05);
  
  assembleFace();
  pop();
}

function challenging(){
  textAlign(CENTER, CENTER);
  if(scene != null){
    push();
    translate(width / 2, height / 2 -180);
    fill(challengeColor[0]);
    textSize(25);
    text("Go to the " + challenges[scene][int(random(0, challenges.length))][0], 0, 0);
    textSize(18);
    text(challenges[scene][int(random(0, challenges.length))][1], 0, -50);
    pop();
  }else{
    push();
    translate(width / 2, height / 2 -180);
    fill(challengeColor[0]);
    noStroke();
    circle(-130, 50, 60);
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(20);
    text("2", -130, 50);
    fill(challengeColor[1]);
    circle(-50, 0, 60);
    fill(0);
    text("3", -50, 0);
    fill(challengeColor[2]);
    circle(50, 0, 60);
    fill(255);
    text("4", 50, 0);
    fill(challengeColor[3]);
    circle(130, 50, 60);
    fill(0);
    text("5-", 130, 50);
    pop();
    push();
    translate(width / 2, height / 2 + 130);
    fill(255);
    textSize(25);
    text("Choose a Route Color Code", 0, -20);
    textSize(16);
    text("The color code indicates the route's difficulty", 0, 35);
    text("Challenges available for levels below the sky blue color", 0, 60);
    pop();
  }
  
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
  if(key === 't'){
    isSpeaking = !isSpeaking;
  }

}
/* global

io

p5 ml5 Stats dat alpha blue brightness color green hue lerpColor lightness red saturation background clear colorMode fill noFill noStroke stroke erase noErase 2D Primitives arc ellipse circle line point quad rect square triangle ellipseMode noSmooth rectMode smooth strokeCap strokeJoin strokeWeight bezier bezierDetail bezierPoint bezierTangent curve curveDetail curveTightness curvePoint curveTangent beginContour beginShape bezierVertex curveVertex endContour endShape quadraticVertex vertex plane box sphere cylinder cone ellipsoid torus loadModel model HALF_PI PI QUARTER_PI TAU TWO_PI DEGREES RADIANS print frameCount deltaTime focused cursor frameRate noCursor displayWidth displayHeight windowWidth windowHeight windowResized width height fullscreen pixelDensity displayDensity getURL getURLPath getURLParams remove disableFriendlyErrors noLoop loop isLooping push pop redraw select selectAll removeElements changed input createDiv createP createSpan createImg createA createSlider createButton createCheckbox createSelect createRadio createColorPicker createInput createFileInput createVideo createAudio VIDEO AUDIO createCapture createElement createCanvas resizeCanvas noCanvas createGraphics blendMode drawingContext setAttributes boolean string number applyMatrix resetMatrix rotate rotateX rotateY rotateZ scale shearX shearY translate storeItem getItem clearStorage removeItem createStringDict createNumberDict append arrayCopy concat reverse shorten shuffle sort splice subset float int str byte char unchar hex unhex join match matchAll nf nfc nfp nfs split splitTokens trim deviceOrientation accelerationX accelerationY accelerationZ pAccelerationX pAccelerationY pAccelerationZ rotationX rotationY rotationZ pRotationX pRotationY pRotationZ turnAxis setMoveThreshold setShakeThreshold deviceMoved deviceTurned deviceShaken keyIsPressed key keyCode keyPressed keyReleased keyTyped keyIsDown movedX movedY mouseX mouseY pmouseX pmouseY winMouseX winMouseY pwinMouseX pwinMouseY mouseButton mouseWheel mouseIsPressed requestPointerLock exitPointerLock touches createImage saveCanvas saveFrames image tint noTint imageMode pixels blend copy filter THRESHOLD GRAY OPAQUE INVERT POSTERIZE BLUR ERODE DILATE get loadPixels set updatePixels loadImage loadJSON loadStrings loadTable loadXML loadBytes httpGet httpPost httpDo Output createWriter save saveJSON saveStrings saveTable day hour minute millis month second year abs ceil constrain dist exp floor lerp log mag map max min norm pow round sq sqrt fract createVector noise noiseDetail noiseSeed randomSeed random randomGaussian acos asin atan atan2 cos sin tan degrees radians angleMode textAlign textLeading textSize textStyle textWidth textAscent textDescent loadFont text textFont orbitControl debugMode noDebugMode ambientLight specularColor directionalLight pointLight lights lightFalloff spotLight noLights loadShader createShader shader resetShader normalMaterial texture textureMode textureWrap ambientMaterial emissiveMaterial specularMaterial shininess camera perspective ortho frustum createCamera setCamera ADD CENTER CORNER CORNERS POINTS WEBGL RGB ARGB HSB LINES CLOSE BACKSPACE DELETE ENTER RETURN TAB ESCAPE SHIFT CONTROL OPTION ALT UP_ARROW DOWN_ARROW LEFT_ARROW RIGHT_ARROW sampleRate freqToMidi midiToFreq soundFormats getAudioContext userStartAudio loadSound createConvolver setBPM saveSound getMasterVolume masterVolume soundOut chain drywet biquadFilter process freq res gain toggle setType pan phase triggerAttack triggerRelease setADSR attack decay sustain release dispose notes polyvalue AudioVoice noteADSR noteAttack noteRelease isLoaded playMode set isPlaying isPaused setVolume getPan rate duration currentTime jump channels frames getPeaks reverseBuffer onended setPath setBuffer processPeaks addCue removeCue clearCues getBlob getLevel toggleNormalize waveform analyze getEnergy getCentroid linAverages logAverages getOctaveBands fade attackTime attackLevel decayTime decayLevel releaseTime releaseLevel setRange setExp width output stream mediaStream currentSource enabled amplitude getSources setSource bands panner positionX positionY positionZ orient orientX orientY orientZ setFalloff maxDist rollof leftDelay rightDelay delayTime feedback convolverNode impulses addImpulse resetImpulse toggleImpulse sequence getBPM addPhrase removePhrase getPhrase replaceSequence onStep musicalTimeMode maxIterations synced bpm timeSignature interval iterations compressor knee ratio threshold reduction record isDetected update onPeak WaveShaperNode getAmount getOversample amp setInput connect disconnect play pause stop start add mult
*/
