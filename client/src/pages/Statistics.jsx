import React, { useState } from 'react'
import Header from '../components/Header';
import styled from 'styled-components'
import axios from 'axios';
import { StatusCodes } from 'http-status-codes'
import Button from '../components/elements/Button';
import { PieChart, Pie, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar, Rectangle, LineChart, Line, ResponsiveContainer, Cell } from 'recharts';
import ExcelJS from 'exceljs';

const Statistics = () => {
  const [selectedOption, setSelectedOption] = useState(0);
  const [averageNumberOfTasks, setAverageNumberOfTasks] = useState(0);
  const [averageNumberOfTasksDone, setAverageNumberOfTasksDone] = useState(0);
  const [averageNumberOfTasksOverdue, setAverageNumberOfTasksOverdue] = useState(0);
  const [averageOverdueTime, setAverageOverdueTime] = useState(0);
  const [numberOfTasksPerCategory, setNumberOfTasksPerCategory] = useState([]);
  const [numberOfTasksDone, setNumberOfTasksDone] = useState(0);
  const [numberOfTasksDoneOverdue, setNumberOfTasksDoneOverdue] = useState(0);
  const [numberOfTasks, setNumberOfTasks] = useState([]);
  
  const pieChartData = [{ name: 'On time', value: numberOfTasksDone-numberOfTasksDoneOverdue, color: '#0c40b7'}, { name: 'Overdue', value: numberOfTasksDoneOverdue, color: '#B43AFF'}];

  // AVERAGE OVERDUE TIME
  const fetchAverageOverdueTime = async () => {
    try {
      const jwtToken = localStorage.getItem('token');
      if(!jwtToken) throw new Error;
      const result = await axios.get(`http://localhost:3000/api/v1/statistics/averageOverdueTime/`, 
      { headers: {Authorization: `Bearer ${jwtToken}`}});
      if (result.status === StatusCodes.OK) {
        setAverageOverdueTime(result.data.averageOverdueTime);
      }
    } catch (error) {
      console.error("There was an error:", error.message);
    }
  }

  // AVERGAGE NUMBER OF TASKS PER DAY
  const fetchAverageNumberOfTasksPerDay = async () => {
    try {
      const jwtToken = localStorage.getItem('token');
      if(!jwtToken) throw new Error;
      const result = await axios.get(`http://localhost:3000/api/v1/statistics/day/averageTasks/`, 
      { headers: {Authorization: `Bearer ${jwtToken}`}});
      if (result.status === StatusCodes.OK) {
        setAverageNumberOfTasks(result.data.averageNumberOfTasksPerDay);
      }
    } catch (error) {
      console.error("There was an error:", error.message);
    } 
  };

  // AVERGAGE NUMBER OF TASKS DONE PER DAY
  const fetchAverageNumberOfTasksDonePerDay = async () => {
    try {
      const jwtToken = localStorage.getItem('token');
      if(!jwtToken) throw new Error;
      const result = await axios.get(`http://localhost:3000/api/v1/statistics/day/averageTasksDone/`, 
      { headers: {Authorization: `Bearer ${jwtToken}`}});
      if (result.status === StatusCodes.OK) {
        setAverageNumberOfTasksDone(result.data.averageNumberOfTasksDonePerDay);
      }
    } catch (error) {
      console.error("There was an error:", error.message);
    } 
  };

  // AVERGAGE NUMBER OF TASKS OVERDUE PER DAY
  const fetchAverageNumberOfTasksOverduePerDay = async () => {
    try {
      const jwtToken = localStorage.getItem('token');
      if(!jwtToken) throw new Error;
      const result = await axios.get(`http://localhost:3000/api/v1/statistics/day/averageTasksOverdue/`, 
      { headers: {Authorization: `Bearer ${jwtToken}`}});
      if (result.status === StatusCodes.OK) {
        setAverageNumberOfTasksOverdue(result.data.averageNumberOfTasksOverduePerDay);
      }
    } catch (error) {
      console.error("There was an error:", error.message);
    } 
  };

  // AVERGAGE NUMBER OF TASKS PER WEEK
  const fetchAverageNumberOfTasksPerWeek = async () => {
    try {
      const jwtToken = localStorage.getItem('token');
      if(!jwtToken) throw new Error;
      const result = await axios.get(`http://localhost:3000/api/v1/statistics/week/averageTasks/`, 
      { headers: {Authorization: `Bearer ${jwtToken}`}});
      if (result.status === StatusCodes.OK) {
        setAverageNumberOfTasks(result.data.averageNumberOfTasksPerWeek);
      }
    } catch (error) {
      console.error("There was an error:", error.message);
    } 
  };

  // AVERGAGE NUMBER OF TASKS DONE PER WEEK
  const fetchAverageNumberOfTasksDonePerWeek = async () => {
    try {
      const jwtToken = localStorage.getItem('token');
      if(!jwtToken) throw new Error;
      const result = await axios.get(`http://localhost:3000/api/v1/statistics/week/averageTasksDone/`, 
      { headers: {Authorization: `Bearer ${jwtToken}`}});
      if (result.status === StatusCodes.OK) {
        setAverageNumberOfTasksDone(result.data.averageNumberOfTasksDonePerWeek);
      }
    } catch (error) {
      console.error("There was an error:", error.message);
    } 
  };

  // AVERGAGE NUMBER OF TASKS OVERDUE PER WEEK
  const fetchAverageNumberOfTasksOverduePerWeek = async () => {
    try {
      const jwtToken = localStorage.getItem('token');
      if(!jwtToken) throw new Error;
      const result = await axios.get(`http://localhost:3000/api/v1/statistics/week/averageTasksOverdue/`, 
      { headers: {Authorization: `Bearer ${jwtToken}`}});
      if (result.status === StatusCodes.OK) {
        setAverageNumberOfTasksOverdue(result.data.averageNumberOfTasksOverduePerWeek);
      }
    } catch (error) {
      console.error("There was an error:", error.message);
    } 
  };


  // AVERGAGE NUMBER OF TASKS PER MONTH
  const fetchAverageNumberOfTasksPerMonth = async () => {
    try {
      const jwtToken = localStorage.getItem('token');
      if(!jwtToken) throw new Error;
      const result = await axios.get(`http://localhost:3000/api/v1/statistics/month/averageTasks/`, 
      { headers: {Authorization: `Bearer ${jwtToken}`}});
      if (result.status === StatusCodes.OK) {
        setAverageNumberOfTasks(result.data.averageNumberOfTasksPerMonth);
      }
    } catch (error) {
      console.error("There was an error:", error.message);
    } 
  };

  // AVERGAGE NUMBER OF TASKS DONE PER MONTH
  const fetchAverageNumberOfTasksDonePerMonth = async () => {
    try {
      const jwtToken = localStorage.getItem('token');
      if(!jwtToken) throw new Error;
      const result = await axios.get(`http://localhost:3000/api/v1/statistics/month/averageTasksDone/`, 
      { headers: {Authorization: `Bearer ${jwtToken}`}});
      if (result.status === StatusCodes.OK) {
        setAverageNumberOfTasksDone(result.data.averageNumberOfTasksDonePerMonth);
      }
    } catch (error) {
      console.error("There was an error:", error.message);
    } 
  };

  // AVERGAGE NUMBER OF TASKS OVERDUE PER MONTH
  const fetchAverageNumberOfTasksOverduePerMonth = async () => {
    try {
      const jwtToken = localStorage.getItem('token');
      if(!jwtToken) throw new Error;
      const result = await axios.get(`http://localhost:3000/api/v1/statistics/month/averageTasksOverdue/`, 
      { headers: {Authorization: `Bearer ${jwtToken}`}});
      if (result.status === StatusCodes.OK) {
        setAverageNumberOfTasksOverdue(result.data.averageNumberOfTasksOverduePerMonth);
      }
    } catch (error) {
      console.error("There was an error:", error.message);
    } 
  };

  // AVERGAGE NUMBER OF TASKS PER YEAR
  const fetchAverageNumberOfTasksPerYear = async () => {
    try {
      const jwtToken = localStorage.getItem('token');
      if(!jwtToken) throw new Error;
      const result = await axios.get(`http://localhost:3000/api/v1/statistics/year/averageTasks/`, 
      { headers: {Authorization: `Bearer ${jwtToken}`}});
      if (result.status === StatusCodes.OK) {
        setAverageNumberOfTasks(result.data.averageNumberOfTasksPerYear);
      }
    } catch (error) {
      console.error("There was an error:", error.message);
    } 
  };

  // AVERGAGE NUMBER OF TASKS DONE PER YEAR
  const fetchAverageNumberOfTasksDonePerYear = async () => {
    try {
      const jwtToken = localStorage.getItem('token');
      if(!jwtToken) throw new Error;
      const result = await axios.get(`http://localhost:3000/api/v1/statistics/year/averageTasksDone/`, 
      { headers: {Authorization: `Bearer ${jwtToken}`}});
      if (result.status === StatusCodes.OK) {
        setAverageNumberOfTasksDone(result.data.averageNumberOfTasksDonePerYear);
      }
    } catch (error) {
      console.error("There was an error:", error.message);
    } 
  };

  // AVERGAGE NUMBER OF TASKS OVERDUE PER YEAR
  const fetchAverageNumberOfTasksOverduePerYear = async () => {
    try {
      const jwtToken = localStorage.getItem('token');
      if(!jwtToken) throw new Error;
      const result = await axios.get(`http://localhost:3000/api/v1/statistics/year/averageTasksOverdue/`, 
      { headers: {Authorization: `Bearer ${jwtToken}`}});
      if (result.status === StatusCodes.OK) {
        setAverageNumberOfTasksOverdue(result.data.averageNumberOfTasksOverduePerYear);
      }
    } catch (error) {
      console.error("There was an error:", error.message);
    } 
  };


  // NUMBER OF TASKS PER CATEGORY
  const fetchNumberOfTasksPerCategory = async () => {
    try {
      const jwtToken = localStorage.getItem('token');
      if(!jwtToken) throw new Error;
      const result = await axios.get(`http://localhost:3000/api/v1/statistics/tasksPerCategory/`, 
      { headers: {Authorization: `Bearer ${jwtToken}`}});
      if (result.status === StatusCodes.OK) {
        setNumberOfTasksPerCategory(result.data.data);
      }
    } catch (error) {
      console.error("There was an error:", error.message);
    } 
  };

  // NUMBER OF TASKS DONE
  const fetchNumberOfTasksDone = async () => {
    try {
      const jwtToken = localStorage.getItem('token');
      if(!jwtToken) throw new Error;
      const result = await axios.get(`http://localhost:3000/api/v1/statistics/tasksDone/`, 
      { headers: {Authorization: `Bearer ${jwtToken}`}});
      if (result.status === StatusCodes.OK) {
        setNumberOfTasksDone(result.data.numberOfTasksDone);
      }
    } catch (error) {
      console.error("There was an error:", error.message);
    } 
  };

   // NUMBER OF TASKS DONE OVERDUE
   const fetchNumberOfTasksDoneOverdue = async () => {
    try {
      const jwtToken = localStorage.getItem('token');
      if(!jwtToken) throw new Error;
      const result = await axios.get(`http://localhost:3000/api/v1/statistics/tasksDoneOverdue/`, 
      { headers: {Authorization: `Bearer ${jwtToken}`}});
      if (result.status === StatusCodes.OK) {
        setNumberOfTasksDoneOverdue(result.data.numberOfTasksDoneOverdue);
      }
    } catch (error) {
      console.error("There was an error:", error.message);
    } 
  };

  // NUMBER OF TASKS
  const fetchNumberOfTasks = async () => {
    try {
      const jwtToken = localStorage.getItem('token');
      if(!jwtToken) throw new Error;
      const result = await axios.get(`http://localhost:3000/api/v1/statistics/numberOfTasks/`, 
      { headers: {Authorization: `Bearer ${jwtToken}`}});
      if (result.status === StatusCodes.OK) {
        const temp = result.data.data.map((option) =>({date: formatDate(option.date), value: option.value}))
        setNumberOfTasks(temp);
      }
    } catch (error) {
      console.error("There was an error:", error.message);
    } 
  };

  const formatDate = (date) => {
    const inputDate = new Date(date);

    const day = inputDate.getUTCDate().toString().padStart(2, '0');
    const month = (inputDate.getUTCMonth() + 1).toString().padStart(2, '0');
    const year = inputDate.getUTCFullYear();

    return `${day}/${month}/${year}`;
  };

  // DOWNLOAD
  const download = async () => {
    try {
      let tasks = await fetchAllTasks();
      let categories = await fetchAllCategories();
      let { repeat, repeatOptions } = await fetchAllRepeat();
      let { notifications, notificationsOptions } = await fetchAllNotifications();

      tasks = tasks.map((task) => ([task.id, task.name, task.category, task.location, task.notes, formatDate(task.startDate), task.startTime, formatDate(task.dueDate), task.dueTime, task.finished, task.finishDate ? formatDate(task.finishDate) : task.finishDate, task.finishTime]));
      categories = categories.map((category) => ([category.id, category.name, category.color]));
      repeat = repeat.map((value) => ([value.taskID, value.repeatIntervalID, value.originalTaskID]));
      repeatOptions = repeatOptions.map((repeatOption) => ([repeatOption.id, repeatOption.name]));
      notifications = notifications.map((notification) => ([notification.taskID, notification.notificationID]));
      notificationsOptions = notificationsOptions.map((notificationsOption) => ([notificationsOption.id, notificationsOption.name]));

      const workbook = new ExcelJS.Workbook();

      const sheet1 = workbook.addWorksheet('Tasks');
      sheet1.addRow(["id", "name", "category", "location", "notes", "startDate", "startTime", "dueDate", "dueTime", "finished", "finishDate", "finishTime"])
      sheet1.addRows(tasks);

      const sheet2 = workbook.addWorksheet('Categories');
      sheet2.addRow(["id", "name", "color"]);
      sheet2.addRows(categories);

      const sheet3 = workbook.addWorksheet('Task Repeat');
      sheet3.addRow(["taskID", "repeatIntervalID", "originalTaskID"]);
      sheet3.addRows(repeat);

      const sheet4 = workbook.addWorksheet('Repeat Options');
      sheet4.addRow(["id", "name"]);
      sheet4.addRows(repeatOptions);

      const sheet5 = workbook.addWorksheet('Task Notifications');
      sheet5.addRow(["taskID", "notificationID"]);
      sheet5.addRows(notifications);

      const sheet6 = workbook.addWorksheet('Notifications Options');
      sheet6.addRow(["id", "name"]);
      sheet6.addRows(notificationsOptions);

      let buffer = await workbook.xlsx.writeBuffer();

      let blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      let link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = "done_data.xlsx";
      link.click();
      URL.revokeObjectURL(link.href);

    } catch (error) {
      console.error("There was an error:", error.message);
    }
  };

  const fetchAllTasks = async () => {
    try {
      const jwtToken = localStorage.getItem('token');
      if(!jwtToken) throw new Error;
      const result = await axios.get(`http://localhost:3000/api/v1/statistics/tasks`, 
      { headers: {Authorization: `Bearer ${jwtToken}`}});
      if (result.status === StatusCodes.OK) {
        return result.data.tasks;
      }
    } catch (error) {
      console.error("There was an error:", error.message);
    }
  };

  const fetchAllNotifications = async () => {
    try {
      const jwtToken = localStorage.getItem('token');
      let notifications = [];
      let notificationsOptions = [];

      if(!jwtToken) throw new Error;
      const result = await axios.get(`http://localhost:3000/api/v1/statistics/notifications`, 
      { headers: {Authorization: `Bearer ${jwtToken}`}});
      if (result.status === StatusCodes.OK) {
        notifications = result.data.notifications ? result.data.notifications : [];
      }
      const result2 = await axios.get(`http://localhost:3000/api/v1/tasksNotifications`, 
      { headers: {Authorization: `Bearer ${jwtToken}`}});
      if (result2.status === StatusCodes.OK) {
        notificationsOptions = result2.data.notifications ? result2.data.notifications : [];
      }
      return {notifications, notificationsOptions};
    } catch (error) {
      console.error("There was an error:", error.message);
    }
  };

  const fetchAllRepeat = async () => {
    try {
      const jwtToken = localStorage.getItem('token');
      let repeat = [];
      let repeatOptions = [];

      if(!jwtToken) throw new Error;
      const result = await axios.get(`http://localhost:3000/api/v1/statistics/repeat`, 
      { headers: {Authorization: `Bearer ${jwtToken}`}});
      if (result.status === StatusCodes.OK) {
        repeat = result.data.repeat ? result.data.repeat : [];
      }
      const result2 = await axios.get(`http://localhost:3000/api/v1/tasksRepeat`, 
      { headers: {Authorization: `Bearer ${jwtToken}`}});
      if (result2.status === StatusCodes.OK) {
        repeatOptions = result2.data.repeatIntervals ? result2.data.repeatIntervals : [];
      }
      return {repeat, repeatOptions};
    } catch (error) {
      console.error("There was an error:", error.message);
    }
  };

  const fetchAllCategories = async () => {
    try {
      const jwtToken = localStorage.getItem('token');
      let categories = [];

      if(!jwtToken) throw new Error;
      const result = await axios.get(`http://localhost:3000/api/v1/tasksCategory`, 
      { headers: {Authorization: `Bearer ${jwtToken}`}});
      if (result.status === StatusCodes.OK) {
        categories = result.data.categories ? result.data.categories : [];
      }
      return categories;
    } catch (error) {
      console.error("There was an error:", error.message);
    }
  };

  const updateSelectedOption = (value) => {
    setSelectedOption(value);
    if(value === 0) {
      fetchAverageNumberOfTasksPerDay();
      fetchAverageNumberOfTasksDonePerDay();
      fetchAverageNumberOfTasksOverduePerDay();
    }
    else if(value === 1) {
      fetchAverageNumberOfTasksPerWeek();
      fetchAverageNumberOfTasksDonePerWeek();
      fetchAverageNumberOfTasksOverduePerWeek();
    }
    else if(value === 2) {
      fetchAverageNumberOfTasksPerMonth();
      fetchAverageNumberOfTasksDonePerMonth();
      fetchAverageNumberOfTasksOverduePerMonth();
    }
    else if(value === 3) {
      fetchAverageNumberOfTasksPerYear();
      fetchAverageNumberOfTasksDonePerYear();
      fetchAverageNumberOfTasksOverduePerYear();
    }
    
    fetchAverageOverdueTime();
  }

  useState(() => {
    if(selectedOption === 0) {
      fetchAverageNumberOfTasksPerDay();
      fetchAverageNumberOfTasksDonePerDay();
      fetchAverageNumberOfTasksOverduePerDay();
    }
    else if(selectedOption === 1) {
      fetchAverageNumberOfTasksPerWeek();
      fetchAverageNumberOfTasksDonePerWeek();
      fetchAverageNumberOfTasksOverduePerWeek();
    }
    else if(selectedOption === 2) {
      fetchAverageNumberOfTasksPerMonth();
      fetchAverageNumberOfTasksDonePerMonth();
      fetchAverageNumberOfTasksOverduePerMonth();
    }
    else if(selectedOption === 3) {
      fetchAverageNumberOfTasksPerYear();
      fetchAverageNumberOfTasksDonePerYear();
      fetchAverageNumberOfTasksOverduePerYear();
    }

    fetchAverageOverdueTime();
    fetchNumberOfTasksPerCategory();
    fetchNumberOfTasksDone();
    fetchNumberOfTasksDoneOverdue();
    fetchNumberOfTasks();
  }, [selectedOption]);

  return (
    <PageWrapper>
        <Header></Header>
        <SecondHeaderWrapper>
          <SecondHeader>
            <Navbar>
              <NavbarButtonContainer>
                <Button
                    $title={"Day"}
                    $content={"DAY"}
                    $buttonStyle="icon"
                    $fontColor={selectedOption === 0 ? "primary" : "black"}
                    $fontWeight={selectedOption === 0 ? "bold" : "normal"}
                    $onClick={() => updateSelectedOption(0)}
                    $animation="scale"
                ></Button>
                <Button
                    $title={"Week"}
                    $content={"WEEK"}
                    $buttonStyle="icon"
                    $fontColor={selectedOption === 1 ? "primary" : "black"}
                    $fontWeight={selectedOption === 1 ? "bold" : "normal"}
                    $onClick={() => updateSelectedOption(1)}
                    $animation="scale"
                ></Button>
                <Button
                    $title={"Month"}
                    $content={"MONTH"}
                    $buttonStyle="icon"
                    $fontColor={selectedOption === 2 ? "primary" : "black"}
                    $fontWeight={selectedOption === 2 ? "bold" : "normal"}
                    $onClick={() => updateSelectedOption(2)}
                    $animation="scale"
                ></Button>
                <Button
                    $title={"Year"}
                    $content={"YEAR"}
                    $buttonStyle="icon"
                    $fontColor={selectedOption === 3 ? "primary" : "black"}
                    $fontWeight={selectedOption === 3 ? "bold" : "normal"}
                    $onClick={() => updateSelectedOption(3)}
                    $animation="scale"
                ></Button>
              </NavbarButtonContainer>
              <NavbarButtonContainer>
                <Button
                    $title={"Download"}
                    $content={"DOWNLOAD"}
                    $buttonStyle="icon"
                    $fontColor={false ? "primary" : "black"}
                    $fontWeight={false ? "bold" : "normal"}
                    $onClick={() => download()}
                    $animation="scale"
                ></Button>
              </NavbarButtonContainer>    
            </Navbar>
          </SecondHeader>
        </SecondHeaderWrapper>
        <MainWrapper>
          <UpperWrapper>
            <UpperLeftWrapper>
              <UpperLeftInnerWrapper>
                <BlueContainer>
                  <InfoNumber>{averageNumberOfTasks}</InfoNumber>
                  <Quote>tasks {selectedOption == 0 ? "per day" : selectedOption == 1 ? "per week" : selectedOption == 2 ? "per month" : "per year"}</Quote> 
                </BlueContainer>
                <BlueContainer>
                  <InfoNumber>{averageNumberOfTasksDone}</InfoNumber>
                  <Quote>tasks done {selectedOption == 0 ? "per day" : selectedOption == 1 ? "per week" : selectedOption == 2 ? "per month" : "per year"}</Quote>
                </BlueContainer>
              </UpperLeftInnerWrapper>
              <UpperLeftInnerWrapper>
                <BlueContainer>
                  <InfoNumber>{averageNumberOfTasksOverdue}</InfoNumber>
                  <Quote>tasks overdue {selectedOption == 0 ? "per day" : selectedOption == 1 ? "per week" : selectedOption == 2 ? "per month" : "per year"}</Quote>
                </BlueContainer>
                <BlueContainer>
                  <InfoNumber>{averageOverdueTime < 60 ? `${averageOverdueTime}s` : averageOverdueTime >= 3600 ? `${Math.floor(averageOverdueTime/3600)}:${Math.floor((averageOverdueTime % 3600) / 60)}h` : `${Math.floor(averageOverdueTime/60)}:${averageOverdueTime%60}min`}</InfoNumber>
                  <Quote>average overdue time</Quote>
                </BlueContainer>
              </UpperLeftInnerWrapper>
            </UpperLeftWrapper>
            <UpperRightWrapper>
              <UpperRightLeftInnerWrapper>
                <PieContainer>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={pieChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" fill="#82ca9d" >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                      </Pie>
                      <Legend layout='vertical' align='right' verticalAlign='middle'/>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </PieContainer>
              </UpperRightLeftInnerWrapper>
              <UpperRightRightInnerWrapper>
                <BarChartContainer>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={numberOfTasksPerCategory}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#82ca9d" activeBar={<Rectangle fill="orange" stroke="none" />} >
                        {numberOfTasksPerCategory.map((entry, index) => (
                          <Cell key={`cell-${entry.id}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </BarChartContainer>
              </UpperRightRightInnerWrapper>
            </UpperRightWrapper>
          </UpperWrapper>
          <LowerWrapper>
            <Container>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={numberOfTasks}
                  st
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={false}/>
                  <YAxis type='number' allowDecimals={false}/>
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#0c40b7" strokeWidth={2} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </Container>
          </LowerWrapper>
        </MainWrapper>
    </PageWrapper>)
}

const PageWrapper = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
`

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

const Navbar = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
`

const NavbarButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 4rem;
`

const MainWrapper = styled.main`
    max-width: ${({ theme }) => theme.widths.content};
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: column;
    justify-content: center;
    margin-top: 2rem;
    margin-bottom: 2rem;
    gap: 1rem;
    height: 100%;
    width: 100%;
`

const UpperWrapper = styled.div`
  gap: 1rem;
  display: flex;
  flex-direction: row;
  flex: 0.3;
  width: 100%;
  height: 100%;
`

const UpperLeftWrapper = styled.div`
  gap: 1rem;
  display: flex;
  flex-direction: column;
  flex: 0.4;
  width: 100%;
  height: 100%;
`

const UpperLeftInnerWrapper = styled.div`
  gap: 1rem;
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;
`

const UpperRightWrapper = styled.div`
  gap: 1rem;
  display: flex;
  flex-direction: row;
  flex: 0.6;
  width: 100%;
  height: 100%;
`

const UpperRightLeftInnerWrapper = styled.div`
  gap: 1rem;
  display: flex;
  flex-direction: row;
  flex: 0.4;
  width: 100%;
  height: 100%;
`

const UpperRightRightInnerWrapper = styled.div`
  gap: 1rem;
  display: flex;
  flex: 0.6;
  flex-direction: column;
  width: 100%;
  height: 100%;
`

const LowerWrapper = styled.div`
  width: 100%;
  height: 100%;
  flex: 0.7;
`

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;      
  padding: 3rem;
  border: 1px solid ${({theme}) => (theme.colors.grey.main)};
  border-radius: 3rem;
  box-shadow: 5px 5px 5px ${({theme}) => (theme.colors.shadow.main)};
  transition: 0.2s ease-in-out;
  height: 100%;
  max-height: 70vh;
  width: 100%;
  background-color: white;
`

const BlueContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;      
  padding: 1.5rem;
  border: 1px solid ${({theme}) => (theme.colors.primary)};
  border-radius: 3rem;
  box-shadow: 5px 5px 5px ${({theme}) => (theme.colors.shadow.main)};
  transition: 0.2s ease-in-out;
  height: 100%;
  max-height: 70vh;
  width: 100%;
  background-color: ${({theme}) => (theme.colors.primary)};
  color: white;
`

const PieContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;      
  padding: 0;
  border: 1px solid ${({theme}) => (theme.colors.grey.main)};
  border-radius: 3rem;
  box-shadow: 5px 5px 5px ${({theme}) => (theme.colors.shadow.main)};
  transition: 0.2s ease-in-out;
  height: 100%;
  max-height: 70vh;
  width: 100%;
  background-color: white;
`

const BarChartContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;      
  padding: 2rem;
  border: 1px solid ${({theme}) => (theme.colors.grey.main)};
  border-radius: 3rem;
  box-shadow: 5px 5px 5px ${({theme}) => (theme.colors.shadow.main)};
  transition: 0.2s ease-in-out;
  height: 100%;
  max-height: 70vh;
  width: 100%;
  background-color: white;
`

const Quote = styled.h4`
  text-align: center;
`

const InfoNumber = styled.h1`
  font-size: 4rem;
`

export default Statistics