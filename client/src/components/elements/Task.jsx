import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import Button from './Button'
import { IoIosArrowDown } from 'react-icons/io'
import { FiCheckCircle, FiCircle, FiEdit, FiShare2 } from 'react-icons/fi'
import { HiOutlineTrash } from 'react-icons/hi2'

const Task = ({ $startingTime, $endingTime, $taskName, $active}) => {

  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <TaskContainer
    $startingTime={$startingTime}
    $endingTime={$endingTime}
    $taskName={$taskName}
    $active={$active}
    >
      <Header $isExpanded = {isExpanded}>
        <LeftSide $isExpanded={isExpanded}>
          {!isExpanded &&
          (<Button
            $content={$active ? <FiCircle size={22} /> : <FiCheckCircle size={22} />}
            $buttonStyle="icon"
            $animation="scale"
          ></Button>)}
          <DayTimeContainer>
            <Day $isExpanded={isExpanded} $active={$active}>16/10/23</Day>
            <Time $isExpanded={isExpanded} $active={$active}>{$startingTime} - {$endingTime}</Time>
          </DayTimeContainer>
          <TaskName $active={$active}>{$taskName}</TaskName>
        </LeftSide>
        <RightSide>
          <Button
            $content={<><span>&nbsp;&nbsp;</span><IoIosArrowDown size={26}/></>}
            $buttonStyle="icon"
            $animation="scale"
            $onClick={() => toggleExpand()}
          ></Button>
        </RightSide>
      </Header>
      
      <Main $isExpanded={isExpanded}>
        <InfoContainer>
          <h4>Description:&nbsp;&nbsp;</h4>
          <Info>Task Name</Info>
        </InfoContainer>
        
        <ButtonContainer>
          <Button
            $content={<>Done<span>&nbsp;&nbsp;</span><FiCheckCircle size={20} /></>}
            $buttonStyle="text"
            $fontColor={"primary"}
            $fontWeight={"bold"}
            $animation="smallScale"
          ></Button>
          <Button
            $content={<>Edit<span>&nbsp;&nbsp;</span><FiEdit size={20} /></>}
            $buttonStyle="text"
            $fontColor={"primary"}
            $fontWeight={"bold"}
            $animation="scale"
          ></Button>
          <Button
            $content={<>Share<span>&nbsp;&nbsp;</span><FiShare2 size={20} /></>}
            $buttonStyle="text"
            $fontColor={"primary"}
            $fontWeight={"bold"}
            $animation="scale"
          ></Button>
          <Button
            $content={<>Delete<span>&nbsp;&nbsp;</span><HiOutlineTrash size={20} /></>}
            $buttonStyle="text"
            $fontColor={"primary"}
            $fontWeight={"bold"}
            $animation="scale"
          ></Button>
        </ButtonContainer>
      </Main>
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
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;      
  padding: 2rem 2rem 2rem 2rem;
  border: 1px solid rgb(210, 210, 210);
  border-radius: 3rem;
  box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.03);
  transition: 0.10s ease-in-out;
`

const Header = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 3rem;     
  width: 100%;

  ${({$isExpanded}) => 
  $isExpanded && css`
    align-items:start;
  `}
`

const Main = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  margin-top: -1rem;
  width: 100%;
  text-align: start;
  opacity: 0;
  height: 0;
  overflow: hidden;
  transition: 0.10s ease-in-out;

  ${({$isExpanded}) => 
  $isExpanded && css`
    margin-top: 1rem;
    padding-top: 1rem;
    opacity: 1;
    height: auto;
  `}
`

const InfoContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: center;
  width: 100%;
`

const Info = styled.p`
  width: 100%;
  text-align: start;
  word-wrap: break-word;
`

const ButtonContainer = styled.div`
  border-top: 1px solid rgb(210, 210, 210);
  padding-top: 2rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 3rem;    
  /* padding: 0 2rem 0 2rem;  */
  width: 100%;
`

const LeftSide = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 2rem;
  transition: 0.1s;

  ${({$isExpanded}) => 
  $isExpanded && css`
    flex-direction: column-reverse;
    align-items: start;
    gap:1rem;
    padding-top:0.5rem;
  `}

`

const RightSide = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 2rem;
  margin-right: 1rem;
`

const DayTimeContainer = styled.div`
  display: flex;
  align-items: center;
`

const Day = styled.p`
  display: none;
  letter-spacing: 1px;

  ${({$isExpanded}) => 
  $isExpanded && css`
    display: flex;
  `}
`

const Time = styled.p`
  /* background-color: #90ff943a;
  padding: 0.6rem 1rem 0.6rem 1rem; */
  border-radius: 1rem;

  ${({ $active }) =>
  !$active &&
  css`
      color: #80808092;
      background-color: transparent;
      text-decoration: line-through;
  `}

  ${({$isExpanded}) => 
  $isExpanded && css`
    margin-left: 3rem;
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