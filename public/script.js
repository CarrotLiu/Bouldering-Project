let socket;
let canvas;
let mic, amplitude;
let level = 0;
let currentSpeak;

let intro;
let nicetry, sticktoolong, offyougo;
let notsure, askhelp, agreetohelp, hesitatehelp, findother, rejecthelp;
let findfriend, agreejoin, hesitatejoin, rejectjoin;
let icebreakintro, definerule, highfive, teamup, swaptip, mentor, footwork;
let success, takerest, wait, timerend;
let alright, brainburn;
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
const routeColor=["#007944", "#FFE31A", "#F35588", "#80C4E9"];
let detected = []; 

socket = io.connect();
let spkdata = {};
let scndata={};



function preload(){
  intro = loadSound('https://cdn.glitch.global/26e72b2d-5b19-4d34-8211-99b75e2441cc/intro.mp3?v=1737823113686');
  nicetry= loadSound("https://cdn.glitch.global/26e72b2d-5b19-4d34-8211-99b75e2441cc/nicetry.mp3?v=1737823549674"); 
  sticktoolong = loadSound("https://cdn.glitch.global/26e72b2d-5b19-4d34-8211-99b75e2441cc/dontsticktooneline.mp3?v=1737823541455"); 
  offyougo = loadSound("https://cdn.glitch.global/26e72b2d-5b19-4d34-8211-99b75e2441cc/offyougo.mp3?v=1737823551137");
  notsure = loadSound("https://cdn.glitch.global/26e72b2d-5b19-4d34-8211-99b75e2441cc/notsure.mp3?v=1737824198082");
  askhelp = loadSound("https://cdn.glitch.global/26e72b2d-5b19-4d34-8211-99b75e2441cc/askhelp.mp3?v=1737824201716"); 
  agreetohelp = loadSound("https://cdn.glitch.global/26e72b2d-5b19-4d34-8211-99b75e2441cc/agreetohelp.mp3?v=1737824210524"); 
  hesitatehelp = loadSound("https://cdn.glitch.global/26e72b2d-5b19-4d34-8211-99b75e2441cc/hesitatetohelp.mp3?v=1737824223299");
  findother = loadSound("https://cdn.glitch.global/26e72b2d-5b19-4d34-8211-99b75e2441cc/findother.mp3?v=1737824232384");
  rejecthelp = loadSound("https://cdn.glitch.global/26e72b2d-5b19-4d34-8211-99b75e2441cc/rejecthelping..mp3?v=1737824245623");
  findfriend = loadSound("https://cdn.glitch.global/26e72b2d-5b19-4d34-8211-99b75e2441cc/findcfriend.mp3?v=1737824265036"); 
  agreejoin = loadSound("https://cdn.glitch.global/26e72b2d-5b19-4d34-8211-99b75e2441cc/agreetojoin.mp3?v=1737824274306"); 
  hesitatejoin = loadSound("https://cdn.glitch.global/26e72b2d-5b19-4d34-8211-99b75e2441cc/hesitatetojoin.mp3?v=1737824286241"); 
  rejectjoin = loadSound("https://cdn.glitch.global/26e72b2d-5b19-4d34-8211-99b75e2441cc/rejectjoinchallenge.mp3?v=1737842864657");
  icebreakintro = loadSound("https://cdn.glitch.global/26e72b2d-5b19-4d34-8211-99b75e2441cc/icebreakintro.mp3?v=1737825002900");
  definerule = loadSound("https://cdn.glitch.global/26e72b2d-5b19-4d34-8211-99b75e2441cc/definerule.mp3?v=1737825011483"); 
  highfive = loadSound("https://cdn.glitch.global/26e72b2d-5b19-4d34-8211-99b75e2441cc/highfive.mp3?v=1737825022035");
  teamup = loadSound("https://cdn.glitch.global/26e72b2d-5b19-4d34-8211-99b75e2441cc/teamup.mp3?v=1737825033558");
  swaptip = loadSound("https://cdn.glitch.global/26e72b2d-5b19-4d34-8211-99b75e2441cc/swapingtips.mp3?v=1737825043206"); 
  mentor = loadSound("https://cdn.glitch.global/26e72b2d-5b19-4d34-8211-99b75e2441cc/yourementor.mp3?v=1737825053502"); 
  footwork = loadSound("https://cdn.glitch.global/26e72b2d-5b19-4d34-8211-99b75e2441cc/footwork.mp3?v=1737825061811");
  success = loadSound("https://cdn.glitch.global/26e72b2d-5b19-4d34-8211-99b75e2441cc/success.mp3?v=1737842818250"); 
  takerest = loadSound("https://cdn.glitch.global/26e72b2d-5b19-4d34-8211-99b75e2441cc/takerest.mp3?v=1737882991630");
  wait = loadSound("https://cdn.glitch.global/26e72b2d-5b19-4d34-8211-99b75e2441cc/wait.mp3?v=1737842827446"); 
  timerend = loadSound("https://cdn.glitch.global/26e72b2d-5b19-4d34-8211-99b75e2441cc/timerend.mp3?v=1737842847551");
  thief = loadSound("https://cdn.glitch.global/26e72b2d-5b19-4d34-8211-99b75e2441cc/thief.mp3?v=1737842836359");
  leavemealone = loadSound("https://cdn.glitch.global/26e72b2d-5b19-4d34-8211-99b75e2441cc/leavemealone.mp3?v=1737842856305");
  c1 = loadSound("https://cdn.glitch.global/26e72b2d-5b19-4d34-8211-99b75e2441cc/c1_3fingers.mp3?v=1737842873945");
  c2 = loadSound("https://cdn.glitch.global/26e72b2d-5b19-4d34-8211-99b75e2441cc/c2_lefthandonly.mp3?v=1737842882414");
  c3 = loadSound("https://cdn.glitch.global/26e72b2d-5b19-4d34-8211-99b75e2441cc/c3_righthandonly.mp3?v=1737842892163");
  c4 = loadSound("https://cdn.glitch.global/26e72b2d-5b19-4d34-8211-99b75e2441cc/c4_onehand.mp3?v=1737842901204");
  c5 = loadSound("https://cdn.glitch.global/26e72b2d-5b19-4d34-8211-99b75e2441cc/c5_withouthand.mp3?v=1737842910929");
  c6 = loadSound("https://cdn.glitch.global/26e72b2d-5b19-4d34-8211-99b75e2441cc/c6_withoutfeet.mp3?v=1737842932209");
  c7 = loadSound("https://cdn.glitch.global/26e72b2d-5b19-4d34-8211-99b75e2441cc/c7_bothhands.mp3?v=1737842934789");
  c8 = loadSound("https://cdn.glitch.global/26e72b2d-5b19-4d34-8211-99b75e2441cc/c8_skip3.mp3?v=1737842938580");
  c9 = loadSound("https://cdn.glitch.global/26e72b2d-5b19-4d34-8211-99b75e2441cc/c9_skip2.mp3?v=1737842946786");
  c10 = loadSound("https://cdn.glitch.global/26e72b2d-5b19-4d34-8211-99b75e2441cc/c10_skip1.mp3?v=1737842957541");
  c11 = loadSound("https://cdn.glitch.global/26e72b2d-5b19-4d34-8211-99b75e2441cc/c11_reverse.mp3?v=1737842966083");
  c12 = loadSound("https://cdn.glitch.global/26e72b2d-5b19-4d34-8211-99b75e2441cc/c12_starttop.mp3?v=1737842975346");
  c13 = loadSound("https://cdn.glitch.global/26e72b2d-5b19-4d34-8211-99b75e2441cc/c13_backfacewall.mp3?v=1737842982584");
  choosechallenge = loadSound("https://cdn.glitch.global/26e72b2d-5b19-4d34-8211-99b75e2441cc/choosechallenge.mp3?v=1737881822822");
  chooseroute = loadSound("https://cdn.glitch.global/26e72b2d-5b19-4d34-8211-99b75e2441cc/chooseroute.mp3?v=1737881830698");
  wanthug = loadSound("https://cdn.glitch.global/26e72b2d-5b19-4d34-8211-99b75e2441cc/wanthug.mp3?v=1737881778158");
  yay = loadSound("https://cdn.glitch.global/26e72b2d-5b19-4d34-8211-99b75e2441cc/yay.mp3?v=1737881785133");
  bye = loadSound("https://cdn.glitch.global/26e72b2d-5b19-4d34-8211-99b75e2441cc/bye.mp3?v=1737881865717");
  forgetstuff = loadSound("https://cdn.glitch.global/26e72b2d-5b19-4d34-8211-99b75e2441cc/forgetstuff.mp3?v=1737881903161");
  rude = loadSound("https://cdn.glitch.global/26e72b2d-5b19-4d34-8211-99b75e2441cc/rude.mp3?v=1737881808274");
  ruok = loadSound("https://cdn.glitch.global/26e72b2d-5b19-4d34-8211-99b75e2441cc/ruok.mp3?v=1737881850323");
  urgent = loadSound("https://cdn.glitch.global/26e72b2d-5b19-4d34-8211-99b75e2441cc/urgent.mp3?v=1737881854655");
  yournice = loadSound("https://cdn.glitch.global/26e72b2d-5b19-4d34-8211-99b75e2441cc/youarenice.mp3?v=1737881800612");
  alright = loadSound("https://cdn.glitch.global/26e72b2d-5b19-4d34-8211-99b75e2441cc/alright.mp3?v=1737881792221");
  brainburn = loadSound("https://cdn.glitch.global/26e72b2d-5b19-4d34-8211-99b75e2441cc/brainburn.mp3?v=1737881815592");
}

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
  }
})
let yournice_btn = document.querySelector("#yournice");
yournice_btn.addEventListener('click', ()=>{
  if(!isSpeaking){
  currentSpeak = yournice;
  currentSpeak.play();
  }
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
let success_btn = document.querySelector("#success");
success_btn.addEventListener('click', ()=>{
  if(!isSpeaking){
  currentSpeak = success;
  currentSpeak.play();
  }
})
let takerest_btn = document.querySelector("#takerest");
takerest_btn.addEventListener('click', ()=>{
  if(!isSpeaking){
  currentSpeak = takerest;
  currentSpeak.play();
  }
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
  if(!isSpeaking){
  currentSpeak = timerend;
  currentSpeak.play();
  }
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
})

let thief_btn = document.querySelector("#thief");
thief_btn.addEventListener('click', ()=>{
  if(!isSpeaking){
  currentSpeak = thief;
  currentSpeak.play();
  }
})
let leavemealone_btn = document.querySelector("#leavemealone");
leavemealone_btn.addEventListener('click', ()=>{
  if(!isSpeaking){
  currentSpeak = leavemealone;
  currentSpeak.play();
  }
})
let rude_btn = document.querySelector("#rude");
rude_btn.addEventListener('click', ()=>{
  if(!isSpeaking){
  currentSpeak = rude;
  currentSpeak.play();
  }
})

let urgent_btn = document.querySelector("#urgent");
urgent_btn.addEventListener('click', ()=>{
  if(!isSpeaking){
  currentSpeak = urgent;
  currentSpeak.play();
  }
})
let ruok_btn = document.querySelector("#ruok");
ruok_btn.addEventListener('click', ()=>{
  if(!isSpeaking){
  currentSpeak = ruok;
  currentSpeak.play();
  }
})
let choosechallenge_btn = document.querySelector("#choosechallenge");
choosechallenge_btn.addEventListener('click', ()=>{
  if(!isSpeaking){
  currentSpeak = choosechallenge;
  currentSpeak.play();
  }
})

let chooseroute_btn = document.querySelector("#chooseroute");
chooseroute_btn.addEventListener('click', ()=>{
  if(!isSpeaking){
  currentSpeak = chooseroute;
  currentSpeak.play();
  }
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
  stage = 1;
  sendSceneDt();
})

let stg2_btn = document.querySelector("#stage2");
stg2_btn.addEventListener('click', ()=>{
  stage = 2;
  sendSceneDt();
})

let stg3_btn = document.querySelector("#stage3");
stg3_btn.addEventListener('click', ()=>{
  stage = 3;
  sendSceneDt();
})

let stg4_btn = document.querySelector("#stage4");
stg3_btn.addEventListener('click', ()=>{
  stage = 4;
  sendSceneDt();
})

let stg5_btn = document.querySelector("#stage5");
stg3_btn.addEventListener('click', ()=>{
  stage = 5;
  sendSceneDt();
})

let stg6_btn = document.querySelector("#stage6");
stg3_btn.addEventListener('click', ()=>{
  stage = 6;
  sendSceneDt();
})

let stg7_btn = document.querySelector("#stage7");
stg3_btn.addEventListener('click', ()=>{
  stage = 7;
  sendSceneDt();
})

socket.on('speak', function (data){
  isSpeaking = spkdata.s;
})
socket.on('scene', function (data){
  
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
  mic = new p5.AudioIn();
}

function draw() {
  background(0);
  fill(255);
  noStroke();
  if(windowWidth > 1000){
    if(currentSpeak && currentSpeak.isPlaying()){
      isSpeaking = true;
    }else{
      isSpeaking = false;
    }
    
  }
  push();
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
  pop();
  if(stage == 0){
    if(isSpeaking){//normal stage
      focusing();
    }else{
      idling();
    }
  } else if(stage == 1){//random route
    randomizer();
  } else if(stage == 2){//challenge stage
    challenging();
  } else if(stage == 3){//rest timer
    scene = null;
    timer();
  }else if(stage == 4){//crying
    crying();
  }else if(stage == 5){//laughing
    laughing();
  }else if(stage == 6){//angry
    angry();
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
  strokeWeight(4);
  if(isSpeaking){
    
    if(level != 0){
      mouthOpenHeight = lerp(mouthOpenHeight, 35 - level * 110, 0.3); 
      mouthOpenWidth = lerp(mouthOpenWidth, 35 - level * 26, 0.3);
    }else{
      mouthOpenHeight = lerp(mouthOpenHeight, 35, 0.1); 
      mouthOpenWidth = lerp(mouthOpenWidth, 35, 0.1);
    }
    arc(width / 2 + eyeOffsetX * 0.35, height / 2 + 20 + eyeOffsetX * 0.05, mouthOpenWidth, mouthOpenHeight, 0, PI); 
    arc(width / 2 + eyeOffsetX * 0.35, height / 2 + 20 + eyeOffsetX * 0.05, mouthOpenWidth, 35 + level * 6, 0, PI); 
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
    // textSize(16);
    // text("The color code indicates the route's difficulty", 0, 35);
    // text("Challenges available for levels below the sky blue color", 0, 60);
    pop();
  }
  
}

function randomizer(){
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
    fill(255);
    text("5-", 130, 50);
    
    
    fill(challengeColor[4]);
    circle(-130, -150, 60);
    fill(255);
    text("5+", 130, 50);
    fill(challengeColor[5]);
    circle(-50, -20, 60);
    fill(255);
    text("6a", 130, 50);
    fill(challengeColor[6]);
    circle(-50, -20, 60);
    fill(0);
    text("6b", 130, 50);
    fill(challengeColor[7]);
    circle(-50, -20, 60);
    fill(255);
    text("7a", 130, 50);
    fill(challengeColor[8]);
    circle(-50, -20, 60);
    fill(255);
    text("7b", 130, 50);
    pop();
    push();
    translate(width / 2, height / 2 + 130);
    fill(255);
    textSize(25);
    text("Choose a Route Color Code", 0, -20);
    // textSize(16);
    // text("The color code indicates the route's difficulty", 0, 35);
    // text("Challenges available for levels below the sky blue color", 0, 60);
    pop();
  }
  
}

function crying(){
  push();
  eyeOffsetX = lerp(eyeOffsetX, 0, 0.05);
  eyeOffsetY = lerp(eyeOffsetY, 0, 0.05);
  pop();
}

function laughing(){
  push();
  eyeOffsetX = lerp(eyeOffsetX, 0, 0.05);
  eyeOffsetY = lerp(eyeOffsetY, 0, 0.05);
  pop();
}

function angry(){
  push();
  eyeOffsetX = lerp(eyeOffsetX, 0, 0.05);
  eyeOffsetY = lerp(eyeOffsetY, 0, 0.05);
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

  // Format the time display as XX:XX
  let timeString = nf(minutes, 2) + ":" + nf(seconds, 2);

  // Display the timer in the center of the screen
  text(timeString, width / 2, height / 2 - 150);
  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
function touchStarted() {
  
  let touchX = touches[0].x;
  let touchY = touches[0].y;
  let circles
  

  if(stage == 1){
    circles = [
      { x: width / 2 - 130, y: height / 2 - 130, sceneValue: 2 }, // Circle 1
      { x: width / 2 - 50, y: height / 2 - 180, sceneValue: 3 },  // Circle 2
      { x: width / 2 + 50, y: height / 2 - 180, sceneValue: 4 },  // Circle 3
      { x: width / 2 + 130, y: height / 2 - 130, sceneValue: 5 },  // Circle 4
      { x: width / 2 - 130, y: height / 2 + 130, sceneValue: 2 }, // Circle 1
      { x: width / 2 - 50, y: height / 2 + 180, sceneValue: 3 },  // Circle 2
      { x: width / 2 + 50, y: height / 2 + 180, sceneValue: 4 },  // Circle 3
      { x: width / 2 + 130, y: height / 2 + 130, sceneValue: 5 }  // Circle 4
    ];
    
  }else if(stage == 2){
    circles = [
      { x: width / 2 - 130, y: height / 2 - 130, sceneValue: 2 }, // Circle 1
      { x: width / 2 - 50, y: height / 2 - 180, sceneValue: 3 },  // Circle 2
      { x: width / 2 + 50, y: height / 2 - 180, sceneValue: 4 },  // Circle 3
      { x: width / 2 + 130, y: height / 2 - 130, sceneValue: 5 }  // Circle 4
    ];
    
  }
  for (let c of circles) {
      let d = dist(touchX, touchY, c.x, c.y);
      if (d < 30) { // If inside circle (radius = 30)
        scene = c.sceneValue;
        sendSceneDt();
        console.log("Scene changed to:", scene);
        return false; // Prevents default scrolling on iPhone
      }
    }
  
  return false;
}

function keyPressed() {
  if(key === '1'){
    scene = 0;
    sendSceneDt();
    
  }else if (key === '2') {
    scene = 1;
    sendSceneDt();
    // if(stage < 6){
    //   stage ++;
    // }else{
    //   stage = 0;
    // }
  }else if(key === '3'){
    scene = 2;
    sendSceneDt();
  }else if(key === '4'){
    scene = 3;
    sendSceneDt();
  }else if(key === '5'){
    scene = 4;
    sendSceneDt();
  }else if(key === '6'){
    scene = 5;
    sendSceneDt();
  }else if(key === '7'){
    scene = 6;
    sendSceneDt();
  }else if(key === '8'){
    scene = 7;
    sendSceneDt();
  }else if(key === '9'){
    scene = 8;
    sendSceneDt();
  }else if(key === '0'){
    scene = 9;
    sendSceneDt();
  }
}
/* global

io

p5 ml5 Stats dat alpha blue brightness color green hue lerpColor lightness red saturation background clear colorMode fill noFill noStroke stroke erase noErase 2D Primitives arc ellipse circle line point quad rect square triangle ellipseMode noSmooth rectMode smooth strokeCap strokeJoin strokeWeight bezier bezierDetail bezierPoint bezierTangent curve curveDetail curveTightness curvePoint curveTangent beginContour beginShape bezierVertex curveVertex endContour endShape quadraticVertex vertex plane box sphere cylinder cone ellipsoid torus loadModel model HALF_PI PI QUARTER_PI TAU TWO_PI DEGREES RADIANS print frameCount deltaTime focused cursor frameRate noCursor displayWidth displayHeight windowWidth windowHeight windowResized width height fullscreen pixelDensity displayDensity getURL getURLPath getURLParams remove disableFriendlyErrors noLoop loop isLooping push pop redraw select selectAll removeElements changed input createDiv createP createSpan createImg createA createSlider createButton createCheckbox createSelect createRadio createColorPicker createInput createFileInput createVideo createAudio VIDEO AUDIO createCapture createElement createCanvas resizeCanvas noCanvas createGraphics blendMode drawingContext setAttributes boolean string number applyMatrix resetMatrix rotate rotateX rotateY rotateZ scale shearX shearY translate storeItem getItem clearStorage removeItem createStringDict createNumberDict append arrayCopy concat reverse shorten shuffle sort splice subset float int str byte char unchar hex unhex join match matchAll nf nfc nfp nfs split splitTokens trim deviceOrientation accelerationX accelerationY accelerationZ pAccelerationX pAccelerationY pAccelerationZ rotationX rotationY rotationZ pRotationX pRotationY pRotationZ turnAxis setMoveThreshold setShakeThreshold deviceMoved deviceTurned deviceShaken keyIsPressed key keyCode keyPressed keyReleased keyTyped keyIsDown movedX movedY mouseX mouseY pmouseX pmouseY winMouseX winMouseY pwinMouseX pwinMouseY mouseButton mouseWheel mouseIsPressed requestPointerLock exitPointerLock touches createImage saveCanvas saveFrames image tint noTint imageMode pixels blend copy filter THRESHOLD GRAY OPAQUE INVERT POSTERIZE BLUR ERODE DILATE get loadPixels set updatePixels loadImage loadJSON loadStrings loadTable loadXML loadBytes httpGet httpPost httpDo Output createWriter save saveJSON saveStrings saveTable day hour minute millis month second year abs ceil constrain dist exp floor lerp log mag map max min norm pow round sq sqrt fract createVector noise noiseDetail noiseSeed randomSeed random randomGaussian acos asin atan atan2 cos sin tan degrees radians angleMode textAlign textLeading textSize textStyle textWidth textAscent textDescent loadFont text textFont orbitControl debugMode noDebugMode ambientLight specularColor directionalLight pointLight lights lightFalloff spotLight noLights loadShader createShader shader resetShader normalMaterial texture textureMode textureWrap ambientMaterial emissiveMaterial specularMaterial shininess camera perspective ortho frustum createCamera setCamera ADD CENTER CORNER CORNERS POINTS WEBGL RGB ARGB HSB LINES CLOSE BACKSPACE DELETE ENTER RETURN TAB ESCAPE SHIFT CONTROL OPTION ALT UP_ARROW DOWN_ARROW LEFT_ARROW RIGHT_ARROW sampleRate freqToMidi midiToFreq soundFormats getAudioContext userStartAudio loadSound createConvolver setBPM saveSound getMasterVolume masterVolume soundOut chain drywet biquadFilter process freq res gain toggle setType pan phase triggerAttack triggerRelease setADSR attack decay sustain release dispose notes polyvalue AudioVoice noteADSR noteAttack noteRelease isLoaded playMode set isPlaying isPaused setVolume getPan rate duration currentTime jump channels frames getPeaks reverseBuffer onended setPath setBuffer processPeaks addCue removeCue clearCues getBlob getLevel toggleNormalize waveform analyze getEnergy getCentroid linAverages logAverages getOctaveBands fade attackTime attackLevel decayTime decayLevel releaseTime releaseLevel setRange setExp width output stream mediaStream currentSource enabled amplitude getSources setSource bands panner positionX positionY positionZ orient orientX orientY orientZ setFalloff maxDist rollof leftDelay rightDelay delayTime feedback convolverNode impulses addImpulse resetImpulse toggleImpulse sequence getBPM addPhrase removePhrase getPhrase replaceSequence onStep musicalTimeMode maxIterations synced bpm timeSignature interval iterations compressor knee ratio threshold reduction record isDetected update onPeak WaveShaperNode getAmount getOversample amp setInput connect disconnect play pause stop start add mult
*/
// const challengeW = ["challenge", "climbing", "fun", "game", "interesting"];
// const routeW = ["random", "randomize", "route", "new", "which"];
// const restW = ["rest", "tired", "finish", "sent", "congrats"];
// const friendW = ["friend","buddy", "partner"];
// const photoW = ["photo", "camera", "picture"];
// const byeW = ["bye", "goodbye", "see you", "done with today", "home"];
// const helpW = ["help","stuck",""]
// const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
// const recognition = new SpeechRecognition();
// recognition.lang = "en-US";
// recognition.continuous = true;
// recognition.interimResults = false;
// const statusElement = document.getElementById("status");
// const matchedWords = document.getElementById("detectedWords");
// const startButton = document.getElementById("startButton");
// const stopButton = document.getElementById("stopButton");
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


// recognition.onresult = (event) => {
//   const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase();
//   console.log("Recognized:", transcript);

//   if(stage == 2){
//     if(transcript.includes("green") || transcript.includes("dark green") || transcript.includes("two")){
//       scene = 0;
//     }else if(transcript.includes("yellow") || transcript.includes("lemon") || transcript.includes("three")){
//       scene = 1;
//     }else if(transcript.includes("pink") || transcript.includes("four")){
//       scene = 2;
//     }else if(transcript.includes("blue") || transcript.includes("sky blue") || transcript.includes("five") || transcript.includes("five minus")){
//       scene = 3;
//     }
//   }else{
//     challengeW.forEach(word => {
//       if (transcript.includes(word) && !detected.includes(word)) {
//         detected.push(word);
//         currentSpeak = choosechallenge;
//         stage = 2;
//       }
//     });
//   }

//   routeW.forEach(word => {
//     if (transcript.includes(word) && !detected.includes(word)) {
//       detected.push(word);
//       currentSpeak = chooseroute;
//       stage = 3;
//     }
//   });
  
//   restW.forEach(word => {
//     if (transcript.includes(word) && !detected.includes(word)) {
//       detected.push(word);
//       currentSpeak = success;
//       totalTime = 180;
//       setInterval(() => {
//     if (totalTime > 0) {
//       totalTime--;
//     }
//   }, 1000); 
//       stage = 5;
//     }
//   });
  
//   friendW.forEach(word => {
//     if (transcript.includes(word) && !detected.includes(word)) {
//       detected.push(word);
//       stage = 3;
//     }
//   });
  
//   photoW.forEach(word => {
//     if (transcript.includes(word) && !detected.includes(word)) {
//       detected.push(word);
//       stage = 4;
//     }
//   });

//   console.log(detected);
// };

// recognition.onerror = (event) => {
//   console.error("Speech recognition error:", event.error);
// };

// recognition.onend = () => {
//   console.log("stop recording");
// };
// function startRecording(){
//   // detected = []; 
//   // console.log("Listening for speech...");
//   // recognition.start();
//   // isListening = true;
// }
// function stopRecording(){
//   // recognition.stop();
//   // console.log("Stopped listening.");
//   // isListening = false;
// }