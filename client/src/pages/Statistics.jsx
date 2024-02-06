import React, { useState } from 'react'
import Header from '../components/Header';
import styled from 'styled-components'
import Button from '../components/elements/Button';

const Statistics = () => {
  const [selectedOption, setSelectedOption] = useState(0);



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
                    $onClick={() => setSelectedOption(0)}
                    $animation="scale"
                ></Button>
                <Button
                    $title={"Week"}
                    $content={"WEEK"}
                    $buttonStyle="icon"
                    $fontColor={selectedOption === 1 ? "primary" : "black"}
                    $fontWeight={selectedOption === 1 ? "bold" : "normal"}
                    $onClick={() => setSelectedOption(1)}
                    $animation="scale"
                ></Button>
                <Button
                    $title={"Month"}
                    $content={"MONTH"}
                    $buttonStyle="icon"
                    $fontColor={selectedOption === 2 ? "primary" : "black"}
                    $fontWeight={selectedOption === 2 ? "bold" : "normal"}
                    $onClick={() => setSelectedOption(2)}
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
                    $onClick={() => console.log("Month")}
                    $animation="scale"
                ></Button>
              </NavbarButtonContainer>    
            </Navbar>
          </SecondHeader>
        </SecondHeaderWrapper>
        <MainWrapper>
          <UpperWrapper>
            <UpperLeftWrapper>
              <Container>
                58 tasks per day on average
              </Container>
              <Container>
                58 tasks done per day on average
              </Container>
              <Container>
                58 overdue tasks per day on average
              </Container>
              <Container>
                2:40min time overdue on average
              </Container>
            </UpperLeftWrapper>
            <UpperRightWrapper>
              <UpperRightLeftInnerWrapper>
                <Container>
                  PIE CHART
                </Container>  
              </UpperRightLeftInnerWrapper>
              <UpperRightRightInnerWrapper>
                <Container>
                  300 tasks done
                </Container>
                <Container>
                  20 overdue tasks done
                </Container>
              </UpperRightRightInnerWrapper>
            </UpperRightWrapper>
          </UpperWrapper>
          <LowerWrapper>
            <Container>
              LINE CHART
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
    gap: 2rem;
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
  width: 100%;
  height: 100%;
`

const UpperRightRightInnerWrapper = styled.div`
  gap: 1rem;
  display: flex;
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
  align-items: center;
  gap: 1rem;      
  padding: 1.5rem;
  border: 1px solid ${({theme}) => (theme.colors.grey.main)};
  border-radius: 3rem;
  box-shadow: 5px 5px 5px ${({theme}) => (theme.colors.shadow.main)};
  transition: 0.2s ease-in-out;
  height: 100%;
  max-height: 70vh;
  width: 100%;
  background-color: white;
`

export default Statistics