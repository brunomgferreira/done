import React from 'react'
import Header from '../components/Header'
import styled from 'styled-components'
import Task from '../components/elements/Task'
import Button from '../components/elements/Button'
import { FiCheckCircle } from 'react-icons/fi'
import { IoStatsChart } from 'react-icons/io5'
import TasksStatsContainer from '../components/elements/TasksStatsContainer'

const Tasks = () => {
  return (
    <div>
        <Header></Header>
        <SecondHeaderWrapper>
            <SecondHeader>
                <Date>16 OCT.</Date>
                <Navbar>
                    <Button 
                        $content="TODAY"
                        $buttonStyle="icon"
                        $fontColor={true ? "primary" : "black"}
                        $fontWeight={true ? "bold" : "normal"}
                        $animation="scale"
                    ></Button>
                    <Button 
                        $content="MON"
                        $buttonStyle="icon"
                        $fontColor={false ? "primary" : "black"}
                        $fontWeight={false ? "bold" : "normal"}
                        $animation="scale"
                    ></Button>
                    <Button 
                        $content="TUE"
                        $buttonStyle="icon"
                        $fontColor={false ? "primary" : "black"}
                        $fontWeight={false ? "bold" : "normal"}
                        $animation="scale"
                    ></Button>
                    <Button 
                        $content="WED"
                        $buttonStyle="icon"
                        $fontColor={false ? "primary" : "black"}
                        $fontWeight={false ? "bold" : "normal"}
                        $animation="scale"
                    ></Button>
                    <Button 
                        $content="THU"
                        $buttonStyle="icon"
                        $fontColor={false ? "primary" : "black"}
                        $fontWeight={false ? "bold" : "normal"}
                        $animation="scale"
                    ></Button>
                    <Button 
                        $content="FRI"
                        $buttonStyle="icon"
                        $fontColor={false ? "primary" : "black"}
                        $fontWeight={false ? "bold" : "normal"}
                        $animation="scale"
                    ></Button>
                    <Button 
                        $content="SAT"
                        $buttonStyle="icon"
                        $fontColor={false ? "primary" : "black"}
                        $fontWeight={false ? "bold" : "normal"}
                        $animation="scale"
                    ></Button>
                    <Button 
                        $content="SUN"
                        $buttonStyle="icon"
                        $fontColor={false ? "primary" : "black"}
                        $fontWeight={false ? "bold" : "normal"}
                        $animation="scale"
                    ></Button>
                </Navbar>
            </SecondHeader>
        </SecondHeaderWrapper>
        <MainWrapper>
            <LeftContainer>
                <Task $startingTime={"9:00"} $endingTime={"10:00"} $taskName={"Task Name"} $active={false}></Task>
                <Task $startingTime={"9:00"} $endingTime={"10:00"} $taskName={"Task Name"} $active={true}></Task>
                <Task $startingTime={"9:00"} $endingTime={"10:00"} $taskName={"Task Name"} $active={true}></Task>
            </LeftContainer>
            <TasksStatsContainer />
        </MainWrapper>
    </div>
  )
}

const SecondHeaderWrapper = styled.div`
    background-color: white;
    box-shadow: 10px 10px 10px rgba(0, 0, 0, 0.08);
`

const SecondHeader = styled.div`
  display: flex;
  align-items: center;
  max-width: ${({ theme }) => theme.widths.content};
  margin: 0 auto;
  padding: 2rem;
  gap: 8rem;
`

const Date = styled.h3`
    font-weight: bold;
`

const Navbar = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 4rem;
`

const MainWrapper = styled.main`
    max-width: ${({ theme }) => theme.widths.content};
    margin: 0 auto;
    display: flex;
    align-items: column;
    justify-content: center;
    margin-top: 4rem;
    gap: 4rem;
`

const LeftContainer = styled.div`
    display: flex;
    flex-direction: column;
    border-radius: 1rem;
    width: 100%;
    gap: 1rem;
    overflow: hidden;
    /* background-color: white;   */
    /* padding: 4rem 3rem; */
    /* box-shadow: 10px 10px 10px rgba(0, 0, 0, 0.03); */
`

export default Tasks