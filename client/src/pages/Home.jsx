import React from 'react'
import styled from 'styled-components'
import homeBackground from '../assets/homeBackground.png'
import Button from '../components/elements/Button'
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <main>
        <AuthenticationButtons>
          <Link to='/login'>
            <Button
              $content="Login"
              $size="small"
              $shape="squared"
              $buttonStyle="transparent"
              $color="white"
              $fontColor="white"
              $animation="underline"
            ></Button>
          </Link>
          <Link to='/register'>
            <Button 
              $content="Register"
              $size="small"
              $shape="squared"
              $buttonStyle="transparent"
              $color="white"
              $fontColor="white"
              $animation="underline"
            ></Button>
          </Link>
        </AuthenticationButtons>
        <Content>
          <Slogan>Simplify your life.</Slogan>
          <ButtonContainer>
            <Button
              $content="Book a Demo"
              $size="medium"
              $shape="squared"
              $buttonStyle="line"
              $color="white"
              $fontColor="white"
              $animation="color"
            ></Button>
            <Button 
              $content="Our solutions"
              $size="medium"
              $shape="squared"
              $buttonStyle="line"
              $color="white"
              $fontColor="white"
              $animation="color"
            ></Button>
          </ButtonContainer>
        </Content>
        <Image src={homeBackground} />
    </main>
  )
}

const AuthenticationButtons = styled.div`
  gap: 2rem;
  position: fixed;
  display: flex;
  flex-direction: row;
  top: 1%;
  right: 1%;
`

const Content = styled.div`
  gap: 2rem;
  position: fixed;
  display: flex;
  flex-direction: column;
  top: 30%;
  left: 50%;
  transform: translate(-50%, -50%);
`

const Slogan = styled.h1`
  color: white;
  font-weight: bold;
  text-align: center;
`

const ButtonContainer = styled.div`
  display:flex;
  flex-direction:row;
  justify-content: space-between;
  gap: 2rem;
`

const Image = styled.img`
  z-index: -1;
  height: 100vh;
  object-fit: cover;
  object-position: top;

  /* animation: fadeIn ease 2s;

  @keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  } */
`

export default Home