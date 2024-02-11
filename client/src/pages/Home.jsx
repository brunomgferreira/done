import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import homeBackground from '../assets/homeBackground.png'
import homeBackgroundSmall from '../assets/homeBackground_small.png'
import homeBackgroundMedium from '../assets/homeBackground_medium.png'
import Button from '../components/elements/Button'
import { Link } from 'react-router-dom'

const Home = () => {

  const [windowWidth, setWindowWidth] = useState(window.innerWidth)

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [])

  const backgroundImage = windowWidth > 1000 ? homeBackground : windowWidth > 800 ? homeBackgroundMedium : homeBackgroundSmall;

  return (
    <main>
        <Content>
          <Slogan>Simplify your life.</Slogan>
          <ButtonContainer>
            <Link to='/login'>
              <Button
                $content="Login"
                $size="medium"
                $shape="squared"
                $buttonStyle="line"
                $color="white"
                $fontColor="white"
                $animation="color"
              ></Button>
            </Link>
            <Link to='/register'>
              <Button 
                $content="Register"
                $size="medium"
                $shape="squared"
                $buttonStyle="line"
                $color="white"
                $fontColor="white"
                $animation="color"
              ></Button>
            </Link>
          </ButtonContainer>
        </Content>
        <Image src={backgroundImage} />
    </main>
  )
}

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