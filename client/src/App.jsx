import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import { StatusCodes } from 'http-status-codes'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Tasks from './pages/Tasks'
import axios from 'axios';
import Journal from './pages/Journal'
import PropTypes from 'prop-types'
import Statistics from './pages/Statistics'


const App = ({ $requestNotificationPermission }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const isAuthenticated = async () => {
      try {
        const jwtToken = localStorage.getItem('token');
        if(!jwtToken) throw new Error;
        const result = await axios.get('http://localhost:3000/api/v1/auth/', 
        { headers: {Authorization: `Bearer ${jwtToken}`}});
        if (result.status === StatusCodes.OK) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
        setIsLoading(false);
      } catch (error) {
        setIsLoggedIn(false);
        setIsLoading(false);
      }
    }

    isAuthenticated()
  }, []);


  useEffect(() => {
    const handleBeforeUnload = () => {
      // Clear sessionStorage
      sessionStorage.removeItem("isPomodoroTimerActive");
      sessionStorage.removeItem("journalEntry");
    };

    // Attach the event listener
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Clean up the event listener when the component is unmounted
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  const logOut = () => {
    sessionStorage.clear();
    localStorage.clear();
    setIsLoggedIn(false);
  };
  
  if (isLoading) return <></>;
  return (
    <Router>
      <Routes>  
        <Route exact path='/' element={<Home />} />
        <Route exact path='/register' element={!isLoggedIn ? <Register /> : <Navigate to="/tasks" />}/>
        <Route exact path='/login' element={!isLoggedIn ? <Login /> : <Navigate to="/tasks" />} />
        <Route exact path='/tasks' element={isLoggedIn ? <Tasks $requestNotificationPermission={() => $requestNotificationPermission()} /> : <Navigate to="/login" />} />
        <Route exact path='/journal' element={isLoggedIn ? <Journal /> : <Navigate to="/login" />} />
        <Route exact path='/logout' element={ <LogOutComponent $logOut={logOut}/>} />
        <Route exact path='/statistics' element={isLoggedIn ? <Statistics /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  )
};


const LogOutComponent = ({ $logOut }) => {
  useEffect(() => {
    $logOut();
  }, [$logOut]);
  return <Navigate to='/' />;
};

LogOutComponent.propTypes = {
  $logOut: PropTypes.func,
};

App.propTypes = {
  $requestNotificationPermission: PropTypes.func,
};

export default App