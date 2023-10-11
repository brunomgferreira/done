import React from 'react';
import styled from 'styled-components';
import Button from '../components/elements/Button';
import { FcGoogle } from 'react-icons/fc';
import { BsFacebook } from 'react-icons/bs';

function Signup() {
  return (
    <SignupWrapper>
        <SignupContainer>
          <SignupForm>
            <Title>Sign up</Title>
            <SingleInputContainer>
              <InputField type="text" name="firstName" placeholder="First Name" />
              <InputField type="text" name="lastName" placeholder="Last Name" />
            </SingleInputContainer>
            <SingleInputContainer>
              <InputField type="text" name="email" placeholder="Email" />
            </SingleInputContainer>
            <SingleInputContainer>
              <InputField type="password" name="password" placeholder="Password" />
            </SingleInputContainer>
            <RememberMeContainer>
              <input type="checkbox" name="remember-me"/>
              <label>Remember me</label>
            </RememberMeContainer>
            <Button
              $content="Get started"
              $size="wide"
              $shape="squared"
              $color="primary"
              $fontColor="white"
              $animation="scale"
            ></Button>
            <div>
              <span>Or sign up with</span>
            </div>
            <OtherSignupOptions>
              <OtherSignupOption href="#">
                <BsFacebook />
                Facebook
              </OtherSignupOption>
              <OtherSignupOption href="#">
                <FcGoogle />
                Google
              </OtherSignupOption>
            </OtherSignupOptions>
            <SignUpContainer>
              <span>Already a member?</span>
              <a href="#">Sign in now</a>
            </SignUpContainer>
          </SignupForm>
        </SignupContainer>
      </SignupWrapper>
  )
}

const SignupWrapper = styled.div`
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

const SignupContainer = styled.div`
  background-color: white;  
  padding: 8rem 6rem;
  border-radius: 1rem;
  box-shadow: 10px 10px 10px rgba(0, 0, 0, 0.08);
  width: 60rem;
  overflow: hidden;
`

const SignupForm = styled.form`
  gap: 4rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const Title = styled.h1`
  font-weight: normal;
`

const SingleInputContainer = styled.div`
  display:flex;
  gap: 20px;
  width: 100%;
`

const InputField = styled.input`
  border: 1px solid transparent;
  border-bottom: 1px solid rgba(0,0,0,0.2);
  padding: 18px 18px;
  width: 100%;  

  &:focus {
    border: 1px solid rgba(0,0,0,0.2);
    border-radius: 5px; 
  }
`

const RememberMeContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: start;
  gap: 1rem;
`

const OtherSignupOptions = styled.div`
  display: flex;
  flex-direction: row;
  gap: 5rem;
`

const OtherSignupOption = styled.a`
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

export default Signup;
