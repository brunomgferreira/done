import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import Button from './Button'
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io'
import { MdNotes, MdOutlineNotifications } from 'react-icons/md'
import { FiCheckCircle, FiCircle, FiEdit, FiShare2 } from 'react-icons/fi'
import { HiOutlineTrash } from 'react-icons/hi2'
import { IoTimeOutline } from 'react-icons/io5'
import { TbCategory, TbRepeat } from 'react-icons/tb'
import { HiOutlineLocationMarker } from 'react-icons/hi'

const Task = ({ $taskId,  $isExpanded,  $updateExpandedTask, $taskName, $date, $startingTime, $endingTime, $category, $location, $notification, $repeat, $notes}) => {
  const [isActive, setIsActive] = useState(true);

  const toggleExpand = () => {
    if($isExpanded) collapseTask();
    else updateTask();
  }

  const updateTask = () => {
    $updateExpandedTask($taskId);
  };

  const collapseTask = () => {
    $updateExpandedTask(null);
  }

  const toggleActive = () => {
    setIsActive(!isActive);
  };

  return (
    <TaskContainer>
      <Header $isExpanded={$isExpanded} $active={isActive}>
        <LeftSide $isExpanded={$isExpanded}>
          {!$isExpanded &&
          (<Button
            $content={isActive ? <FiCircle size={22} /> : <FiCheckCircle size={22} />}
            $buttonStyle="icon"
            $animation="scale"
            $onClick={() => toggleActive()}
          ></Button>)}
          <DayTimeContainer>
            {$isExpanded && <IoTimeOutline size={20}/>}
            <Day $isExpanded={$isExpanded}>{$date}</Day>
            <Time $isExpanded={$isExpanded}>{$startingTime} - {$endingTime}</Time>
          </DayTimeContainer>
          <h4>{$taskName}</h4>
        </LeftSide>
        <RightSide>
          <Button
            $content={$isExpanded ? <IoIosArrowUp size={26}/> : <IoIosArrowDown size={26}/>}
            $buttonStyle="icon"
            $animation="scale"
            $onClick={() => toggleExpand()}
          ></Button>
        </RightSide>
      </Header>
      <Main $isExpanded={$isExpanded}>
        {$category && 
        <InfoContainer $active={isActive}>
          <TbCategory size={20} />
          <Info>&nbsp;&nbsp;{$category}</Info>
        </InfoContainer>}
        {$location &&
        <InfoContainer $active={isActive}>
          <HiOutlineLocationMarker size={20} />
          <Info>&nbsp;&nbsp;{$location}</Info>
        </InfoContainer>}
        {$notification &&
        <InfoContainer $active={isActive}>
          <MdOutlineNotifications size={21}/>
          <Info>&nbsp;&nbsp;{$notification}</Info>
        </InfoContainer>}
        {$repeat &&
        <InfoContainer $active={isActive}>
          <TbRepeat size={20}/>
          <Info>&nbsp;&nbsp;{$repeat}</Info>
        </InfoContainer>}
        {$notes && 
        <InfoContainer $active={isActive}>
          <MdNotes size={20} />
          <Info>&nbsp;&nbsp;{$notes}</Info>
        </InfoContainer>}
        
        <ButtonContainer $active={isActive}>
          {isActive &&
            <>
              <Button 
                $content={<>Done<span>&nbsp;&nbsp;</span><FiCheckCircle size={20} /></>}
                $buttonStyle="text"
                $fontColor={"primary"}
                $fontWeight={"bold"}
                $animation="smallScale"
                $onClick={() =>{
                  toggleActive();
                  toggleExpand();}}
              ></Button>
              <Button
                $content={<>Edit<span>&nbsp;&nbsp;</span><FiEdit size={20} /></>}
                $buttonStyle="text"
                $fontColor={"primary"}
                $fontWeight={"bold"}
                $animation="scale"
              ></Button>
            </>
          }
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
  $taskId: PropTypes.string,
  $isExpanded:PropTypes.bool,  
  $updateExpandedTask: PropTypes.bool,
  $taskName: PropTypes.string,
  $category: PropTypes.string,
  $date: PropTypes.string,
  $startingTime: PropTypes.string,
  $endingTime: PropTypes.string,
  $location: PropTypes.string,
  $notification: PropTypes.string,
  $repeat: PropTypes.string,
  $notes: PropTypes.string,
}

const TaskContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;      
  padding: 2rem 2rem 2rem 2rem;
  border: 1px solid ${({theme}) => (theme.colors.grey.main)};
  border-radius: 3rem;
  box-shadow: 5px 5px 5px ${({theme}) => (theme.colors.shadow.main)};
  transition: 0.2s ease-in-out;
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

  ${({ $active }) =>
  !$active &&
  css`
      color: ${({theme}) => (theme.colors.grey.dark)};
      background-color: transparent;
      text-decoration: line-through;
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
    margin-top: -0.5rem;
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

  ${({ $active }) =>
  !$active &&
  css`
      color: ${({theme}) => (theme.colors.grey.dark)};
      background-color: transparent;
      text-decoration: line-through;
  `}
`

const Info = styled.p`
  width: 100%;
  text-align: start;
  word-wrap: break-word;
`

const ButtonContainer = styled.div`
  border-top: 1px solid ${({theme}) => (theme.colors.grey.main)};
  padding-top: 2rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 3rem;    
  /* padding: 0 2rem 0 2rem;  */
  width: 100%;

  ${({$active}) => 
    !$active && css`
      padding: 0 10rem 0 10rem; 
      padding-top: 2rem;
    `
  }
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
    margin-left: 1rem;
  `}
`

const Time = styled.p`
  border-radius: 1rem;

  ${({$isExpanded}) => 
  $isExpanded && css`
    margin-left: 2rem;
  `}
`

export default Task;