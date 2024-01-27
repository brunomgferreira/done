import React, { useEffect, useState } from 'react'
import { FiCheckCircle } from 'react-icons/fi'
import { IoStatsChart } from 'react-icons/io5'
import styled from 'styled-components'
import Button from './Button'
import axios from 'axios';
import { StatusCodes } from 'http-status-codes'

function TasksStatsContainer({ $numberOfTasks, $numberOfDoneTasks }) {

    const [quote, setQuote] = useState("");

    const getQuote = (numberOfTasks, numberOfDoneTasks) => {
        if(numberOfTasks === 0 && numberOfDoneTasks === 0) {
            setQuote("You have no tasks today!");
            return;
        }
        if(numberOfDoneTasks === 0) {
            setQuote("You haven't done any tasks yet.");
            return;
        }
        if(numberOfTasks == numberOfDoneTasks) {
            setQuote("Congratulations! All tasks are done.");
            return;
        }
        const completionPercentage = (numberOfDoneTasks / numberOfTasks) * 100;
        if (completionPercentage > 50) {
            setQuote("You're making good progress!");
            return;
        }
        setQuote("Keep going, you're on the right track!");
    }
    
    useEffect(() => {
        getQuote($numberOfTasks, $numberOfDoneTasks);
    }, [$numberOfDoneTasks, $numberOfTasks])
    

return (
    <TasksStatsWrapper>
        <div>
            <h1>Today tasks:</h1>
        </div>

        <NumTasksWrapper>
            <NumTasksDone>{$numberOfDoneTasks}</NumTasksDone>
            <NumTasks>/ {$numberOfTasks} done.</NumTasks>
        </NumTasksWrapper>
        <Quote>{quote}</Quote> 
        {/* You haven't done any tasks yet.
            Keep going, you're on the right track!
            You're making good progress!
            Congratulations! All tasks are done.*/}
        {/* <ButtonContainer>
            <Button 
                $content=
                {
                    <>
                        Today Statistics<span>&nbsp;&nbsp;</span><IoStatsChart size={20} />
                    </>
                }
                $size="wide"
                $shape="round"
                $color="white"
                $fontColor="primary"
                $animation="smallScale"
            ></Button>
            <Button
                $content=
                {
                    <>
                        Completed Tasks<span>&nbsp;&nbsp;</span><FiCheckCircle size={20} />
                    </>
                }
                $size="wide"
                $shape="round"
                $color="white"
                $fontColor="primary"
                $animation="smallScale"
            ></Button>
        </ButtonContainer> */}
    </TasksStatsWrapper>
)}


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

const NumTasksWrapper = styled.div`
    display: flex;
    flex-direction: row;
    align-items: end;
    justify-content: center;
    padding: 3rem;
`

const NumTasksDone = styled.h1`
    font-size: 10rem;
    line-height: 7rem;
`

const NumTasks = styled.h2`
    word-spacing: 0.5rem;
`
const Quote = styled.h4`
    text-align: center;
    margin-bottom: 6rem;
`

const ButtonContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 3rem 0rem 0rem 0rem;
    gap: 2rem;
`

export default TasksStatsContainer