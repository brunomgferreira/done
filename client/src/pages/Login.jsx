import React, { useEffect, useState } from 'react';
import { styled, css } from 'styled-components';
import Button from '../components/elements/Button';
import { BsFacebook, BsGoogle } from 'react-icons/bs';
import axios from 'axios';
import InputField from '../components/elements/InputField';
import { Link } from 'react-router-dom'
import { StatusCodes } from 'http-status-codes'

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const clearError = () => {
    setError('');
  }

  const fetchNotificationOptions = async (jwtToken) => {
    try {
      const { data } = await axios.get('http://localhost:3000/api/v1/tasksNotifications/', {
          headers: { Authorization: `Bearer ${jwtToken}` },
      });
      localStorage.setItem("notificationOptions", JSON.stringify(data.notifications));
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

  const fetchRepeatOptions = async (jwtToken) => {
    try {
      const { data } = await axios.get('http://localhost:3000/api/v1/tasksRepeat/', {
          headers: { Authorization: `Bearer ${jwtToken}` },
      });
      localStorage.setItem("repeatOptions", JSON.stringify(data.repeatIntervals));
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

  const fetchCategoryOptions = async (jwtToken) => {
    try {
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

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    clearError();

    try {
      const result = await axios.post('http://localhost:3000/api/v1/user/login', {email, password});
      const jwtToken = result.data.token;
      const user = result.data.user;
      localStorage.setItem('token', jwtToken);
      localStorage.setItem('user', JSON.stringify(user));

      await fetchNotificationOptions(jwtToken);
      await fetchRepeatOptions(jwtToken);
      await fetchCategoryOptions(jwtToken);

      window.location = '/tasks';

    } catch (error) {
      localStorage.clear();
      const err = error.response.data.message + ".";
      setError(err);
    }
  }

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
      <LoginWrapper $windowWidth={windowWidth}>
        <LoginContainer $windowWidth={windowWidth}>
          <LoginForm onSubmit={handleSubmit}>
            <Title>Sign in</Title>
            <SingleInputContainer>
              <InputField type="text" name="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} $err={error} />
            </SingleInputContainer>
            <SingleInputContainer>
              <InputField type="password" name="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} $err={error}/>
            </SingleInputContainer>
            <SubmitButtonContainer>
              <Button
                $content="Sign in"
                $size="wide"
                $shape="squared"
                $color="primary"
                $fontColor="white"
                $animation="scale"
              ></Button>
              <ErrorSpan>{error}</ErrorSpan> 
            </SubmitButtonContainer>
            <div>
              <span>Or login with</span>
            </div>
            <OtherLoginOptions>
              <OtherLoginOption href="#">
                <OtherLoginOptionLinkSpan><BsFacebook /> Facebook</OtherLoginOptionLinkSpan>
              </OtherLoginOption>
              <OtherLoginOption href="#">
                <OtherLoginOptionLinkSpan><BsGoogle /> Google</OtherLoginOptionLinkSpan>
              </OtherLoginOption>
            </OtherLoginOptions>
            <SignUpContainer>
              <span>Not a member?</span>
              <Link to='/register'>
                <LinkSpan>Sign up now</LinkSpan>
              </Link>
            </SignUpContainer>
          </LoginForm>
        </LoginContainer>
      </LoginWrapper>
  )
}

const LoginWrapper = styled.div`
  background-color: ${props => props.theme.colors.primary};
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  top: 0;
  left: 0;
  height:100%;
  width: 100%;

  ${({ $windowWidth }) =>
    $windowWidth < 600 &&
    css`
      background-color: white;
    `}
`

const LoginContainer = styled.div`
  background-color: white;  
  padding: 8rem 6rem;
  border-radius: 1rem;
  box-shadow: 10px 10px 10px rgba(0, 0, 0, 0.08);
  width: 60rem;
  overflow: hidden;

  ${({ $windowWidth }) =>
    $windowWidth < 600 &&
    css`
      box-shadow: 0px 0px 0px transparent;
    `}
`

const LoginForm = styled.form`
  gap: 4rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const Title = styled.h1`
  font-weight: normal;
`

const SingleInputContainer = styled.div`
  width: 100%;
`

const SubmitButtonContainer = styled.div`
  gap: 1rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 3rem;
`

const ErrorSpan = styled.span`
  color: red;
`

const OtherLoginOptions = styled.div`
  display: flex;
  flex-direction: row;
  gap: 5rem;
`

const OtherLoginOption = styled.a`
  display: flex;
  align-items: center;
  gap: 5px;
  height: 20px;
  font-size: 2rem;
  cursor: default;
`

const OtherLoginOptionLinkSpan = styled.span`
  color: #a4a4a4;
  display: flex;
  align-items: center;
  gap: 0.4rem;
`

const SignUpContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 1rem;
`

const LinkSpan = styled.span`
  color: #0000FF;
  display: flex;
  align-items: center;
  gap: 0.4rem;
`

export default Login