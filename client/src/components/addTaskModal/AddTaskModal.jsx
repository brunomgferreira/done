import React, { createContext, useEffect, useRef, useState } from 'react'
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
import axios from 'axios';

const AddTaskContext = createContext();

const AddTaskModal = ({ $defaultName, $updateIsOpen, $fetchAllTasks, $createCategory }) => {
    const [notificationOptions, setNotificationOptions] = useState(JSON.parse(localStorage.getItem("notificationOptions")));
    const [notificationDefaultOption, setNotificationDefaultOption] = useState(notificationOptions[0]);
    
    const [repeatOptions, setRepeatOptions] = useState(JSON.parse(localStorage.getItem("repeatOptions")));
    const [repeatDefaultOption, setRepeatDefaultOption] = useState(repeatOptions[0]);
    
    const [categoryOptions, setCategoryOptions] = useState(JSON.parse(localStorage.getItem("categoryOptions")));
    const [categoryDefaultOption, setCategoryDefaultOption] = useState(categoryOptions[0]);

    const [name, setName] = useState($defaultName);
    const [category, setCategory] = useState(categoryDefaultOption);
    const [location, setLocation] = useState("");
    const [notification, setNotification] = useState([notificationDefaultOption]);
    const [repeat, setRepeat] = useState([repeatDefaultOption]);
    const [notes, setNotes] = useState("");
    const [date , setDate] = useState(new Date().toISOString().split("T")[0]);
    const [startingTime, setStartingTime] = useState(() => {
        let hours = new Date().getHours();
        let minutes = Math.ceil(new Date().getMinutes() / 10) * 10;
        if(minutes >= 60) {
            hours++;
            minutes = minutes-60;
        }
        return `${hours}:${minutes}`
    });
    const [endingTime, setEndingTime] = useState(() => {
        let hours = new Date().getHours();
        let minutes = Math.ceil(new Date().getMinutes() / 10) * 10;
        if(minutes >= 60) {
            hours++;
            minutes = minutes-60;
        }
        return `${hours}:${minutes}`
    });
    const modalContainerRef = useRef(null);

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

    const createTask = async () => {
        try {
            const jwtToken = localStorage.getItem('token');
            await axios.post('http://localhost:3000/api/v1/tasks/', 
            { name, category, location, notification, repeat, notes, date, startingTime, endingTime },
            { headers: {Authorization: `Bearer ${jwtToken}`}});
            $updateIsOpen(false);
            $fetchAllTasks();
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        const handleClickOutside = ({target}) => {
            if(modalContainerRef.current && !modalContainerRef.current.contains(target)) $updateIsOpen(false);
        };
        
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [$updateIsOpen]);

    const updateIsOpen = (newValue) => {
        $updateIsOpen(newValue);
    };

    const updateOptions = async (name, color) => {
        const categoryID = await $createCategory(name, color);
        setCategoryOptions((prevCategoryOptions) => {
            const updatedCategoryOptions = [...prevCategoryOptions, {id : categoryID, name, color }];
            setCategoryDefaultOption(updatedCategoryOptions[0]);
            return updatedCategoryOptions;
        });
    };

    return (
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
                <ModalContainer ref={modalContainerRef}>
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
                            <SelectorWithAdd $selectedOption={categoryDefaultOption} $options={categoryOptions} $onAdd={updateOptions} $updateSelectedOption={updateCategory}/>
                        </InfoContainer>
                        <InfoContainer>
                            <HiOutlineLocationMarker size={20} />
                            <InputField type="location" value={location} onChange={(e) => updateLocation(e.target.value)} placeholder='Location' />
                        </InfoContainer>
                        <InfoContainer>
                            <MdOutlineNotifications size={21}/>
                            <MultiSelector $defaultOption={notificationDefaultOption} $options={notificationOptions} $selectedOptions={notification} $updateSelectedOptions={(newValue) => updateNotification(newValue)}></MultiSelector>
                        </InfoContainer>
                        <InfoContainer>
                            <TbRepeat size={20}/>
                            <MultiSelector $defaultOption={repeatDefaultOption} $options={repeatOptions} $selectedOptions={repeat} $updateSelectedOptions={(newValue) => updateRepeat(newValue)}></MultiSelector>
                        </InfoContainer>
                        <InfoContainer>
                            <MdNotes size={20} />
                            <NotesInputField value={notes} onChange={(e) => updateNotes(e.target.value)} placeholder='Notes' />
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
                                $onClick={() => createTask()}
                            ></Button>
                            <Button
                                $content={<>Cancel&nbsp;<IoMdClose size={24}/></>}
                                $buttonStyle="roundText"
                                $color="transparent"
                                $fontColor="red"
                                $borderColor="red"
                                $fontWeight="bold"
                                $animation="scale"
                                $onClick={() => updateIsOpen(false)}
                            ></Button>
                        </ButtonContainer>
                    </Main>
                </ModalContainer>
            </ModalWrapper>
        </AddTaskContext.Provider>
        );
}

AddTaskModal.propTypes = {
    $defaultName: PropTypes.string,
    $updateIsOpen: PropTypes.func,
    $isOpen: PropTypes.bool,
    $fetchAllTasks: PropTypes.func,
    $createCategory: PropTypes.func,
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
  gap: 2rem;
  border-bottom: 1px solid ${({theme}) => theme.colors.grey.main};
  padding: 0.5rem 2rem 1.5rem 2rem;
`

const InputField = styled.input`
    padding: 0px 10px 0px 0px;
    width: 100%;  
    transition: 0.2s;

    ${({ $err }) =>
        $err &&
        css`
        color:rgba(255, 0, 0, 0.474);
        `}
`

const NotesInputField = styled.textarea`
    padding: 0px 10px 0px 0px;
    width: 100%;  
    transition: 0.2s;
    height: 10rem;
    resize: none;

    ${({ $err }) =>
        $err &&
        css`
        color:rgba(255, 0, 0, 0.474);
        `}
`

const DateInputField = styled.input`
    padding: 0px 10px 0px 0px;
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