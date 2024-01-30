import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import { StatusCodes } from 'http-status-codes'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Tasks from './pages/Tasks'
import axios from 'axios';
import Journal from './pages/Journal'
import Statistics from './pages/Statistics'


const App = () => {
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
  
  if (isLoading) return <></>;
  return (
    <Router>
      <Routes>  
        <Route exact path='/' element={<Home />} />
        <Route exact path='/register' element={!isLoggedIn ? <Register /> : <Navigate to="/tasks" />}/>
        <Route exact path='/login' element={!isLoggedIn ? <Login /> : <Navigate to="/tasks" />} />
        <Route exact path='/tasks' element={isLoggedIn ? <Tasks /> : <Navigate to="/login" />} />
        <Route exact path='/journal' element={isLoggedIn ? <Journal /> : <Navigate to="/login" />} />
        <Route exact path='/stats' element={isLoggedIn ? <Statistics /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  )
}

export default App