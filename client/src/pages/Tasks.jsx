import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import styled from 'styled-components'
import Task from '../components/elements/Task'
import Button from '../components/elements/Button'
import TasksStatsContainer from '../components/elements/TasksStatsContainer'
import { FiCheckCircle, FiFilter, FiPlus } from 'react-icons/fi'
import { HiOutlineTrash } from 'react-icons/hi2'
import { IoSettingsOutline } from "react-icons/io5"
import axios from 'axios';
import { StatusCodes } from 'http-status-codes'
import AddTaskModal from '../components/addTaskModal/AddTaskModal'
import Filter from '../components/elements/Filter'

const Tasks = () => {

    const [expandedTask, setExpandedTask] = useState(null);   
    const [openAddTaskModal, setOpenAddTaskModal] = useState(false);
    const [openFilters, setOpenFilters] = useState(false);
    const [openSettings, setOpenSettings] = useState(false);
    const [newTaskName, setNewTaskName] = useState("");
    const [selectedWeekDay, setSelectedWeekDay] = useState("TODAY");
    const [isEditingTask, setIsEditingTask] = useState(false);
    const [tasks, setTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedCategories, setSelectedCategories] = useState([]);
    
    const [notificationOptions, setNotificationOptions] = useState(JSON.parse(localStorage.getItem("notificationOptions")));
    const [notificationDefaultOption, setNotificationDefaultOption] = useState(notificationOptions[0]);
    const [repeatOptions, setRepeatOptions] = useState(JSON.parse(localStorage.getItem("repeatOptions")));
    const [repeatDefaultOption, setRepeatDefaultOption] = useState(repeatOptions[0]);
    const [categoryOptions, setCategoryOptions] = useState(JSON.parse(localStorage.getItem("categoryOptions")));

    const toggleOpenFilters = () => {
        setOpenSettings(false);
        setOpenFilters(!openFilters);
    };

    const toggleOpenSettings = () => {
        setOpenFilters(false);
        setOpenSettings(!openSettings);
    };

    const updateExpandedTask = (taskId) => {
        setExpandedTask(taskId);
    }

    const updateOpenAddTaskModal = (newValue) => {
        setOpenAddTaskModal(newValue);
        if(!newValue) updateNewTaskName("");
    }

    const updateNewTaskName = (newValue) => {
        setNewTaskName(newValue);
    }

    const updateSelectedWeekDay = (newValue) => {
        setSelectedWeekDay(newValue);
    }

    const updateIsEditing = (newValue) => {
        setIsEditingTask(newValue);
    }

    const fetchAllTasks = async () => {
        try {
            setIsLoading(true);
            const jwtToken = localStorage.getItem('token');
            if(!jwtToken) throw new Error;
            const result = await axios.get('http://localhost:3000/api/v1/tasks/', 
            { headers: {Authorization: `Bearer ${jwtToken}`}});
            if (result.status === StatusCodes.OK) {
                setTasks(sortTasks(result.data.tasks));
            }
            setIsLoading(false);
        } catch (error) {
            console.error("There was an error:", error.message);
            setIsLoading(false);
        }
    }

    const sortTasks = (tasks) => {
        return tasks.sort((a, b) => {
            const finishedComparison = a.finished - b.finished;
            if (finishedComparison !== 0) {
                return finishedComparison;
            }
            const startTimeComparison = new Date(`2000-01-01T${a.startTime}Z`) - new Date(`2000-01-01T${b.startTime}Z`);
            if (startTimeComparison !== 0) {
                return startTimeComparison;
            }
            return new Date(`2000-01-01T${a.dueTime}Z`) - new Date(`2000-01-01T${b.dueTime}Z`);
        });
    }

    const deleteTask = async (id) => {
        try {
            const jwtToken = localStorage.getItem('token');
            if(!jwtToken) throw new Error;
            await axios.delete(`http://localhost:3000/api/v1/tasks/${id}`, 
            { headers: {Authorization: `Bearer ${jwtToken}`}});
            fetchAllTasks();
        } catch (error) {
            console.error("There was an error:", error.message);
        }
    }

    const fetchCategoryOptions = async () => {
        try {
            const jwtToken = localStorage.getItem('token');
            const { data } = await axios.get('http://localhost:3000/api/v1/tasksCategory/', {
                headers: { Authorization: `Bearer ${jwtToken}` },
            });
            localStorage.setItem("categoryOptions", JSON.stringify(data.categories));
        } catch (error) {
            if (
                error.statusCode == StatusCodes.NOT_FOUND ||
                error.statusCode == StatusCodes.BAD_REQUEST
            ) {
                throw error;
            } else {
                const customError = new Error();
                customError.response = {
                data: {
                    message: "Internal Server Error"
                }
                };
                customError.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
                throw customError;
            }
        } 
    };

    const createCategory = async (name, color) => {
        try {
            const jwtToken = localStorage.getItem('token');
            const result = await axios.post('http://localhost:3000/api/v1/tasksCategory/', 
            { name, color },
            { headers: {Authorization: `Bearer ${jwtToken}`}});

            setCategoryOptions(prevCategoryOptions => [
                ...prevCategoryOptions,
                {id: result.data, name: name, color: color}
            ]);

            // Update local storage with the new categories
            localStorage.setItem(
                'categoryOptions',
                JSON.stringify([...categoryOptions, {id: result.data, name: name, color: color}])
            );

            fetchCategoryOptions();
            return result.data;
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchAllTasks();
        fetchCategoryOptions();
    }, [])

    const formatDate = (date) => {
        const inputDate = new Date(date);

        const day = inputDate.getUTCDate().toString().padStart(2, '0');
        const month = (inputDate.getUTCMonth() + 1).toString().padStart(2, '0');
        const year = inputDate.getUTCFullYear();

        return `${day}/${month}/${year}`;
    }

    const formatTime = (time) => {
        const inputDate = new Date(`2000-01-01T${time}Z`);

        return inputDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false});
    }

    const updateSelectedCategory = (category) => {
        if(selectedCategories.some((selectedCategory) => selectedCategory.id === category.id)) {
            setSelectedCategories(selectedCategories.filter((selectedCategory) => selectedCategory.id !== category.id));
        } 
        else setSelectedCategories((prevSelectedCategories) => {return [...prevSelectedCategories, category]});
    }

    const deleteCategory = async (category) => {
        try {
          const jwtToken = localStorage.getItem('token');
          if(!jwtToken) throw new Error;
          await axios.delete(`http://localhost:3000/api/v1/tasksCategory/${category.id}`, 
          { headers: {Authorization: `Bearer ${jwtToken}`}});
          fetchCategoryOptions();

          setSelectedCategories(prevSelectedCategories => 
            prevSelectedCategories.filter(selectedCategory => selectedCategory.id !== category.id)
          );
          setCategoryOptions(prevCategoryOptions => 
            prevCategoryOptions.filter(selectedCategory => selectedCategory.id !== category.id)
          );

          fetchAllTasks();
        } catch (error) {
          console.error("There was an error:", error.message);
        }
      }

    return (
    <>
        {openAddTaskModal && <AddTaskModal $createCategory={createCategory} $defaultName={newTaskName} $updateIsOpen={updateOpenAddTaskModal} $isOpen={openAddTaskModal} $fetchAllTasks={() => fetchAllTasks()}/>}
        <Header></Header>
        <SecondHeaderWrapper>
            <SecondHeader>
                <DateContainer>16 OCT.
                </DateContainer>
                <Navbar>
                    <Button 
                        $content="TODAY"
                        $buttonStyle="icon"
                        $fontColor={"TODAY"==selectedWeekDay ? "primary" : "black"}
                        $fontWeight={"TODAY"==selectedWeekDay ? "bold" : "normal"}
                        $onClick={() => updateSelectedWeekDay("TODAY")}
                        $animation="scale"
                    ></Button>
                    <Button 
                        $content="MON"
                        $buttonStyle="icon"
                        $fontColor={"MON"==selectedWeekDay ? "primary" : "black"}
                        $fontWeight={"MON"==selectedWeekDay ? "bold" : "normal"}
                        $onClick={() => updateSelectedWeekDay("MON")}
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
                    <LeftButtonContainer>
                        <InputField type="text" placeholder='New Task' value={newTaskName} onChange={(e) => updateNewTaskName(e.target.value)}/>
                        <Button
                            $content={<FiPlus size={20}/>}
                            $buttonStyle="roundIcon"
                            $animation="scale"
                            $color="primary"
                            $fontColor="white"
                            $onClick={() => updateOpenAddTaskModal(true)}
                        ></Button>
                    </LeftButtonContainer>
                    <RightButtonContainer>
                        <Button
                            $content={<FiFilter size={20}/>}
                            $buttonStyle="roundIcon"
                            $animation="scale"
                            $color="transparent"
                            $fontColor="primary"
                            $onClick={() => toggleOpenFilters()}
                        ></Button>
                        {/*
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
                        <Button
                            $content={<IoSettingsOutline size={22}/>}
                            $buttonStyle="roundIcon"
                            $animation="scale"
                            $color="transparent"
                            $fontColor="primary"
                            $onClick={() => toggleOpenSettings()}
                        ></Button>
                        */}
                    </RightButtonContainer>     
                </ButtonWrapper>
                
                <FiltersContainer>
                {openFilters && <>
                    {categoryOptions.filter(filter => !selectedCategories.includes(filter)).map(filter => (
                        <Filter 
                            key={filter.id}
                            $id={filter.id}
                            $name={filter.name}
                            $color={filter.color}
                            $isFiltersOpen={openFilters}
                            $isSelected={false}
                            $updateSelectedCategory={() => updateSelectedCategory(filter)}
                            $onDelete={() => deleteCategory(filter)}/>
                    ))}
                    </>}
                    {selectedCategories.map((filter) => (
                        <Filter 
                            key={filter.id}
                            $id={filter.id}
                            $name={filter.name}
                            $color={filter.color}
                            $isFiltersOpen={openFilters}
                            $isSelected={true}
                            $updateSelectedCategory={() => updateSelectedCategory(filter)}
                            $onDelete={() => deleteCategory(filter)}/>
                    ))}
                </FiltersContainer>
                {isLoading && <LoadingTasks>Loading Tasks...</LoadingTasks>}
                {!isLoading && 
                    <>
                        {tasks.map((task) => (
                            (selectedCategories.length === 0 || selectedCategories.some((category) => category.id === task.categoryId)) && <Task key={task.taskId}
                                $fetchAllTasks={() => fetchAllTasks()} 
                                $taskId={task.taskId} 
                                $isExpanded={expandedTask == task.taskId} 
                                $updateExpandedTask={updateExpandedTask} 
                                $date={formatDate(task.startDate)} 
                                $startingTime={formatTime(task.startTime)} 
                                $endingTime={formatTime(task.dueTime)} 
                                $taskName={task.taskName} 
                                $category={{id: task.categoryId, name: task.categoryName, color: task.color}} 
                                $location={task.location} $notification={task.notifications} 
                                $repeat={task.repeatIntervals} 
                                $notes={task.notes} 
                                $isEditing={isEditingTask} 
                                $updateIsEditing={updateIsEditing}
                                $deleteTask={deleteTask} 
                                $isActive={task.finished ? false : true}
                                $createCategory={createCategory}
                                $notificationOptions={notificationOptions}
                                $notificationDefaultOption={notificationDefaultOption}
                                $repeatOptions={repeatOptions}
                                $repeatDefaultOption={repeatDefaultOption}
                                $categoryOptions={categoryOptions}>
                            </Task>
                        ))}
                    </>}        
            </LeftContainer>
            <TasksStatsContainer />
        </MainWrapper>
    </>)
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

const DateContainer = styled.h3`
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

const FilterContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 1rem;      
    padding: 1.5rem 2rem 1.5rem 2rem;
    border: 2px solid ${({theme}) => (theme.colors.primary)};
    border-radius: 3rem;
    box-shadow: 5px 5px 5px ${({theme}) => (theme.colors.shadow.main)};
    transition: 0.2s ease-in-out;
    background-color: transparent;
`

const FiltersContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    gap: 1rem;
    border-radius: 3rem;
    transition: 0.2s ease-in-out;
    background-color: transparent;

    padding-left: 1rem;
    padding-right: 1rem;
`

const LoadingTasks = styled.div`
    text-align: center;
    margin-top: 2rem;
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

const LeftButtonContainer = styled.div`
    display: flex;
    flex-direction: row;
    // justify-content: space-between;
    gap: 1.5rem;
`

const InputField = styled.input`
    background-color: transparent;
    border: 2px solid transparent;
    border-bottom: 2px solid ${({theme}) => theme.colors.primary};
    border-radius: 0rem;
    padding-left: 2rem;
    width: 40rem;
    transition: 0.3s ease-in-out;
    transition: border-radius 0 ease-in-out;

    &:focus {
        border-radius: 5rem;
        border-color: ${({theme}) => theme.colors.primary};
    }
`

const RightButtonContainer = styled.div`
    display: flex;
    flex-direction: row;
    // justify-content: space-between;
    gap: 1.5rem;
`

export default Tasks