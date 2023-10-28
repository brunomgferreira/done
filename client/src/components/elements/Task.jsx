import React from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import TaskBtn from './TaskBtn'

const Task = ({ $startingTime, $endingTime, $taskName, $active}) => {
  return (
    <TaskContainer
    $startingTime={$startingTime}
    $endingTime={$endingTime}
    $taskName={$taskName}
    $active={$active}
    >
      <LeftSide>
        <Time $active={$active}>{$startingTime} - {$endingTime}</Time>
        <TaskName $active={$active}>{$taskName}</TaskName>
      </LeftSide>
      <RightSide>
        <TaskBtn $active={$active}></TaskBtn>
      </RightSide>
    </TaskContainer>
  )
}

Task.propTypes = {
  $startingTime: PropTypes.string,
  $endingTime: PropTypes.string,
  $taskName: PropTypes.string,
  $active: PropTypes.bool,
}

const TaskContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 3rem;      
  padding: 2rem 2rem 2rem 2rem;
  border: 1px solid rgb(210, 210, 210);
  border-radius: 1rem;
  box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.03);
`

const LeftSide = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 2rem;
`

const RightSide = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 2rem;
  margin-right: 1rem;
`

const Time = styled.p`
  background-color: #90ff943a;
  padding: 0.6rem 1rem 0.6rem 1rem;
  border-radius: 1rem;

  ${({ $active }) =>
  !$active &&
  css`
      color: #80808092;
      background-color: transparent;
      text-decoration: line-through;
  `}
`

const TaskName = styled.h4`
  ${({ $active }) =>
  !$active &&
  css`
    color: #80808092;
    text-decoration: line-through;
  `}
`

export default Task;