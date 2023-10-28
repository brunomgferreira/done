import React from 'react'
import Header from '../components/Header'
import styled from 'styled-components'
import DayButton from '../components/elements/TaskDayButton'
import Task from '../components/elements/Task'

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
            <Container>
                <Task $startingTime={"9:00"} $endingTime={"10:00"} $taskName={"Task Name"} $active={true}></Task>
                <Task $startingTime={"9:00"} $endingTime={"10:00"} $taskName={"Task Name"} $active={true}></Task>
                <Task $startingTime={"9:00"} $endingTime={"10:00"} $taskName={"Task Name"} $active={true}></Task>
            </Container>
            <Container>
                <Task $startingTime={"9:00"} $endingTime={"10:00"} $taskName={"Task Name"} $active={false}></Task>
            </Container>
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

const Container = styled.div`
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