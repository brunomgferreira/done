let countdownValue = 0;
let initialCountdownValue = 0;
let isTimerActive = false;
let isTimerPaused = true;
let notificationMessage = "";

const updateCountdown = () => {
  if (!isTimerPaused) countdownValue--;

  self.postMessage({ countdownValue: countdownValue });

  if (countdownValue === 0) {
    // Show a notification
    new Notification("Countdown Finished", {
      body: notificationMessage,
      // icon: "path/to/icon.png", // change
    });

    // playNotificationSound(); // Play a sound
    countdownValue = initialCountdownValue;
    isTimerActive = false;
  } else {
    // Continue the countdown by scheduling the next update
    setTimeout(updateCountdown, 1000);
  }
};

// Function to play a notification sound
function playNotificationSound() {
  const audio = new Audio("../assets/notification-sound.mp3"); // not working idk why
  audio.play();
}

// Listen for messages from the main thread
self.onmessage = function (event) {
  // Start the countdown when a message is received
  if (event.data && event.data.startTimer) {
    if (!isTimerActive) {
      isTimerActive = true;
      isTimerPaused = false;
      updateCountdown();
    }
    isTimerPaused = false;
  }
  if (event.data && event.data.pauseTimer) {
    isTimerPaused = true;
  }
  if (event.data && event.data.countdownValue) {
    if (initialCountdownValue != event.data.countdownValue) {
      countdownValue = event.data.countdownValue;
      isTimerPaused = true;
      if (countdownValue == 25 * 60) notificationMessage = "Time for a break!";
      else notificationMessage = "The break is over! Time to focus!";
    }
    initialCountdownValue = event.data.countdownValue;
  }
};
