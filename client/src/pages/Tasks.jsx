import React, { useState } from 'react'
import Header from '../components/Header'
import styled from 'styled-components'
import Task from '../components/elements/Task'
import Button from '../components/elements/Button'
import TasksStatsContainer from '../components/elements/TasksStatsContainer'
import { FiCheckCircle, FiFilter, FiPlus } from 'react-icons/fi'
import { HiOutlineTrash } from 'react-icons/hi2'

const Tasks = () => {

const [expandedTask, setExpandedTask] = useState(null);   

const updateExpandedTask = (taskId) => {
    setExpandedTask(taskId);
}

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
                <ButtonWrapper>
                    <ButtonContainer>
                        <InputField type="text" placeholder='New Task' />
                        <Button
                            $content={<FiPlus size={20}/>}
                            $buttonStyle="roundIcon"
                            $animation="scale"
                            $color="primary"
                            $fontColor="white"
                        ></Button>
                    </ButtonContainer>
                    <ButtonContainer>
                        <Button
                            $content={<FiFilter size={20}/>}
                            $buttonStyle="roundIcon"
                            $animation="scale"
                            $color="transparent"
                            $fontColor="primary"
                        ></Button>
                        <Button
                            $content={<FiCheckCircle size={20}/>}
                            $buttonStyle="roundIcon"
                            $animation="scale"
                            $color="transparent"
                            $fontColor="primary"
                        ></Button>
                        <Button
                            $content={<HiOutlineTrash size={22}/>}
                            $buttonStyle="roundIcon"
                            $animation="scale"
                            $color="transparent"
                            $fontColor="primary"
                        ></Button>
                    </ButtonContainer>     
                </ButtonWrapper>
                <Task $taskId={1} $isExpanded={expandedTask === 1} $updateExpandedTask={updateExpandedTask} $date={"16/10/23"} $startingTime={"9:00"} $endingTime={"10:00"} $taskName={"Task Name"} $category={"My tasks"} $location={"My tasks"} $notification={"My tasks"} $repeat={"My tasks"} $notes={"My tasks"}></Task>
                <Task $taskId={2} $isExpanded={expandedTask === 2} $updateExpandedTask={updateExpandedTask} $date={"16/10/23"} $startingTime={"9:00"} $endingTime={"10:00"} $taskName={"Task Name"} $category={"My tasks"} $location={"My tasks"} $notification={"My tasks"} $repeat={"My tasks"} $notes={"My tasks"}></Task>
                <Task $taskId={3} $isExpanded={expandedTask === 3} $updateExpandedTask={updateExpandedTask} $date={"16/10/23"} $startingTime={"9:00"} $endingTime={"10:00"} $taskName={"Task Name"} $category={"My tasks"} $location={"My tasks"} $notification={"My tasks"} $repeat={"My tasks"} $notes={"My tasks"}></Task>
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

const ButtonWrapper = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding:  0.5rem 1rem 1rem 1rem;
`

const ButtonContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    gap: 1.5rem;
`

const InputField = styled.input`
    background-color: transparent;
    border: 2px solid transparent;
    border-bottom: 2px solid ${({theme}) => theme.colors.primary};
    border-radius: 0rem;
    padding-left: 2rem;
    width: 30rem;
    transition: 0.3s ease-in-out;
    transition: border-radius 0 ease-in-out;

    &:focus {
        border-radius: 5rem;
        border-color: ${({theme}) => theme.colors.primary};
    }
`

export default Tasks