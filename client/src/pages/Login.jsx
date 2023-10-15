import React, { useState } from 'react';
import styled from 'styled-components';
import Button from '../components/elements/Button';
import { FcGoogle } from 'react-icons/fc';
import { BsFacebook } from 'react-icons/bs';
import axios from 'axios';
import InputField from '../components/elements/InputField';
import { Link } from 'react-router-dom'

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const clearError = () => {
    setError('');
  }

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    clearError();

    try {
      const {data} = await axios.post('http://localhost:3000/api/v1/auth/login', {email, password})
      console.log(data);
    } catch (error) {
      const err = error.response.data.msg + ".";
      setError(err);
    }
  }

  return (
      <LoginWrapper>
        <LoginContainer>
          <LoginForm onSubmit={handleSubmit}>
            <Title>Sign in</Title>
            <SingleInputContainer>
              <InputField type="text" name="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} $err={error} />
            </SingleInputContainer>
            <SingleInputContainer>
              <InputField type="password" name="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} $err={error}/>
            </SingleInputContainer>
            <RememberMeContainer>
              <input type="checkbox" name="remember-me"/>
              <label>Remember me</label>
            </RememberMeContainer>
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
                <LinkSpan><BsFacebook /> Facebook</LinkSpan>
              </OtherLoginOption>
              <OtherLoginOption href="#">
                <LinkSpan><FcGoogle /> Google</LinkSpan>
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
`

const LoginContainer = styled.div`
  background-color: white;  
  padding: 8rem 6rem;
  border-radius: 1rem;
  box-shadow: 10px 10px 10px rgba(0, 0, 0, 0.08);
  width: 60rem;
  overflow: hidden;
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
`

const ErrorSpan = styled.span`
  color: red;
`

const RememberMeContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: start;
  gap: 1rem;
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