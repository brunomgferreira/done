import React, { useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import { TimerWorker } from './../../main'

const CountDownTimer = ({ $timerCountdownValue, $isTimerActive }) => {

  const startTimer = () => {
    if(TimerWorker) TimerWorker.postMessage({ startTimer: true });
  };

  const pauseTimer = () => {
    if(TimerWorker) TimerWorker.postMessage({ pauseTimer: true });
  };

  const updateCountdownValue = (newCountdownValue) => {
    if(TimerWorker) TimerWorker.postMessage({ countdownValue: newCountdownValue });
  };

  const [minutes, setMinutes] = useState(Math.floor($timerCountdownValue/60));
  const [seconds, setSeconds] = useState($timerCountdownValue%60);

  TimerWorker.onmessage = (event) => {
    if (event.data.countdownValue !== undefined) {
      const countdownValue = event.data.countdownValue;
      setMinutes(Math.floor(countdownValue / 60));
      setSeconds(countdownValue % 60);
    }
  };

  useEffect(() => {
    const isPomodoroTimerActive = JSON.parse(sessionStorage.getItem("isPomodoroTimerActive"));
    if($isTimerActive || isPomodoroTimerActive) startTimer();
    else pauseTimer(); 
  }, [$isTimerActive])

  useEffect(() => {
    updateCountdownValue($timerCountdownValue);
    setMinutes(Math.floor($timerCountdownValue/60));
    setSeconds($timerCountdownValue%60);
  }, [$timerCountdownValue])

  return (
    <TimerWrapper>{minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}</TimerWrapper>
  )
}

CountDownTimer.propTypes = {
  $timerCountdownValue: PropTypes.number, 
  $isTimerActive: PropTypes.bool,
}

const TimerWrapper = styled.h1`
    font-size: 8rem;
    line-height: 7rem;
`

export default CountDownTimer