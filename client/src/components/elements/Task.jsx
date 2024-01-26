import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import Button from './Button'
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io'
import { MdNotes, MdOutlineNotifications } from 'react-icons/md'
import { FiCheckCircle, FiCircle, FiEdit, FiShare2, FiXCircle } from 'react-icons/fi'
import { HiOutlineTrash } from 'react-icons/hi2'
import { IoTimeOutline, IoCalendarOutline } from 'react-icons/io5'
import { TbCategory, TbRepeat } from 'react-icons/tb'
import { HiOutlineLocationMarker } from 'react-icons/hi'
import SelectorWithAdd from '../addTaskModal/SelectorWithAdd'
import MultiSelector from '../addTaskModal/MultiSelector'
import axios from 'axios';

const Task = (
  { $fetchAllTasks, 
    $taskId,  
    $isExpanded,  
    $updateExpandedTask, 
    $taskName, 
    $date, 
    $startingTime, 
    $endingTime, 
    $category, 
    $location, 
    $notification, 
    $repeat, 
    $notes, 
    $isEditing, 
    $updateIsEditing, 
    $isActive, 
    $deleteTask, 
    $createCategory,
    $notificationOptions,
    $notificationDefaultOption,
    $repeatOptions,
    $repeatDefaultOption,
    $categoryOptions,
    $isOverdue }) => {
  const [isActive, setIsActive] = useState($isActive);
  const [isEditing, setIsEditing] = useState($isEditing);

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

  const toggleActive = async () => {
    try {
      const jwtToken = localStorage.getItem('token');
      if(!jwtToken) throw new Error;
      await axios.patch(`http://localhost:3000/api/v1/tasks/done/${$taskId}`,
      {}, { headers: {Authorization: `Bearer ${jwtToken}`},});
      setIsActive(false);
      $fetchAllTasks();
    } catch (error) {
      console.error("There was an error:", error.message);
    }
  };

  const toggleEditing = () => {
    setIsEditing(!isEditing);
    $updateIsEditing(!isEditing);
  }

  const [taskName, setTaskName] = useState($taskName);
  const [date, setDate] = useState($date);
  const [startingTime, setStartingTime] = useState($startingTime);
  const [endingTime, setEndingTime] = useState($endingTime);
  const [category, setCategory] = useState($categoryOptions.includes($category) ? $category : $categoryOptions[0]);
  const [location, setLocation] = useState($location);
  const [notification, setNotification] = useState($notification);
  const [repeat, setRepeat] = useState($repeat);
  const [notes, setNotes] = useState($notes);

  const updateTaskName = (newValue) => {
    setTaskName(newValue);
  }

  const updateDate = (newValue) => {
    setDate(newValue);
  }

  const updateStartingTime = (newValue) => {
    setStartingTime(newValue);
  }

  const updateEndingTime = (newValue) => {
    setEndingTime(newValue);
  }

  const updateCategory = (newValue) => {
    setCategory(newValue);
  }

  const updateLocation = (newValue) => {
    setLocation(newValue);
  }

  const updateNotification = (newValue) => {
    setNotification(newValue);
  }

  const updateRepeat = (newValue) => {
    setRepeat(newValue);
  }

  const updateNotes = (newValue) => {
    setNotes(newValue);
  }

  const editTask = async () => {
    try {
      const jwtToken = localStorage.getItem('token');
      if(!jwtToken) throw new Error;
      await axios.patch(`http://localhost:3000/api/v1/tasks/${$taskId}`, 
      { category: category.id, location, notification, repeat, notes },
      { headers: {Authorization: `Bearer ${jwtToken}`},});
      $fetchAllTasks();
    } catch (error) {
      console.error("There was an error:", error.message);
    }
  }

  useEffect(() => {
    setTaskName($taskName);
    setDate($date);
    setStartingTime($startingTime);
    setEndingTime($endingTime);
    setCategory($category);
    setLocation($location);
    setNotification($notification);
    updateRepeat($repeat);
    setNotes($notes);
    setIsEditing($isEditing);
  }, [$taskName, $date, $startingTime, $endingTime, $category, $location, $notification, $repeat, $notes, isEditing, $isExpanded]);
  
  return (
    <TaskContainer $isOverdue={$isOverdue}>
      <Header $isExpanded={$isExpanded} $isEditing={isEditing} $active={isActive}>
        <LeftSide>
          {!$isExpanded &&
          (<Button
            $content={isActive ? <FiCircle size={22} /> : <FiCheckCircle size={22} />}
            $buttonStyle="icon"
            $animation="scale"
            $onClick={() => toggleActive()}
          ></Button>)}
          {!$isExpanded && <Time>{$startingTime} - {$endingTime}</Time>}
          <h4>{$taskName}</h4>
        </LeftSide>
        <RightSide>
          {!isEditing &&
          <Button
            $content={$isExpanded ? <IoIosArrowUp size={26}/> : <IoIosArrowDown size={26}/>}
            $buttonStyle="icon"
            $animation="scale"
            $onClick={() => toggleExpand()}
          ></Button>}
        </RightSide>
      </Header>
      {$isExpanded &&
        <Main $isExpanded={$isExpanded}>
          <InfoContainer $active={isActive}>
            <IoCalendarOutline size={20}/>
            <Day $isExpanded={$isExpanded}>{$date}</Day>
          </InfoContainer>
          <InfoContainer $active={isActive}>
            <IoTimeOutline size={20}/>
            <Time>&nbsp;&nbsp;{startingTime} - {endingTime}</Time>
          </InfoContainer>
          {!isEditing &&
          <>
            {category && 
            <InfoContainer $active={isActive}>
              <TbCategory size={20} />
              <Info>&nbsp;&nbsp;{category.name}</Info>
            </InfoContainer>}
            {location &&
            <InfoContainer $active={isActive}>
              <HiOutlineLocationMarker size={20} />
              <Info>&nbsp;&nbsp;{location}</Info>
            </InfoContainer>}
            {notification &&
            <InfoContainer $active={isActive}>
              <MdOutlineNotifications size={21}/>
              <Info>&nbsp;&nbsp;{notification.map((option) => option.name).join(', ')}</Info>
            </InfoContainer>}
            {repeat &&
            <InfoContainer $active={isActive}>
              <TbRepeat size={20}/>
              <Info>&nbsp;&nbsp;
                {repeat.map((option) => option.name).join(', ')}
              </Info>
            </InfoContainer>}
            {notes && 
            <InfoContainer $active={isActive}>
              <MdNotes size={20} />
              <Info>&nbsp;&nbsp;{notes}</Info>
            </InfoContainer>}
          </>}
          {isEditing &&
          <>
            <InfoContainer $active={isActive} $isEditing={isEditing}>
              <TbCategory size={20} />
              <>&nbsp;&nbsp;</>
              <SelectorWithAdd $selectedOption={category} $options={$categoryOptions} $onAdd={$createCategory} $updateSelectedOption={(newValue) => updateCategory(newValue)}/>
            </InfoContainer>
            <InfoContainer $active={isActive} $isEditing={isEditing}>
              <HiOutlineLocationMarker size={20} />
              <>&nbsp;&nbsp;</>
              <InputField type="location" value={location ? location : ""} onChange={(e) => updateLocation(e.target.value)} placeholder='Location' />
            </InfoContainer>
            <InfoContainer $active={isActive} $isEditing={isEditing}>
              <MdOutlineNotifications size={21}/>
              <>&nbsp;&nbsp;</>
              <MultiSelector $defaultOption={$notificationDefaultOption} $options={$notificationOptions} $updateSelectedOptions={(newValue) => updateNotification(newValue)} $selectedOptions={notification}></MultiSelector>
            </InfoContainer>
            <InfoContainer $active={isActive} $isEditing={isEditing}>
              <TbRepeat size={20}/>
              <>&nbsp;&nbsp;</>
              <MultiSelector $defaultOption={$repeatDefaultOption} $options={$repeatOptions} $updateSelectedOptions={(newValue) => updateRepeat(newValue)} $selectedOptions={repeat}></MultiSelector>
            </InfoContainer>
            <InfoContainer $active={isActive} $isEditing={isEditing}>
              <MdNotes size={20} />
              <>&nbsp;&nbsp;</>
              <NotesInputField value={notes ? notes : ""} onChange={(e) => updateNotes(e.target.value)} placeholder='Notes' />
            </InfoContainer>
          </>}

          <ButtonContainer $active={isActive} $isEditing={isEditing}>
            {isActive && !isEditing &&
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
                  $onClick={() => toggleEditing()}
                ></Button>
              </>
            }
            {!isEditing &&
              <>
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
                  $onClick={() => $deleteTask($taskId)}
                ></Button> 
              </> 
            }
            {isEditing &&
              <>
                <Button
                  $content={<>Confirm<span>&nbsp;&nbsp;</span><FiCheckCircle size={20} /></>}
                  $buttonStyle="text"
                  $fontColor={"primary"}
                  $fontWeight={"bold"}
                  $animation="scale"
                  $onClick={() =>{
                    editTask();
                    toggleEditing();
                    toggleExpand();}}
                ></Button>
                <Button
                  $content={<>Cancel<span>&nbsp;&nbsp;</span><FiXCircle size={20} /></>}
                  $buttonStyle="text"
                  $fontColor={"primary"}
                  $fontWeight={"bold"}
                  $animation="scale"
                  $onClick={() =>{
                    toggleEditing();
                    toggleExpand();}}
                ></Button>
              </>
            }
          </ButtonContainer>
        </Main>
      }
    </TaskContainer>
  )
}

Task.propTypes = {
  $fetchAllTasks: PropTypes.func,
  $taskId: PropTypes.number,
  $isExpanded:PropTypes.bool,  
  $updateExpandedTask: PropTypes.func,
  $taskName: PropTypes.string,
  $category: PropTypes.object,
  $date: PropTypes.string,
  $startingTime: PropTypes.string,
  $endingTime: PropTypes.string,
  $location: PropTypes.string,
  $notification: PropTypes.array,
  $repeat: PropTypes.array,
  $notes: PropTypes.string,
  $isEditing: PropTypes.bool,
  $updateIsEditing: PropTypes.func,
  $deleteTask: PropTypes.func,
  $isActive: PropTypes.bool,
  $createCategory: PropTypes.func,
  $notificationOptions: PropTypes.array,
  $notificationDefaultOption: PropTypes.object,
  $repeatOptions: PropTypes.array,
  $repeatDefaultOption: PropTypes.object,
  $categoryOptions: PropTypes.array,
  $isOverdue: PropTypes.bool,
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
  background-color: white;
  ${({$isOverdue}) => (
    $isOverdue && css`
      border-color: ${({theme}) => (theme.colors.red)};
    `
  )}
`

const Header = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 3rem;     
  width: 100%;
  height: 2rem;

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

  ${({ $isEditing }) =>
  $isEditing &&
  css`
    padding-bottom: 10px;
    border-bottom: 1px solid ${({theme}) => theme.colors.grey.main};
  `}
  
`

const Info = styled.div`
  width: 100%;
  text-align: start;
  word-wrap: break-word;
`

const InputField = styled.input`
  width: 100%;  
  transition: 0.2s;
  background-color: transparent;

  ${({ $err }) =>
      $err &&
      css`
      color:rgba(255, 0, 0, 0.474);
      `}
`

const NotesInputField = styled.textarea`
  width: 100%;  
  transition: 0.2s;
  height: 10rem;
  resize: none;
  background-color: none;

  ${({ $err }) =>
      $err &&
      css`
      color:rgba(255, 0, 0, 0.474);
      `}
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

  ${({$active, $isEditing}) => 
    (!$active || $isEditing) && css`
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