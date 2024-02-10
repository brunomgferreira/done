import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import GlobalStyle from './theme/GlobalStyle'
import Theme from './theme/Theme'
import { ThemeProvider } from 'styled-components'
import axios from 'axios';

const TimerWorker = new Worker('/src/workers/timer-worker.js');

TimerWorker.onmessage = (event) => {
  if (event.data.countdownValue !== undefined) {
    const countdownValue = event.data.countdownValue;
    console.log(countdownValue);
  }
};

const requestNotificationPermission = async () => {
  try {
    const permission = await Notification.requestPermission();

    if (permission !== 'granted') {
      await removeNotificationSubscription();
      throw new Error("Notification permission not granted");
    }
    else {
      TimerWorker.postMessage({name:"notification"});
      await registerSW();
    }
  } catch (error) {
    console.log(error);
  }
  
}

const registerSW = async () => {
  try {
    if(!('serviceWorker' in navigator)) {
      throw new Error("No support for service worker!");
    }

    const jwtToken = localStorage.getItem('token');
    if(!jwtToken) throw new Error("There is no JWT authentication token");

    const registration = await navigator.serviceWorker.register('/src/workers/notifications-worker.js');
    
    if (registration.active) {
      registration.active.postMessage({ action: "saveSubscription", jwtToken: jwtToken });
    } else if (registration.installing) {
      // If there is no active service worker, check if there is an installing service worker
      registration.installing.postMessage({ action: "saveSubscription", jwtToken: jwtToken });
    } else {
      throw new Error("No active or installing service worker found");
    }

    return registration;
  } catch (error) {
    console.log(error); 
  }
};

const removeNotificationSubscription = async () => {
  try {
    const jwtToken = localStorage.getItem('token');
    if(!jwtToken) throw new Error;
    await axios.delete(`http://localhost:3000/api/v1/notifications/subscription/`, 
    { headers: {Authorization: `Bearer ${jwtToken}`}});
  } catch (error) {
    console.error("There was an error:", error.message);
  }
}


ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
    <ThemeProvider theme={Theme}>
      <GlobalStyle />
        <App $requestNotificationPermission={() => requestNotificationPermission()} />
    </ThemeProvider>
  // </React.StrictMode>,
)

export { TimerWorker };

