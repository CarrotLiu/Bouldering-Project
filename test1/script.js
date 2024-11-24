const source = new EventSource("/events");
// var isR = false; 
// var isL = false; 
// var isPressed = false;
// var pressTimer;

source.onmessage = (event) => {
  //   console.log(event.data);
};

// Map to track hold timers for each button
const holdTimers = {};

// Start hold event - sets an interval for the specific button
function startHold(event) {
  const button = event.target;

  const buttonId = button.id;
  if(buttonId == "forward"){
    document.getElementById("status").innerText = "go forward";
    // fetch("/front");
  } else if(buttonId == "backward"){
    document.getElementById("status").innerText = "go backward";
    // fetch("/back");
  } 
  if(buttonId == "left"){
    document.getElementById("status").innerText += "and left";
    // fetch("/turnLeft");
  } else if(buttonId == "right"){
    // fetch("/turnRight");
    document.getElementById("status").innerText += " and right";
  }

  
    // // Start an interval to continuously send the signal
    // holdTimers[buttonId] = setInterval(() => {
    //   if(buttonId == "forward"){
    //     document.getElementById("status").innerText = "go forward";
        
    //   } else if(buttonId == "backward"){
    //     document.getElementById("status").innerText = "go backward";
    //   } 
    //   if(buttonId == "left"){
    //     document.getElementById("status").innerText += "go left";
    //   } else if(buttonId == "right"){
    //     document.getElementById("status").innerText += "go right";
    //   }
    // }, 100); // Adjust interval as needed

}

// End hold event - clears the interval for the specific button
function endHold(event) {
  console.log("stop");
  const buttonId = event.target.id;
  if(buttonId == "forward" || buttonId == "backward"){
    // fetch("/stop");
    document.getElementById("status").innerText = "stop";
  }
  
  clearInterval(holdTimers[buttonId]);
  delete holdTimers[buttonId];
}

// Attach event listeners for both desktop and mobile on all buttons
document.addEventListener("DOMContentLoaded", () => {
document.querySelectorAll('.button').forEach(button => {
  console.log("Attaching listeners to", button);
  // Mobile events
  button.addEventListener('touchstart', startHold);
  button.addEventListener('touchend', endHold);

  // Desktop events
  button.addEventListener('mousedown', startHold);
  button.addEventListener('mouseup', endHold);

  // Optional: clear timer if touch is canceled
  button.addEventListener('touchcancel', endHold);
});
});


// source.addEventListener("time", (event) => {
//   document.getElementById("time-display").textContent = `${event.data}`;
// });
// source.addEventListener("pause", (event) => {
//   document.getElementById("time-display").textContent = `${event.data}`;
// });


