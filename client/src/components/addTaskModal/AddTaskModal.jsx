import React, { createContext, useState } from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components';
import Button from '../elements/Button';
import { FiCheckCircle} from 'react-icons/fi';
import { TbCategory, TbRepeat } from 'react-icons/tb';
import { MdNotes, MdOutlineNotifications } from 'react-icons/md';
import { HiOutlineLocationMarker } from 'react-icons/hi';
import { IoCalendarOutline } from 'react-icons/io5';
import { IoMdCheckmark, IoMdClose } from 'react-icons/io';
import TimeIntervalSelect from './TimeIntervalSelect';
import MultiSelector from './MultiSelector';
import SelectorWithAdd from './SelectorWithAdd';

const AddTaskContext = createContext();

const AddTaskModal = ({ $isOpen}) => {
    const [name, setName] = useState("");
    const [category, setCategory] = useState("");
    const [location, setLocation] = useState("");
    const [notification, setNotification] = useState([]);
    const [repeat, setRepeat] = useState(["No Repeat"]);
    const [notes, setNotes] = useState("");
    const [date , setDate] = useState(new Date().toISOString().split("T")[0]);
    const [startingTime, setStartingTime] = useState(`${new Date().getHours()}:${new Date().getMinutes()}`);
    const [endingTime, setEndingTime] = useState(`${new Date().getHours()}:${new Date().getMinutes()}`);

    const notificationOptions = ['On time','10 Minutes Before','1 Hour Before','1 Day Before'];
    const notificationDefaultOption = 'No Notifications';
    const repeatOptions = ['Every Day', 'Every Week', 'Every Month', 'Every Year'];
    const repeatDefaultOption = 'No Repeat';
    const categoryOptions = [{name: 'Every Day', color: '#000000'}, {name: 'Every Week', color: '#FFFFFF'}, {name: 'Every Month', color: '#AABBFF'}];
    const categoryDefaultOption = {name: 'No Repeat', color: '#000000'};

    const updateName = (newValue) => {
        setName(newValue);
    };

    const updateCategory = (newValue) => {
        setCategory(newValue);
    };
      
    const updateLocation = (newValue) => {
        setLocation(newValue);
    };
    
    const updateNotification = (newValue) => {
        setNotification(newValue);
    };
    
    const updateRepeat = (newValue) => {
        setRepeat(newValue);
    };
    
    const updateNotes = (newValue) => {
        setNotes(newValue);
    };
      
    const updateDate = (newValue) => {
        setDate(newValue);
    };

    const updateStartingTime = (newValue) => {
        setStartingTime(newValue);
    };

    const updateEndingTime = (newValue) => {
        setEndingTime(newValue);
    };

    const addNewCategory = (name, color) => {
        console.log({name: name, color: color});
    }

    return (
        $isOpen && (
        <AddTaskContext.Provider
            value={{name, updateName,
                category, updateCategory,
                location, updateLocation,
                notification, updateNotification,
                repeat, updateRepeat,
                notes, updateNotes,
                date, updateDate,
                startingTime, updateStartingTime,
                endingTime, updateEndingTime}}>
            <ModalWrapper>
                <ModalContainer>
                    <Main>
                        <InfoContainer>
                            <FiCheckCircle size={18} />
                            <InputField value={name} onChange={(e) => updateName(e.target.value)} placeholder='Task Name' />
                        </InfoContainer>
                        <InfoContainer>
                            <IoCalendarOutline size={20}/>
                            <DateInputField type="date" min={new Date().toISOString().split("T")[0]} onChange={(e) => updateDate(e.target.value)} placeholder='Date' />
                        </InfoContainer>
                        <TimeIntervalSelect $updateStartingTime={(newValue) => updateStartingTime(newValue)} $updateEndingTime={(newValue) => updateEndingTime(newValue)} />
                        <InfoContainer>
                            <TbCategory size={20} />
                            <SelectorWithAdd $defaultOption={categoryDefaultOption} $options={categoryOptions} $onAdd={addNewCategory}/>
                            {/* <InputField value={category} onChange={(e) => updateCategory(e.target.value)} placeholder='Category' /> */}
                        </InfoContainer>
                        <InfoContainer>
                            <HiOutlineLocationMarker size={20} />
                            <InputField type="location" value={location} onChange={(e) => updateLocation(e.target.value)} placeholder='Location' />
                        </InfoContainer>
                        <InfoContainer>
                            <MdOutlineNotifications size={21}/>
                            <MultiSelector $defaultOption={notificationDefaultOption} $options={notificationOptions}></MultiSelector>
                        </InfoContainer>
                        <InfoContainer>
                            <TbRepeat size={20}/>
                            <MultiSelector $defaultOption={repeatDefaultOption} $options={repeatOptions}></MultiSelector>
                        </InfoContainer>
                        <InfoContainer>
                            <MdNotes size={20} />
                            <InputField value={notes} onChange={(e) => updateNotes(e.target.value)} placeholder='Notes' />
                        </InfoContainer>
            
                        <ButtonContainer>
                            <Button 
                                $content={<>Create Task&nbsp;<IoMdCheckmark size={24}/></>}
                                $buttonStyle="roundText"
                                $color="transparent"
                                $fontColor="primary"
                                $borderColor="primary"
                                $fontWeight="bold"
                                $animation="smallScale"
                            ></Button>
                            <Button
                                $content={<>Cancel&nbsp;<IoMdClose size={24}/></>}
                                $buttonStyle="roundText"
                                $color="transparent"
                                $fontColor="red"
                                $borderColor="red"
                                $fontWeight="bold"
                                $animation="scale"
                            ></Button>
                        </ButtonContainer>
                    </Main>
                </ModalContainer>
            </ModalWrapper>
        </AddTaskContext.Provider>
        )
      );
}

AddTaskModal.propTypes = {
    $isOpen: PropTypes.bool
}

const ModalWrapper = styled.div`
    position: fixed;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.6);;
    padding: 20px;
    z-index: 100;
`

const ModalContainer = styled.div`
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: white;
    padding: 20px;
    z-index: 2;
    border-radius: 3rem;
    box-shadow: 0 4px 8px 0 ${({theme}) => theme.colors.shadow.main};
    width: 40vw;
`

// Modal content

const Main = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  gap: 3rem;
  padding: 3rem 3rem 3rem 3rem;
  width: 100%;
  text-align: start;
`

const InfoContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: center;
  width: 100%;
  gap: 1rem;
  border-bottom: 1px solid ${({theme}) => theme.colors.grey.main};
  padding: 0.5rem 2rem 0.5rem 2rem;
`

const InputField = styled.input`
    padding: 10px 10px;
    width: 100%;  
    transition: 0.2s;

    ${({ $err }) =>
        $err &&
        css`
        color:rgba(255, 0, 0, 0.474);
        `}
`

const Select = styled.select`
    position: ${({ $isOpen }) => ($isOpen ? "absolute" : "static")};
    top: ${({ $isOpen }) => ($isOpen ? "2rem" : "auto")};
    border: 1px solid transparent;
    background-color: transparent;
    padding: 0.5rem 1rem 0.5rem 1rem;
    border-radius: 4px;
    width: 100%;

    & option:hover{
        background-color: ${({theme}) => theme.colors.grey.main};
    }

    & option{
        text-align: center;
        padding: 0.4rem 0 0.4rem 0;
        margin-bottom: 0.2rem;
        border-radius: 4px;
    }
`

const DateInputField = styled.input`
    padding: 10px 10px;
    width: 100%;  
    transition: 0.2s;

    ${({ $err }) =>
        $err &&
        css`
        color:rgba(255, 0, 0, 0.474);
        `}
    background-color: white !important;
`

const ButtonContainer = styled.div`
  /* border-top: 1px solid ${({theme}) => (theme.colors.grey.main)}; */
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 3rem;    
  /* padding: 0 2rem 0 2rem;  */
  width: 100%;
`

export default AddTaskModal