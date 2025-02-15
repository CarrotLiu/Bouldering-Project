let socket;
let canvas;
let mic, amplitude;
let level = 0;
let currentSpeak;
let tearY1, tearY2;
let eyeBounce = 0;
let mouthFloat = 0;
let floatSpeed = 1.5;
let floatAmount = 5;
let tearSpeed = 2;
let time = 0;
let mouthWidth = 60;
let mouthHeight = 50;
let mouthSize = 200;
let cheekShake = 0;
let laughSpeed = 0.1;
let laughAmount = 3;
let Rindex = 0;
let Cindex = 0;
let intro;
let nicetry, sticktoolong, offyougo;
let notsure, askhelp, agreetohelp, hesitatehelp, findother, rejecthelp;
let findfriend, agreejoin, hesitatejoin, rejectjoin;
let icebreakintro, definerule, highfive, teamup, swaptip, mentor, footwork;
let success, takerest, wait, timerend;
let alright, brainburn;
let trythisroute, suggestchallenge;
let c1, c2, c3, c4, c5, c6, c7, c8, c9, c10, c11, c12, c13;
let thief, leavemealone, rude;
let wanthug, yay, yournice;
let urgent, ruok;
let choosechallenge, chooseroute;
let bye, forgetstuff;

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

let totalTime = 180;

let stage = 0;
let scene;

const challenges=[["Climb with left hand only", "Climb with right hand only", "Climb without hands", "Climb without feet", "Grab every boulder with both hands","Skip three holds of your choice."],["climb with one hand only", "skip two holds of your choice"],["skip one hold of your choice"],["climb while keeping your back towards the wall all the time"] ];
const challengeColor=["#007944", "#FFE31A", "#F35588", "#80C4E9", "#FF8000", "#C62300", "#3C3D37", "#8FD14F", "#024CAA", "#4F1787"];

let detected = []; 

socket = io.connect();
let spkdata = {};
let scndata={};



function preload(){
  intro = loadSound('./assets/intro.mp3');
  nicetry= loadSound("./assets/nicetry.mp3"); 
  sticktoolong = loadSound("./assets/dontsticktooneline.mp3"); 
  offyougo = loadSound("./assets/offyougo.mp3");
  notsure = loadSound("./assets/notsure.mp3");
  askhelp = loadSound("./assets/askhelp.mp3"); 
  agreetohelp = loadSound("./assets/agreetohelp.mp3"); 
  hesitatehelp = loadSound("./assets/hesitatetohelp.mp3");
  findother = loadSound("./assets/findother.mp3");
  rejecthelp = loadSound("./assets/rejecthelping.mp3");
  findfriend = loadSound("./assets/findcfriend.mp3"); 
  agreejoin = loadSound("./assets/agreetojoin.mp3"); 
  hesitatejoin = loadSound("./assets/hesitatetojoin.mp3"); 
  rejectjoin = loadSound("./assets/rejectjoinchallenge.mp3");
  icebreakintro = loadSound("./assets/icebreakintro.mp3");
  definerule = loadSound("./assets/definerule.mp3"); 
  highfive = loadSound("./assets/highfive.mp3");
  teamup = loadSound("./assets/teamup.mp3");
  swaptip = loadSound("./assets/swapingtips.mp3"); 
  mentor = loadSound("./assets/yourementor.mp3"); 
  footwork = loadSound("./assets/footwork.mp3");
  success = loadSound("./assets/success.mp3"); 
  takerest = loadSound("./assets/takerest.mp3");
  wait = loadSound("./assets/wait.mp3"); 
  timerend = loadSound("./assets/timerend.mp3");
  thief = loadSound("./assets/thief.mp3");
  leavemealone = loadSound("./assets/leavemealone.mp3");
  c1 = loadSound("./assets/c1_3fingers.mp3");
  c2 = loadSound("./assets/c2_lefthandonly.mp3");
  c3 = loadSound("./assets/c3_righthandonly.mp3");
  c4 = loadSound("./assets/c4_onehand.mp3");
  c5 = loadSound("./assets/c5_withouthand.mp3");
  c6 = loadSound("./assets/c6_withoutfeet.mp3");
  c7 = loadSound("./assets/c7_bothhands.mp3");
  c8 = loadSound("./assets/c8_skip3.mp3");
  c9 = loadSound("./assets/c9_skip2.mp3");
  c10 = loadSound("./assets/c10_skip1.mp3");
  c11 = loadSound("./assets/c11_reverse.mp3");
  c12 = loadSound("./assets/c12_starttop.mp3");
  c13 = loadSound("./assets/c13_backfacewall.mp3");
  choosechallenge = loadSound("./assets/choosechallenge.mp3");
  chooseroute = loadSound("./assets/chooseroute.mp3");
  wanthug = loadSound("./assets/wanthug.mp3");
  yay = loadSound("./assets/yay.mp3");
  bye = loadSound("./assets/bye.mp3");
  forgetstuff = loadSound("./assets/forgetstuff.mp3");
  rude = loadSound("./assets/rude.mp3");
  ruok = loadSound("./assets/ruok.mp3");
  urgent = loadSound("./assets/urgent.mp3");
  yournice = loadSound("./assets/youarenice.mp3");
  alright = loadSound("./assets/alright.mp3");
  brainburn = loadSound("./assets/brainburn.mp3");
  trythisroute = loadSound("./assets/trythisroute.mp3");
  suggestchallenge = loadSound("./assets/trysthfun.mp3");
}
let challengeSound=[c1, c2, c3,c4,c5,c6,c7,c8,c9,c10,c11,c12,c13];
let intro_btn = document.querySelector("#intro");
intro_btn.addEventListener('click', ()=>{
  if(!isSpeaking){
    currentSpeak = intro;
    currentSpeak.play();
  }
})

let nicetry_btn = document.querySelector("#nicetry");
nicetry_btn.addEventListener('click', ()=>{
  if(!isSpeaking){
    currentSpeak = nicetry;
    currentSpeak.play();
  }
  totalTime = 180;
  stage = 3;
  sendSceneDt();
setInterval(() => {
    if (totalTime > 0) {
      totalTime--;
    }else{
      
      stage = 0;
      currentSpeak = timerend;
      if(!finishTiming && !currentSpeak.isPlaying()){
        
        currentSpeak.play();
        finishTiming = true;
      }
      sendSceneDt();
    }
  }, 1000);
})

let sticktoolong_btn = document.querySelector("#sticktoolong");
sticktoolong_btn.addEventListener('click', ()=>{
  if(!isSpeaking){
    currentSpeak = sticktoolong;
    currentSpeak.play();
  }
})

let offyougo_btn = document.querySelector("#offyougo");;
offyougo_btn.addEventListener('click', ()=>{
  if(!isSpeaking){
    currentSpeak = offyougo;
    currentSpeak.play();
  }
})

let wanthug_btn = document.querySelector("#wanthug");
wanthug_btn.addEventListener('click', ()=>{
  if(!isSpeaking){
    currentSpeak = wanthug;
    currentSpeak.play();
  }
})

let yay_btn = document.querySelector("#yay");
yay_btn.addEventListener('click', ()=>{
  if(!isSpeaking){
  currentSpeak = yay;
  currentSpeak.play();
    stage = 5;
  sendSceneDt();
  }
})
let yournice_btn = document.querySelector("#yournice");
yournice_btn.addEventListener('click', ()=>{
  if(!isSpeaking){
  currentSpeak = yournice;
  currentSpeak.play();
    
  }
  stage = 5;
  sendSceneDt();
})

let notsure_btn = document.querySelector("#notsure");
notsure_btn.addEventListener('click', ()=>{
  if(!isSpeaking){
  currentSpeak = notsure;
  currentSpeak.play();
  }
})

let askhelp_btn = document.querySelector("#askhelp");
askhelp_btn.addEventListener('click', ()=>{
  if(!isSpeaking){
  currentSpeak = askhelp;
  currentSpeak.play();
  }
})
let agreetohelp_btn = document.querySelector("#agreetohelp");
agreetohelp_btn.addEventListener('click', ()=>{
  if(!isSpeaking){
  currentSpeak = agreetohelp;
  currentSpeak.play();
  }
})
let hesitatehelp_btn = document.querySelector("#hesitatehelp");
hesitatehelp_btn.addEventListener('click', ()=>{
  if(!isSpeaking){
  currentSpeak = hesitatehelp;
  currentSpeak.play();
  }
})
let findother_btn = document.querySelector("#findother");
findother_btn.addEventListener('click', ()=>{
  if(!isSpeaking){
  currentSpeak = findother;
  currentSpeak.play();
  }
})
let rejecthelp_btn = document.querySelector("#rejecthelp");
rejecthelp_btn.addEventListener('click', ()=>{
  if(!isSpeaking){
  currentSpeak = rejecthelp;
  currentSpeak.play();
  }
})
let findfriend_btn = document.querySelector("#findfriend");
findfriend_btn.addEventListener('click', ()=>{
  if(!isSpeaking){
  currentSpeak = findfriend;
  currentSpeak.play();
  }
})
let agreejoin_btn = document.querySelector("#agreejoin");
agreejoin_btn.addEventListener('click', ()=>{
  if(!isSpeaking){
  currentSpeak = agreejoin;
  currentSpeak.play();
  }
})
let hesitatejoin_btn = document.querySelector("#hesitatejoin");
hesitatejoin_btn.addEventListener('click', ()=>{
  if(!isSpeaking){
  currentSpeak = hesitatejoin;
  currentSpeak.play();
  }
})
let rejectjoin_btn = document.querySelector("#rejectjoin");
rejectjoin_btn.addEventListener('click', ()=>{
  if(!isSpeaking){
  currentSpeak = rejectjoin;
  currentSpeak.play();
  }
})

let icebreakintro_btn = document.querySelector("#icebreakintro"); 
icebreakintro_btn.addEventListener('click', ()=>{
  if(!isSpeaking){
  currentSpeak = icebreakintro;
  currentSpeak.play();
  }
})
let definerule_btn = document.querySelector("#definerule");
definerule_btn.addEventListener('click', ()=>{
  if(!isSpeaking){
  currentSpeak = definerule;
  currentSpeak.play();
  }
})
let highfive_btn = document.querySelector("#highfive");
highfive_btn.addEventListener('click', ()=>{
  if(!isSpeaking){
  currentSpeak = highfive;
  currentSpeak.play();
  }
})
let teamup_btn = document.querySelector("#teamup");
teamup_btn.addEventListener('click', ()=>{
  if(!isSpeaking){
  currentSpeak = teamup;
  currentSpeak.play();
  }
})
let swaptip_btn = document.querySelector("#swaptip"); 
swaptip_btn.addEventListener('click', ()=>{
  if(!isSpeaking){
  currentSpeak = swaptip;
  currentSpeak.play();
  }
})
let mentor_btn = document.querySelector("#mentor");
mentor_btn.addEventListener('click', ()=>{
  if(!isSpeaking){
  currentSpeak = mentor;
  currentSpeak.play();
  }
})
let footwork_btn = document.querySelector("#footwork");
footwork_btn.addEventListener('click', ()=>{
  if(!isSpeaking){
  currentSpeak = footwork;
  currentSpeak.play();
  }
})

let finishTiming = false;

let success_btn = document.querySelector("#success");
success_btn.addEventListener('click', ()=>{
  if(!isSpeaking){
    currentSpeak = success;
    currentSpeak.play();
  }
  totalTime = 180;
  stage = 3;
  sendSceneDt();
setInterval(() => {
    if (totalTime > 0) {
      totalTime--;
    }else{
      
      stage = 0;
      currentSpeak = timerend;
      if(!finishTiming && !currentSpeak.isPlaying()){
        
        currentSpeak.play();
        finishTiming = true;
      }
      sendSceneDt();
    }
  }, 1000);
  
})

let takerest_btn = document.querySelector("#takerest");
takerest_btn.addEventListener('click', ()=>{
  if(!isSpeaking){
  currentSpeak = takerest;
  currentSpeak.play();
  }
  totalTime = 180;
  stage = 3;
  sendSceneDt();
  setInterval(() => {
    if (totalTime > 0) {
      totalTime--;
    }else{
      stage = 0;
      currentSpeak = timerend;
      if(!finishTiming && !currentSpeak.isPlaying()){
      currentSpeak.play();
  }
      sendSceneDt();
    }
  }, 1000);
  
})



let wait_btn = document.querySelector("#wait");
wait_btn.addEventListener('click', ()=>{
  if(!isSpeaking){
  currentSpeak = wait;
  currentSpeak.play();
  }
})
let timerend_btn = document.querySelector("#timerend");
timerend_btn.addEventListener('click', ()=>{
  currentSpeak = timerend;
  if(!finishTiming && !currentSpeak.isPlaying()){
      currentSpeak.play();
  }
  stage = 0;
  sendSceneDt();
})

let alright_btn = document.querySelector("#alright");
alright_btn.addEventListener('click', ()=>{
  if(!isSpeaking){
  currentSpeak = alright;
  currentSpeak.play();
  }
})
let brainburn_btn = document.querySelector("#brainburn");
brainburn_btn.addEventListener('click', ()=>{
  if(!isSpeaking){
  currentSpeak = brainburn;
  currentSpeak.play();
  }
  stage = 4;
  sendSceneDt();
})

let thief_btn = document.querySelector("#thief");
thief_btn.addEventListener('click', ()=>{
  if(!isSpeaking){
  currentSpeak = thief;
  currentSpeak.play();
    stage = 6;
  sendSceneDt();
  }
})
let leavemealone_btn = document.querySelector("#leavemealone");
leavemealone_btn.addEventListener('click', ()=>{
  if(!isSpeaking){
  currentSpeak = leavemealone;
  currentSpeak.play();
    stage = 6;
  sendSceneDt();
  }
})
let rude_btn = document.querySelector("#rude");
rude_btn.addEventListener('click', ()=>{
  if(!isSpeaking){
  currentSpeak = rude;
  currentSpeak.play();
    stage = 6;
  sendSceneDt();
  }
})

let urgent_btn = document.querySelector("#urgent");
urgent_btn.addEventListener('click', ()=>{
  if(!isSpeaking){
  currentSpeak = urgent;
  currentSpeak.play();
    stage = 4;
  sendSceneDt();
  }
})
let ruok_btn = document.querySelector("#ruok");
ruok_btn.addEventListener('click', ()=>{
  if(!isSpeaking){
  currentSpeak = ruok;
  currentSpeak.play();
  }
})

let suggestchallenge_btn = document.querySelector("#suggestchallenge");
suggestchallenge_btn.addEventListener('click', ()=>{
  if(!isSpeaking){
  currentSpeak = suggestchallenge;
  currentSpeak.play();
  }
})
let choosechallenge_btn = document.querySelector("#choosechallenge");
choosechallenge_btn.addEventListener('click', ()=>{
  if(!isSpeaking){
  currentSpeak = choosechallenge;
  currentSpeak.play();
  }
  stage = 2;
  sendSceneDt();
})

let trythisroute_btn = document.querySelector("#gotothisroute");
trythisroute_btn.addEventListener('click', ()=>{
  if(!isSpeaking){
  currentSpeak = trythisroute;
  currentSpeak.play();
  }
})

let chooseroute_btn = document.querySelector("#chooseroute");
chooseroute_btn.addEventListener('click', ()=>{
  if(!isSpeaking){
  currentSpeak = chooseroute;
  currentSpeak.play();
  }
  stage = 1;
  sendSceneDt();
})

let bye_btn = document.querySelector("#bye");
bye_btn.addEventListener('click', ()=>{
  if(!isSpeaking){
  currentSpeak = bye;
  currentSpeak.play();
  }
})
let forgetstuff_btn = document.querySelector("#forgetstuff");
forgetstuff_btn.addEventListener('click', ()=>{
  if(!isSpeaking){
  currentSpeak = forgetstuff;
  currentSpeak.play();
  }
})

let stg1_btn = document.querySelector("#stage1");
stg1_btn.addEventListener('click', ()=>{
  stage = 0;
  sendSceneDt();
})

let stg2_btn = document.querySelector("#stage2");
stg2_btn.addEventListener('click', ()=>{
  stage = 1;
  sendSceneDt();
})

let stg3_btn = document.querySelector("#stage3");
stg3_btn.addEventListener('click', ()=>{
  stage = 2;
  sendSceneDt();
})

let stg4_btn = document.querySelector("#stage4");
stg4_btn.addEventListener('click', ()=>{
  totalTime = 180;
  stage = 3;
  sendSceneDt();
  setInterval(() => {
    if (totalTime > 0) {
      totalTime--;
    }else{
      stage = 0;
      if(!isSpeaking){
  currentSpeak = timerend;
  currentSpeak.play();
  }
      sendSceneDt();
    }
  }, 1000);
})

let stg5_btn = document.querySelector("#stage5");
stg5_btn.addEventListener('click', ()=>{
  stage = 4;
  sendSceneDt();
})

let stg6_btn = document.querySelector("#stage6");
stg6_btn.addEventListener('click', ()=>{
  stage = 5;
  sendSceneDt();
})

let stg7_btn = document.querySelector("#stage7");
stg7_btn.addEventListener('click', ()=>{
  stage = 6;
  sendSceneDt();
})

socket.on('speak', function (data){
  isSpeaking = data.s;
})
socket.on('scene', function (data){
  stage=data.stage;
  scene=data.scene;
  totalTime = data.totalTime;
  Rindex=data.rindex;
  Cindex=data.cindex;
  if(stage == 3){
    setInterval(() => {
    if (totalTime > 0) {
      totalTime--;
    }else{
      stage = 0;
      sendSceneDt();
    }
  }, 1000);
  }
  // console.log(scene, stage);
})


function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  console.log(windowWidth);
  canvas.parent("container-p5")
  canvas.position(0, 0);
  canvas.style("z-index", "-1");
  background(0);
  nextBlinkTime = millis() + random(2000, 5000);
  nextShiftTime = millis() + random(3000, 7000); 
  nextMouthChange = millis() + random(2000, 5000); 
  textFont("Titillium Web");
  amplitude = new p5.Amplitude();
  if(windowWidth > 1000 ){
  document.querySelector("#btns").style.visibility = "visible";
  }
  tearY1 = height / 2 - 10;
tearY2 = height / 2 - 10;
  mic = new p5.AudioIn();
  challengeSound=[c1, c2, c3,c4,c5,c6,c7,c8,c9,c10,c11,c12,c13];
}

function draw() {
  background(0);
  fill(255);
  noStroke();
  console.log(isSpeaking);
  if(windowWidth > 1000){
    if(currentSpeak && currentSpeak.isPlaying()){
      isSpeaking = true;
    }else{
      isSpeaking = false;
    }
    
  }

  if(isSpeaking){ //speaking
    if(windowWidth < 1000){
      mic.start(); 
      level = mic.getLevel(); 
    }else{
      amplitude.setInput(currentSpeak);
      level = amplitude.getLevel();
    }
    if(!spkdata.s){
      sendSpeakDt();
    }
  }else{ 
    if(spkdata.s){
      sendSpeakDt();
    }
    if(windowWidth < 1000){
      mic.stop(); 
      level = 0; 
    }
  }
  if(stage == 0){
    scene = null;
    Rindex = 0;
    if(isSpeaking){//normal stage
      focusing();
    }else{
      idling();
    }
  } else if(stage == 1){//random route
    randomizer();
    if(isSpeaking){//normal stage
      focusing();
    }else{
      idling();
    }
  } else if(stage == 2){//challenge stage
    challenging();
    if(isSpeaking){//normal stage
      focusing();
    }else{
      idling();
    }
  } else if(stage == 3){//rest timer
    scene = null;
    timer();
    if(isSpeaking){
      focusing();
    }else{
      idling();
    }
  }else if(stage == 4){//crying
    if(isSpeaking){
      crying();
    }else{
      stage = 0;
    }
    
  }else if(stage == 5){//laughing
    if(isSpeaking){
      
      laughing();
    }else{
      stage = 0;
    }
    
  }else if(stage == 6){//angry
    if(isSpeaking){
    angry();
    }else{
      stage = 0;
    }
  }
}

function sendSpeakDt(){
    spkdata.s = isSpeaking;
    spkdata.a = amplitude.getLevel();
    socket.emit("speak", spkdata);
}

function sendSceneDt(){
  scndata.stage = stage;
  scndata.scene = scene;
  scndata.totalTime = totalTime;
  scndata.rindex = Rindex;
  scndata.cindex = Cindex;
  socket.emit("scene", scndata);
  console.log(scndata);
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
  strokeWeight(5);
  if(isSpeaking){
    
    if(level != 0){
      mouthOpenHeight = lerp(mouthOpenHeight, 35 - level * 200, 0.3); 
      mouthOpenWidth = lerp(mouthOpenWidth, 35 - level * 100, 0.3);
    }else{
      mouthOpenHeight = lerp(mouthOpenHeight, 35, 0.1); 
      mouthOpenWidth = lerp(mouthOpenWidth, 35, 0.1);
    }
    arc(width / 2 + eyeOffsetX * 0.35, height / 2 + 20 + eyeOffsetX * 0.05, mouthOpenWidth, mouthOpenHeight, 0, PI); 
    arc(width / 2 + eyeOffsetX * 0.35, height / 2 + 20 + eyeOffsetX * 0.05, mouthOpenWidth, 35 + level * 8, 0, PI); 
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
    fill(challengeColor[scene]);
    textSize(25);
    text("Go To Route " + str(Rindex+1), 0, 0);
    
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
    // push();
    // translate(width / 2, height / 2 + 130);
    // fill(255);
    // textSize(25);
    // text("Choose a Route Color Code", 0, -20);
    // // textSize(16);
    // // text("The color code indicates the route's difficulty", 0, 35);
    // // text("Challenges available for levels below the sky blue color", 0, 60);
    // pop();
  }
  
}


function randomizer(){
  textAlign(CENTER, CENTER);
  if(scene != null){
    
    push();
    translate(width / 2, height / 2 -180);
    fill(challengeColor[scene]);
    textSize(25);
    text("Go To Route " + str(Rindex+1), 0, 0);
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
    fill(255);
    text("5-", 130, 50);
    
    
    fill(challengeColor[4]);
    circle(-130, 300, 60);
    fill(255);
    text("5+", -130, 300);
    fill(challengeColor[5]);
    circle(-45, 300, 60);
    fill(255);
    text("6a", -45, 300);
    fill(challengeColor[6]);
    circle(45, 300, 60);
    fill(255);
    text("6b", 45, 300);
    fill(challengeColor[7]);
    circle(130, 300, 60);
    fill(255);
    text("6c", 130, 300);
    fill(challengeColor[8]);
    circle(-85, 370, 60);
    fill(255);
    text("7a", -85, 370);
    fill(challengeColor[9]);
    circle(85, 370, 60);
    fill(255);
    text("7b", 85, 370);
    pop();
    // push();
    // translate(width / 2, height / 2 + 130);
    // fill(255);
    // textSize(25);
    // text("Choose a Route Color Code", 0, -20);
    // // textSize(16);
    // // text("The color code indicates the route's difficulty", 0, 35);
    // // text("Challenges available for levels below the sky blue color", 0, 60);
    // pop();
  }
  
}


function crying(){
  time += 0.1;

  // Floating face animation
  mouthFloat = sin(time * floatSpeed) * floatAmount; // Subtle up & down movement
  eyeBounce = sin(time) * 2; // Eyes move slightly up & down

  // Reset tears when they fall off
  tearY1 += tearSpeed;
  tearY2 += tearSpeed;
  if (tearY1 > height / 2 + 50){tearY1 = height / 2 - 10;} 
  if (tearY2 > height / 2 + 50) {tearY2 = height / 2 - 10;}

  push();
  stroke(255);
  strokeWeight(8);
  noFill();

  // Left Eye: "O"
  circle(width / 2 - 100, height / 2 - 10 + eyeBounce, 60);

  // Right Eye: "O"
  circle(width / 2 + 100, height / 2 - 10 + eyeBounce, 60);

  // Tears (Falling down)
  fill("#00BFFF"); // Light blue color for tears
  noStroke();
  ellipse(width / 2 - 120, 10 + tearY1, 20, 25); // Left tear
  ellipse(width / 2 + 120, 10 + tearY2, 20, 25); // Right tear

  // Big Crying Mouth "口"
  stroke(255);
  strokeWeight(6);
  noFill();
  
  let mouthY = height / 2 + 30 + mouthFloat; // Floating up/down effect

  // Upside-Down Triangle Mouth

  let mouthSize = 60; // Size of the triangle

  let curveAmount = 60; // How much the corners are rounded

  beginShape();
  vertex(width / 2, mouthY - curveAmount); // Top point slightly rounded
  vertex(width / 2 - mouthSize / 2 + curveAmount, mouthY + mouthSize - curveAmount); // Bottom left, curved inward
  vertex(width / 2 + mouthSize / 2 - curveAmount, mouthY + mouthSize - curveAmount); // Bottom right, curved inward
  endShape(CLOSE);

  pop();
}


function laughing(){
  time += laughSpeed; // Controls animation speed

  // Animate eye bounce and cheek shake
  eyeBounce = sin(time) * laughAmount; // Up-down movement
  cheekShake = cos(time) * laughAmount; // Side-to-side shake
  mouthFloat = sin(time) * floatAmount; // Up & down animation

  push();
  stroke(255);
  strokeWeight(8);
  noFill();
// translate(eyeOffsetX, eyeOffsetY);

  line(width / 2 - 110, height / 2 - 35 + eyeBounce, width / 2 - 60, height / 2 - 10 + eyeBounce);
  line(width / 2 - 60, height / 2 - 10 + eyeBounce, width / 2 - 110, height / 2 + 15 + eyeBounce);

  
  line(width / 2 + 110, height / 2 - 35 + eyeBounce, width / 2 + 60, height / 2 - 10 + eyeBounce);
  line(width / 2 + 60, height / 2 - 10 + eyeBounce, width / 2 + 110, height / 2 + 15 + eyeBounce);


  let mouthOpen = abs(sin(time * 2)) * 20 + 60;
  let mouthHeight = abs(sin(time * 2)) * 20 + 50;
let mouthY = height / 2 + 15 + mouthFloat; 
  let mouthX1 = width / 2 - mouthWidth / 2; 
  let mouthX2 = width / 2 + mouthWidth / 2;
  strokeWeight(6);
  line(mouthX1, mouthY, mouthX2, mouthY);
  arc(width / 2, mouthY, mouthWidth, mouthHeight, 0, PI);
  
  push();
  fill("#D84040");
  noStroke();
  circle(width / 2 - 150 + cheekShake, height / 2 + 35, 50);
  circle(width / 2 + 150 - cheekShake, height / 2 + 35, 50);
  pop();

  pop();
}

function angry(){
  time += 0.1;

  mouthFloat = sin(time * floatSpeed) * floatAmount; 
  eyeBounce = sin(time) * 2; 

  push();
  stroke(255);
  strokeWeight(8);
  noFill();

  line(width / 2 - 120, height / 2 - 60 + eyeBounce, width / 2 - 50, height / 2 - 10  + eyeBounce); // Left eyebrow
  line(width / 2 + 120, height / 2 - 60 + eyeBounce, width / 2 + 50, height / 2 - 10 + eyeBounce); // Right eyebrow

  // Left Eye
  circle(width / 2 - 100, height / 2 + eyeBounce, 60);  

  // Right Eye
  circle(width / 2 + 100, height / 2 + eyeBounce, 60);  


  fill(255);
  stroke(255);
  strokeWeight(8);
  let mouthY = height / 2 + mouthFloat; 
  let topWidth = 50; 
  let bottomWidth = 80; 
  let heightMouth = 60; 
  noFill();
  
  beginShape();
  vertex(width / 2 - topWidth / 2, mouthY); 
  vertex(width / 2 + topWidth / 2, mouthY); 
  vertex(width / 2 + bottomWidth / 2, mouthY + heightMouth); 
  vertex(width / 2 - bottomWidth / 2, mouthY + heightMouth); 
  endShape(CLOSE);

  pop();
}

function timer(){
  
  push();
  textAlign(CENTER, CENTER);
  textSize(60);
  fill(255);
  noStroke();
  let minutes = floor(totalTime / 60);
  let seconds = totalTime % 60;

  let timeString = nf(minutes, 2) + ":" + nf(seconds, 2);

  text(timeString, width / 2, height / 2 - 150);
  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
// function touchStarted() {
  
//   let touchX = touches[0].x;
//   let touchY = touches[0].y;
//   let circles
  

//   if(stage == 1){
//     circles = [
//       { x: width / 2 - 130, y: height / 2 - 130, sceneValue: 2 }, // Circle 1
//       { x: width / 2 - 50, y: height / 2 - 180, sceneValue: 3 },  // Circle 2
//       { x: width / 2 + 50, y: height / 2 - 180, sceneValue: 4 },  // Circle 3
//       { x: width / 2 + 130, y: height / 2 - 130, sceneValue: 5 },  // Circle 4
//       { x: width / 2 - 130, y: height / 2 + 130, sceneValue: 2 }, // Circle 1
//       { x: width / 2 - 50, y: height / 2 + 180, sceneValue: 3 },  // Circle 2
//       { x: width / 2 + 50, y: height / 2 + 180, sceneValue: 4 },  // Circle 3
//       { x: width / 2 + 130, y: height / 2 + 130, sceneValue: 5 }  // Circle 4
//     ];
    
//   }else if(stage == 2){
//     circles = [
//       { x: width / 2 - 130, y: height / 2 - 130, sceneValue: 2 }, // Circle 1
//       { x: width / 2 - 50, y: height / 2 - 180, sceneValue: 3 },  // Circle 2
//       { x: width / 2 + 50, y: height / 2 - 180, sceneValue: 4 },  // Circle 3
//       { x: width / 2 + 130, y: height / 2 - 130, sceneValue: 5 }  // Circle 4
//     ];
    
//   }
//   for (let c of circles) {
//       let d = dist(touchX, touchY, c.x, c.y);
//       if (d < 30) { // If inside circle (radius = 30)
//         scene = c.sceneValue;
//         sendSceneDt();
//         console.log("Scene changed to:", scene);
//         return false; // Prevents default scrolling on iPhone
//       }
//     }
  
//   return false;
// }
function mouseClicked(){
  if(scene){
    Rindex =int(random(0, 10));
    sendSceneDt();
  }
}
function keyPressed() {
  if(key === '1'){
    scene = 0;
    Rindex =int(random(0, 10));
    Cindex =int(random(0, 4));
    
    currentSpeak = challengeSound[Cindex];
    currentSpeak.play();
    
    sendSceneDt();
    
  }else if (key === '2') {
    scene = 1;
    Rindex =int(random(0, 10));
    Cindex =int(random(0, 4));
    console.log(Cindex,challengeSound[Cindex]);
      currentSpeak = challengeSound[Cindex];
      currentSpeak.play();
    
    sendSceneDt();
    // if(stage < 6){
    //   stage ++;
    // }else{
    //   stage = 0;
    // }
  }else if(key === '3'){
    scene = 2;
    Rindex =int(random(0, 10));
    Cindex =int(random(0, 4));
    
      currentSpeak = challengeSound[Cindex];
      currentSpeak.play();
    
    sendSceneDt();
  }else if(key === '4'){
    scene = 3;
    Rindex =int(random(0, 10));
    Cindex =int(random(0, 4));
    
      currentSpeak = challengeSound[Cindex];
      currentSpeak.play();
 
    sendSceneDt();
  }else if(key === '5'){
    scene = 4;
    Rindex =int(random(0, 10));
    sendSceneDt();
  }else if(key === '6'){
    scene = 5;
    Rindex =int(random(0, 10));
    sendSceneDt();
  }else if(key === '7'){
    scene = 6;
    Rindex =int(random(0, 10));
    sendSceneDt();
  }else if(key === '8'){
    scene = 7;
    Rindex =int(random(0, 10));
    sendSceneDt();
  }else if(key === '9'){
    scene = 8;
    Rindex =int(random(0, 10));
    
    sendSceneDt();
  }else if(key === '0'){
    scene = 9;
    Rindex =int(random(0, 10));
    sendSceneDt();
  }
}