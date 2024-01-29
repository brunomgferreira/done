import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import GlobalStyle from './theme/GlobalStyle'
import Theme from './theme/Theme'
import { ThemeProvider } from 'styled-components'

const TimerWorker = new Worker('/src/workers/timer-worker.js');

TimerWorker.onmessage = (event) => {
  if (event.data.countdownValue !== undefined) {
    const countdownValue = event.data.countdownValue;
    console.log(countdownValue);
  }
};

Notification.requestPermission(function (permission) {
  // If the user accepts, let's create a notification
  if (permission === "granted") {
    TimerWorker.postMessage({name:"notification"});
  }
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={Theme}>
      <GlobalStyle />
        <App />
    </ThemeProvider>
  </React.StrictMode>,
)

export { TimerWorker };

