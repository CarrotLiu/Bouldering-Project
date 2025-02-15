const source = new EventSource("/events");

source.onmessage = (event) => {
    console.log(event.data);
};

source.addEventListener("yes", (event) => {
  document.getElementById("user-choice").textContent = `${event.data}`;
});
source.addEventListener("no", (event) => {
  document.getElementById("user-choice").textContent = `${event.data}`;
});
source.addEventListener("neutral", (event) => {
  document.getElementById("user-choice").textContent = `${event.data}`;
});
// Map to track hold timers for each button
const holdTimers = {};

// Start hold event - sets an interval for the specific button
function startHold(event) {
  const buttonId = event.target.id;

  if (buttonId === "forward") {
    fetch("/front");
    document.getElementById("status").innerText = "Go forward";
  } else if (buttonId === "backward") {
    fetch("/back");
    document.getElementById("status").innerText = "Go backward";
  } else if (buttonId === "left") {
    fetch("/turnLeft");
    document.getElementById("status").innerText = "Turn left";
  } else if (buttonId === "right") {
    fetch("/turnRight");
    document.getElementById("status").innerText = "Turn right";
  }

  // Repeat fetch at intervals
  holdTimers[buttonId] = setInterval(() => {
    fetch(`/${buttonId}`);
  }, 100);
}

function endHold(event) {
  const buttonId = event.target.id;

  if (buttonId === "forward" || buttonId === "backward") {
    fetch("/stop");
    document.getElementById("status").innerText = "Stop";
  } else if (buttonId === "left" || buttonId === "right") {
    fetch("/goStraight");
    document.getElementById("status").innerText = "Straighten servo";
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


