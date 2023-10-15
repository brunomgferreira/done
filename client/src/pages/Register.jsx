import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import Button from '../components/elements/Button';
import { FcGoogle } from 'react-icons/fc';
import { BsFacebook } from 'react-icons/bs';
import axios from 'axios';
import InputField from '../components/elements/InputField';
import { Link } from 'react-router-dom';

function Register() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstNameErr, setFirstNameErr] = useState('');
  const [lastNameErr, setLastNameErr] = useState('');
  const [emailErr, setEmailErr] = useState('');
  const [passwordErr, setPasswordErr] = useState('');
  const [anotherErr, setAnotherErr] = useState('');

  const clearErrors = () => {
    setFirstNameErr('');
    setLastNameErr('');
    setEmailErr('');
    setPasswordErr('');
    setAnotherErr('');
  }

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    clearErrors();

    try {
      const {data} = await axios.post('http://localhost:3000/api/v1/auth/register', {firstName, lastName, email, password})
      // console.log(data);
    } catch (error) {
      const errors = error.response.data.msg;
      Object.keys(errors).forEach(fieldName => {
        switch (fieldName) {
          case "firstName":
            setFirstNameErr(errors[fieldName].message + "."); 
            break;
          case "lastName":
            setLastNameErr(errors[fieldName].message + "."); 
            break;
          case "email":
            setEmailErr(errors[fieldName].message + "."); 
            break;
          case "password":
            setPasswordErr(errors[fieldName].message + "."); 
            break;
          default:
            setAnotherErr("There was an error, try again later.")
            break;
        }
      });
    }
  }

  return (
    <RegisterWrapper>
        <RegisterContainer>
          <RegisterForm onSubmit={handleSubmit}>
            <Title>Sign up</Title>
              <NameInputContainer>
                <SingleInputContainer>
                  <InputField type="text" name="firstName" placeholder="First Name" onChange={(e) => {setFirstName(e.target.value)}} $err={firstNameErr}/>
                  <ErrorSpan>{firstNameErr}</ErrorSpan>
                </SingleInputContainer>
                <SingleInputContainer>
                  <InputField type="text" name="lastName" placeholder="Last Name" onChange={(e) => {setLastName(e.target.value)}} $err={lastNameErr} />
                  <ErrorSpan>{lastNameErr}</ErrorSpan>
                </SingleInputContainer>
              </NameInputContainer>
            <SingleInputContainer>
              <InputField type="text" name="email" placeholder="Email" onChange={(e) => {setEmail(e.target.value)}} $err={emailErr} />
              <ErrorSpan>{emailErr}</ErrorSpan>
            </SingleInputContainer>
            <SingleInputContainer>
              <InputField type="password" name="password" placeholder="Password" onChange={(e) => {setPassword(e.target.value)}} $err={passwordErr} />
              <ErrorSpan>{passwordErr}</ErrorSpan>
            </SingleInputContainer>
            <SubmitButtonContainer>
              <Button
                $content="Get started"
                $size="wide"
                $shape="squared"
                $color="primary"
                $fontColor="white"
                $animation="scale"
              ></Button>
              <ErrorSpan>{anotherErr}</ErrorSpan> 
            </SubmitButtonContainer>
            <div>
              <span>Or sign up with</span>
            </div>
            <OtherRegisterOptions>
              <OtherRegisterOption href="#">
                <LinkSpan><BsFacebook /> Facebook</LinkSpan>
              </OtherRegisterOption>
              <OtherRegisterOption href="#">
                <LinkSpan><FcGoogle /> Google</LinkSpan>
              </OtherRegisterOption>
            </OtherRegisterOptions>
            <LoginContainer>
              <span>Already a member?</span>
              <Link to='/login'>
                <LinkSpan>Sign in now</LinkSpan>
              </Link>
            </LoginContainer>
          </RegisterForm>
        </RegisterContainer>
      </RegisterWrapper>
  )
}

const RegisterWrapper = styled.div`
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

const RegisterContainer = styled.div`
  background-color: white;  
  padding: 8rem 6rem;
  border-radius: 1rem;
  box-shadow: 10px 10px 10px rgba(0, 0, 0, 0.08);
  width: 60rem;
  overflow: hidden;
`

const RegisterForm = styled.form`
  gap: 4rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const NameInputContainer= styled.div`
  display: flex;
  display: row;
  gap: 2rem;
`

const Title = styled.h1`
  font-weight: normal;
`

const SingleInputContainer = styled.div`
  display:flex;
  flex-direction: column;
  gap: 0px;
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

const OtherRegisterOptions = styled.div`
  display: flex;
  flex-direction: row;
  gap: 5rem;
`

const OtherRegisterOption = styled.a`
  display: flex;
  align-items: center;
  gap: 5px;
  height: 20px;
  font-size: 2rem;
`

const LoginContainer = styled.div`
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

export default Register;
