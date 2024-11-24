const source = new EventSource("/events");
var isDisinfectionOn = false; 
var isLightingOn = false; 

source.onmessage = (event) => {
  //   console.log(event.data);
};

// source.addEventListener("test", (event) => {
//   alert(`test message: ${event.data}`);
// });
source.addEventListener("time", (event) => {
  document.getElementById("time-display").textContent = `${event.data}`;
});
source.addEventListener("pause", (event) => {
  document.getElementById("time-display").textContent = `${event.data}`;
});

source.addEventListener("finish", (event) => {
  isDisinfectionOn = false;
  document.getElementById("time-display").textContent = `${event.data}`;
});

function toggleDisinfection() {
  var btn = document.getElementById("disinfectionBtn");
  if (isDisinfectionOn) {
    // btn.textContent = "Start Disinfection";
    fetch("/right"); 
  } else {
    // btn.textContent = "Stop Disinfection";
    fetch("/left"); 
  }
  isDisinfectionOn = !isDisinfectionOn; 
}

function toggleLighting() {
  var btn = document.getElementById("lightingBtn");
  if (isLightingOn) {

    fetch("/front"); 
  } else {

    fetch("/back"); 
  }
  isLightingOn = !isLightingOn; 
}
