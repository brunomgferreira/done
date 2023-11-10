import React, { useEffect, useRef, useState } from 'react'
import styled, { css } from 'styled-components'
import PropTypes from 'prop-types'
import TimeSelect from '../elements/TimeSelect';

const TimePicker = ({placeholder, $minTime, $updateTime}) => {
    const [isOpen, setIsOpen] = useState(false);
    let [minHour, minMinute] = $minTime.split(":").map(Number);

    minMinute = Math.ceil(minMinute / 10) * 10;

    if(minMinute >= 60) {
        minHour++;
        minMinute = minMinute-60;
    }

    const [hourValue, setHourValue] = useState(minHour);
    const [minuteValue, setMinuteValue] = useState(minMinute);

    const timePickerRef = useRef(null);

    const updateHourValue = (newValue) => {
        setHourValue(parseInt(newValue));
        $updateTime(`${newValue}:${minuteValue}`);
    }

    const updateMinuteValue = (newValue) => {
        setMinuteValue(parseInt(newValue));
        $updateTime(`${hourValue}:${newValue}`);
    }

    useEffect(() => {
        if(hourValue < minHour) {
            setHourValue(minHour);
            setMinuteValue(minMinute);
        }
        else if (hourValue == minHour && minuteValue <= minMinute) {
            setMinuteValue(minMinute);
        }
    }, [hourValue, minuteValue, minHour, minMinute])

    useEffect(() => {
        const handleClickOutside = ({target}) => {
            if(timePickerRef.current && !timePickerRef.current.contains(target)) setIsOpen(false);
        };

        const handleClickInside = () => {
            timePickerRef.current && setIsOpen(true);
        };
        
        document.addEventListener('mousedown', handleClickOutside);
        timePickerRef.current && timePickerRef.current.addEventListener('mousedown', handleClickInside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            timePickerRef.current && timePickerRef.current.removeEventListener('mousedown', handleClickInside);
        }
    }, [isOpen])

    const numberToOption = (number) => {
        const padded = number.toString().padStart(2,"0");
        return <option value={number} key={padded}>{padded}</option>;
    }

    const hourOptions = Array(24).fill().map((_, i) => (i < 10 ? `0${i}` : `${i}`)).map(numberToOption);
    const minuteOptions = Array(6).fill().map((_, i) => (i * 10).toString().padStart(2, '0')).map(numberToOption);

    return (
        <TimePickerWrapper ref={timePickerRef}>
            <InputField type="text" value={`${hourValue.toString().padStart(2,"0")}:${minuteValue.toString().padStart(2,"0")}`} onChange={()=>{}} placeholder={placeholder} onFocus={() => setIsOpen(true)}/>
            {isOpen && (<TimePickerContainer>
                <TimeSelect min={minHour} $value={hourValue} $options={hourOptions} $onChange={(newValue) => updateHourValue(newValue)}/>
                <h4>:</h4>
                <TimeSelect min={hourValue > minHour ? 0 : minMinute} $value={minuteValue} $options={minuteOptions} $onChange={(newValue) => updateMinuteValue(newValue)}/>
            </TimePickerContainer>)}
        </TimePickerWrapper>
    )
}

TimePicker.propTypes = {
    placeholder: PropTypes.string, 
    $minTime: PropTypes.string,
    $updateTime: PropTypes.func
}

const TimePickerWrapper = styled.div`
    z-index: 100;
`

const InputField = styled.input`
    padding: 10px 10px;
    width: 100%;  
    transition: 0.2s;

    ${({ $err }) =>
        $err &&
        css`
        color:rgba(255, 0, 0, 0.474);
        `}

    &:focus {
    }
`

const TimePickerContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 2rem;
    position: fixed;
    background-color: white;
    padding: 2rem 2rem 2rem 2rem;
    border: 1px solid ${({theme}) => theme.colors.grey.main};
    border-radius: 1rem;
`

export default TimePicker