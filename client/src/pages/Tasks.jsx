import React from 'react'
import Header from '../components/Header'
import styled from 'styled-components'
import DayButton from '../components/elements/TaskDayButton'
import Task from '../components/elements/Task'
import Button from '../components/elements/Button'
import { FiCheckCircle } from 'react-icons/fi'
import { IoStatsChart } from 'react-icons/io5'

const Tasks = () => {
  return (
    <div>
        <Header></Header>
        <SecondHeaderWrapper>
            <SecondHeader>
                <Date>16 OCT.</Date>
                <Navbar>
                    <DayButton $active={true} $content={'TODAY'}></DayButton>
                    <DayButton $active={false} $content={'MON'}></DayButton>
                    <DayButton $active={false} $content={'TUE'}></DayButton>
                    <DayButton $active={false} $content={'WED'}></DayButton>
                    <DayButton $active={false} $content={'THU'}></DayButton>
                    <DayButton $active={false} $content={'FRI'}></DayButton>
                    <DayButton $active={false} $content={'SAT'}></DayButton>
                    <DayButton $active={false} $content={'SUN'}></DayButton>
                </Navbar>
            </SecondHeader>
        </SecondHeaderWrapper>
        <MainWrapper>
            <LeftContainer>
                <Task $startingTime={"9:00"} $endingTime={"10:00"} $taskName={"Task Name"} $active={false}></Task>
                <Task $startingTime={"9:00"} $endingTime={"10:00"} $taskName={"Task Name"} $active={true}></Task>
                <Task $startingTime={"9:00"} $endingTime={"10:00"} $taskName={"Task Name"} $active={true}></Task>
            </LeftContainer>
            <RightContainer>
                <div>
                    <h1>Today tasks:</h1>
                </div>

                <NumTasksWrapper>
                    <NumTasksDone>0</NumTasksDone>
                    <NumTasks>/ 3 done.</NumTasks>
                </NumTasksWrapper>
                <Quote>You haven't done any tasks yet.</Quote> 
                {/* You haven't done any tasks yet.
                    Keep going, you're on the right track!
                    You're making good progress!
                    Congratulations! All tasks are done.*/}
                <ButtonContainer>
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
                </ButtonContainer>
            </RightContainer>
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

const RightContainer = styled.div`
    display: flex;
    flex-direction: column;
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
`

const ButtonContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 3rem 0rem 0rem 0rem;
    gap: 2rem;
`

export default Tasks