import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import { StatusCodes } from 'http-status-codes'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Tasks from './pages/Tasks'
import axios from 'axios';


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
  }, [])
  
  if (isLoading) return <></>;
  return (
    <Router>
      <Routes>  
        <Route exact path='/' element={<Home />} />
        <Route exact path='/register' element={<Register />} />
        <Route exact path='/login' element={!isLoggedIn ? <Login /> : <Navigate to="/tasks" />} />
        <Route exact path='/tasks' element={isLoggedIn ? <Tasks /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  )
}

export default App