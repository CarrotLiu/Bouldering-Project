let socket;
let sd;
let blinkState = 0; 
let blinkProgress = 0; 
let nextBlinkTime = 0; 
let lastBlinkTime = 0; 

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
}

function draw() {
  background(0);
  fill(255);
  noStroke();

  let eyeWidth = 60;
  let eyeHeight = 60;

  // Handle blinking state
  if (millis() > nextBlinkTime) {
    lastBlinkTime = millis();
    nextBlinkTime = millis() + random(1000, 6000); // Next blink in 2 to 5 seconds
    blinkState = 1; // Start blinking
  }

  if (blinkState === 1) {
    blinkProgress += 0.1; // Adjust the speed of the transition here
    if (blinkProgress >= 1) {
      blinkState = 2; // Transition back to circle
    }
  } else if (blinkState === 2) {
    blinkProgress -= 0.1; // Adjust the speed of the transition here
    if (blinkProgress <= 0) {
      blinkState = 0; // Back to normal state
      blinkProgress = 0;
    }
  }

  // Adjust eye height during blink transition
  eyeHeight = lerp(60, 10, blinkProgress);

  // Draw the eyes
  ellipse(width / 2 - 100, height / 2, eyeWidth, eyeHeight);
  ellipse(width / 2 + 100, height / 2, eyeWidth, eyeHeight);
}
  
  //

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

/* global

io

p5 ml5 Stats dat alpha blue brightness color green hue lerpColor lightness red saturation background clear colorMode fill noFill noStroke stroke erase noErase 2D Primitives arc ellipse circle line point quad rect square triangle ellipseMode noSmooth rectMode smooth strokeCap strokeJoin strokeWeight bezier bezierDetail bezierPoint bezierTangent curve curveDetail curveTightness curvePoint curveTangent beginContour beginShape bezierVertex curveVertex endContour endShape quadraticVertex vertex plane box sphere cylinder cone ellipsoid torus loadModel model HALF_PI PI QUARTER_PI TAU TWO_PI DEGREES RADIANS print frameCount deltaTime focused cursor frameRate noCursor displayWidth displayHeight windowWidth windowHeight windowResized width height fullscreen pixelDensity displayDensity getURL getURLPath getURLParams remove disableFriendlyErrors noLoop loop isLooping push pop redraw select selectAll removeElements changed input createDiv createP createSpan createImg createA createSlider createButton createCheckbox createSelect createRadio createColorPicker createInput createFileInput createVideo createAudio VIDEO AUDIO createCapture createElement createCanvas resizeCanvas noCanvas createGraphics blendMode drawingContext setAttributes boolean string number applyMatrix resetMatrix rotate rotateX rotateY rotateZ scale shearX shearY translate storeItem getItem clearStorage removeItem createStringDict createNumberDict append arrayCopy concat reverse shorten shuffle sort splice subset float int str byte char unchar hex unhex join match matchAll nf nfc nfp nfs split splitTokens trim deviceOrientation accelerationX accelerationY accelerationZ pAccelerationX pAccelerationY pAccelerationZ rotationX rotationY rotationZ pRotationX pRotationY pRotationZ turnAxis setMoveThreshold setShakeThreshold deviceMoved deviceTurned deviceShaken keyIsPressed key keyCode keyPressed keyReleased keyTyped keyIsDown movedX movedY mouseX mouseY pmouseX pmouseY winMouseX winMouseY pwinMouseX pwinMouseY mouseButton mouseWheel mouseIsPressed requestPointerLock exitPointerLock touches createImage saveCanvas saveFrames image tint noTint imageMode pixels blend copy filter THRESHOLD GRAY OPAQUE INVERT POSTERIZE BLUR ERODE DILATE get loadPixels set updatePixels loadImage loadJSON loadStrings loadTable loadXML loadBytes httpGet httpPost httpDo Output createWriter save saveJSON saveStrings saveTable day hour minute millis month second year abs ceil constrain dist exp floor lerp log mag map max min norm pow round sq sqrt fract createVector noise noiseDetail noiseSeed randomSeed random randomGaussian acos asin atan atan2 cos sin tan degrees radians angleMode textAlign textLeading textSize textStyle textWidth textAscent textDescent loadFont text textFont orbitControl debugMode noDebugMode ambientLight specularColor directionalLight pointLight lights lightFalloff spotLight noLights loadShader createShader shader resetShader normalMaterial texture textureMode textureWrap ambientMaterial emissiveMaterial specularMaterial shininess camera perspective ortho frustum createCamera setCamera ADD CENTER CORNER CORNERS POINTS WEBGL RGB ARGB HSB LINES CLOSE BACKSPACE DELETE ENTER RETURN TAB ESCAPE SHIFT CONTROL OPTION ALT UP_ARROW DOWN_ARROW LEFT_ARROW RIGHT_ARROW sampleRate freqToMidi midiToFreq soundFormats getAudioContext userStartAudio loadSound createConvolver setBPM saveSound getMasterVolume masterVolume soundOut chain drywet biquadFilter process freq res gain toggle setType pan phase triggerAttack triggerRelease setADSR attack decay sustain release dispose notes polyvalue AudioVoice noteADSR noteAttack noteRelease isLoaded playMode set isPlaying isPaused setVolume getPan rate duration currentTime jump channels frames getPeaks reverseBuffer onended setPath setBuffer processPeaks addCue removeCue clearCues getBlob getLevel toggleNormalize waveform analyze getEnergy getCentroid linAverages logAverages getOctaveBands fade attackTime attackLevel decayTime decayLevel releaseTime releaseLevel setRange setExp width output stream mediaStream currentSource enabled amplitude getSources setSource bands panner positionX positionY positionZ orient orientX orientY orientZ setFalloff maxDist rollof leftDelay rightDelay delayTime feedback convolverNode impulses addImpulse resetImpulse toggleImpulse sequence getBPM addPhrase removePhrase getPhrase replaceSequence onStep musicalTimeMode maxIterations synced bpm timeSignature interval iterations compressor knee ratio threshold reduction record isDetected update onPeak WaveShaperNode getAmount getOversample amp setInput connect disconnect play pause stop start add mult
*/
