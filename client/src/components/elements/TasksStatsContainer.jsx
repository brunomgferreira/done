import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { FiCheckCircle, FiFilter, FiAlertTriangle, FiAlertCircle, FiList } from 'react-icons/fi'
import { FaListCheck } from "react-icons/fa6";
import { IoStatsChart, IoTimeOutline, IoList } from 'react-icons/io5'
import styled from 'styled-components'
import Button from './Button'
import CountDownTimer from './CountDownTimer';
import axios from 'axios';
import { StatusCodes } from 'http-status-codes'

const TasksStatsContainer = ({ $numberOfTasks, $numberOfDoneTasks, $numberOfOverdueTasks }) => {

    const [todayTasksQuote, setTodayTasksQuote] = useState("");

    const getTodayTasksQuote = (numberOfTasks, numberOfDoneTasks) => {
        if(numberOfTasks === 0 && numberOfDoneTasks === 0) {
            setTodayTasksQuote("You have no tasks today!");
            return;
        }
        if(numberOfDoneTasks === 0) {
            setTodayTasksQuote("You haven't done any tasks yet.");
            return;
        }
        if(numberOfTasks == numberOfDoneTasks) {
            setTodayTasksQuote("Congratulations! All tasks are done.");
            return;
        }
        const completionPercentage = (numberOfDoneTasks / numberOfTasks) * 100;
        if (completionPercentage > 50) {
            setTodayTasksQuote("You're making good progress!");
            return;
        }
        setTodayTasksQuote("Keep going, you're on the right track!");
    };
    
    useEffect(() => {
        getTodayTasksQuote($numberOfTasks, $numberOfDoneTasks);
    }, [$numberOfDoneTasks, $numberOfTasks]);



    const [overdueTasksQuote, setOverdueTasksQuote] = useState("");

    const getOverdueTasksQuote = (numberOfOverdueTasks) => {
        if(numberOfOverdueTasks === 0) {
            setOverdueTasksQuote("You have no overdue tasks!");
            return;
        }
        setOverdueTasksQuote("Don't be lazy! Finish your overdue tasks.");
    };

    useEffect(() => {
        getOverdueTasksQuote($numberOfOverdueTasks);
    }, [$numberOfOverdueTasks]);

    const [timerStatus, setTimerStatus] = useState();
    const [isTimerActive, setIsTimerActive] = useState();

    useEffect(() => {
        const pomodoroTimerStatus = sessionStorage.getItem("pomodoroTimerStatus");
        if(pomodoroTimerStatus) setTimerStatus(pomodoroTimerStatus);
        else {
            setTimerStatus("focus");
            sessionStorage.setItem("pomodoroTimerStatus", "focus");
        }

        const isPomodoroTimerActive = sessionStorage.getItem("isPomodoroTimerActive");
        if(isPomodoroTimerActive) setIsTimerActive(isPomodoroTimerActive);
        else {
            setIsTimerActive(false);
            sessionStorage.setItem("isPomodoroTimerActive", false);
        }
    }, [])

    const updateTimerStatus = (value) => {
        setTimerStatus(value);
        sessionStorage.setItem("pomodoroTimerStatus", value);
    }

    useEffect(() => {
        setIsTimerActive(false);
    }, [timerStatus])

    const [selectedTab, setSelectedTab] = useState("todayTasks");

return (
    <TasksStatsWrapper>
        <Navbar>
            <>
                {selectedTab === "todayTasks" && <h1>Today tasks:</h1>}
                {selectedTab === "overdueTasks" && <h1>Overdue tasks:</h1>}
                {selectedTab === "pomodoroTimer" && <h1>Pomodoro timer:</h1>}
            </>
            <ButtonContainer>
                <Button
                    $content={<IoList size={24}/>}
                    $buttonStyle="roundIcon"
                    $animation="scale"
                    $color={selectedTab === "todayTasks" ? "white" : "transparent"} //"white" "transparent"
                    $fontColor={selectedTab === "todayTasks" ? "primary" : "white"} //"primary" "white"
                    $borderColor="white"
                    $onClick={() => setSelectedTab("todayTasks")}
                ></Button>
                <Button
                    $content={<FiAlertTriangle size={24}/>}
                    $buttonStyle="roundIcon"
                    $animation="scale"
                    $color={selectedTab === "overdueTasks" ? "white" : "transparent"}
                    $fontColor={selectedTab === "overdueTasks" ? "primary" : "white"}
                    $borderColor="white"
                    $onClick={() => setSelectedTab("overdueTasks")}
                ></Button>
                <Button
                    $content={<IoTimeOutline size={25}/>}
                    $buttonStyle="roundIcon"
                    $animation="scale"
                    $color={selectedTab === "pomodoroTimer" ? "white" : "transparent"}
                    $fontColor={selectedTab === "pomodoroTimer" ? "primary" : "white"}
                    $borderColor="white"
                    $onClick={() => setSelectedTab("pomodoroTimer")}
                ></Button>
            </ButtonContainer>
        </Navbar>
        {selectedTab === "todayTasks" &&
        <>
            <InfoWrapper>
                <NumTasksDone>{$numberOfDoneTasks}</NumTasksDone>
                <NumTasks>/ {$numberOfTasks} done.</NumTasks>
            </InfoWrapper>
            <Quote>{todayTasksQuote}</Quote> 
        </>}
        {selectedTab === "overdueTasks" &&
        <>
            <InfoWrapper>
                <NumOverdueTasksDone>{$numberOfOverdueTasks}</NumOverdueTasksDone>
            </InfoWrapper>
            <Quote>{overdueTasksQuote}</Quote> 
        </>}
        {selectedTab === "pomodoroTimer" &&
        <>
            <TimerButtonWrapper>
                <Button
                    $content={"Pomodoro"}
                    $buttonStyle="text"
                    $animation="scale"
                    $color={"transparent"} //"white" "transparent"
                    $fontColor={timerStatus === "focus" ? "white" : "grey"} //"primary" "white"
                    $borderColor="white"
                    $onClick={() => updateTimerStatus("focus")}
                ></Button>
                <Button
                    $content={"Short Break"}
                    $buttonStyle="text"
                    $animation="scale"
                    $color={"transparent"} //"white" "transparent"
                    $fontColor={timerStatus === "shortBreak" ? "white" : "grey"} //"primary" "white"
                    $borderColor="white"
                    $onClick={() => updateTimerStatus("shortBreak")}
                ></Button>
                <Button
                    $content={"Long Break"}
                    $buttonStyle="text"
                    $animation="scale"
                    $color={"transparent"} //"white" "transparent"
                    $fontColor={timerStatus === "longBreak" ? "white" : "grey"} //"primary" "white"
                    $borderColor="white"
                    $onClick={() => updateTimerStatus("longBreak")}
                ></Button>
            </TimerButtonWrapper>
            <TimerWrapper>
                <CountDownTimer 
                    $timerCountdownValue={
                        (timerStatus === "focus") ? 25*60 :
                        (timerStatus === "shortBreak") ? 5*60 :
                        (timerStatus === "longBreak") ? 15*60 : 0
                    } 
                    $isTimerActive={isTimerActive} 
                />
            </TimerWrapper>
            <StartStopButtonWrapper>
                <Button
                    $content={!isTimerActive ? "Start" : "Pause"}
                    $buttonStyle="border"
                    $shape="round"
                    $animation="color"
                    $size={"mediumWide"}
                    $color="white" //"white" "transparent"
                    $fontColor="primary" //"primary" "white"
                    $borderColor="white"
                    $onClick={() => setIsTimerActive(!isTimerActive)}
                ></Button>
            </StartStopButtonWrapper>
            <TimerQuote>{timerStatus === "focus" ? "Time to focus!" : "Time for a break!"}</TimerQuote> 
        </>}
        
    </TasksStatsWrapper>
)}

TasksStatsContainer.propTypes = {
    $numberOfTasks: PropTypes.number, 
    $numberOfDoneTasks: PropTypes.number,
    $numberOfOverdueTasks: PropTypes.number,
}


const TasksStatsWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    border-radius: 1rem;
    width: 100%;
    gap: 1rem;
    overflow: hidden;
    padding: 3rem 3rem 3rem 3rem;
    border: 0px solid rgb(210, 210, 210);
    border-radius: 3rem;
    box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.03);
    background-color:  ${({theme}) => theme.colors.primary};
    color: white;
    height: 50rem;
    /* padding: 4rem 3rem; */
    /* box-shadow: 10px 10px 10px rgba(0, 0, 0, 0.03); */
`

const Navbar = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    gap: 4rem;
`

const ButtonContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    gap: 1rem;
`

const InfoWrapper = styled.div`
    display: flex;
    flex-direction: row;
    align-items: end;
    justify-content: center;
    padding: 3rem;
`

const TimerWrapper = styled.div`
    display: flex;
    flex-direction: row;
    align-items: end;
    justify-content: center;
`

const StartStopButtonWrapper = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    width: 100%;
`

const NumTasksDone = styled.h1`
    font-size: 10rem;
    line-height: 7rem;
`

const NumOverdueTasksDone = styled.h1`
    font-size: 10rem;
    line-height: 7rem;
`

const Timer = styled.h1`
    font-size: 8rem;
    line-height: 7rem;
`

const NumTasks = styled.h2`
    word-spacing: 0.5rem;
`
const Quote = styled.h4`
    text-align: center;
    margin-bottom: 6rem;
`

const TimerQuote = styled.h4`
    text-align: center;
    margin-bottom: 3rem;
`

const TimerButtonWrapper = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    gap: 2rem;
`

export default TasksStatsContainer