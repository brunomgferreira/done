import React from 'react'
import Header from '../components/Header';
import styled from 'styled-components'

const Profile = () => {
  return (
    <PageWrapper>
        <Header></Header>
        <MainWrapper>
        </MainWrapper>
    </PageWrapper>)
}

const PageWrapper = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
`

const MainWrapper = styled.main`
    max-width: ${({ theme }) => theme.widths.content};
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: column;
    justify-content: center;
    margin-top: 4rem;
    margin-bottom: 4rem;
    gap: 1rem;
    height: 100%;
    width: 100%;
`

export default Profile