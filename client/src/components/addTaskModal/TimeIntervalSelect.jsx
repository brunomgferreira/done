import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { IoTimeOutline } from 'react-icons/io5';
import styled from 'styled-components';
import TimePicker from './TimePicker';

const TimeIntervalSelect = ({$updateStartingTime, $updateEndingTime}) => {
    const date = new Date();
    const minTime = `${date.getHours()}:${date.getMinutes()}`;
    const [startingTime, setStartingTime] = useState(minTime);
    const [endingTime, setEndingTime] = useState(minTime);

    const updateStartingTime = (newValue) => {
        setStartingTime(newValue);
        $updateStartingTime(newValue);

        const [endingTimeHours, endingTimeMinutes] = endingTime.split(':').map(Number);
        const [newValueHours, newValueMinutes] = newValue.split(':').map(Number);

        if((endingTimeHours * 60 + endingTimeMinutes) < (newValueHours * 60 + newValueMinutes))
            updateEndingTime(newValue);
    };

    const updateEndingTime = (newValue) => {
        setEndingTime(newValue);
        $updateEndingTime(newValue)
    };

     return (
        <TimeIntervalContainer>
            <InfoContainer> 
                <IoTimeOutline size={30}/>
                <TimePicker $minTime={minTime} $value={startingTime} $updateTime={(newValue) => updateStartingTime(newValue)} placeholder='Starting Time'/>
            </InfoContainer>
            <InfoContainer> 
                <IoTimeOutline size={30}/>
                <TimePicker $minTime={startingTime} $value={endingTime} $updateTime={(newValue) => updateEndingTime(newValue)} placeholder='Starting Time'/>
            </InfoContainer>
        </TimeIntervalContainer>
    )
}

TimeIntervalSelect.propTypes = {
    $updateStartingTime: PropTypes.func, 
    $updateEndingTime: PropTypes.func
}

const TimeIntervalContainer = styled.div`
    display: flex;
    flex-direction: row;
    gap:2rem;
`

const InfoContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: center;
  width: 100%;
  gap: 1rem;
  border-bottom: 1px solid ${({theme}) => theme.colors.grey.main};
  padding: 0.5rem 2rem 0.5rem 2rem;
`

export default TimeIntervalSelect