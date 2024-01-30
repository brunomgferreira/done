import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

const Header = () => {
  return (
    <HeaderWrapper>
      <Container>
        <NavbarLink to='/tasks'>
          <Logo>done.</Logo>  
        </NavbarLink>
        <Navbar>
          <NavbarLink to='/tasks'>Tasks</NavbarLink>
          {/* <NavbarLink to='/schedule'>Schedule</NavbarLink>
          <NavbarLink to='/finances'>Finances</NavbarLink>
          <NavbarLink to='/profile'>Profile</NavbarLink> */}
          <NavbarLink to='/journal'>Journal</NavbarLink>
          <NavbarLink to='/stats'>Statistics</NavbarLink>
        </Navbar>
      </Container>
    </HeaderWrapper>
  )
}

const HeaderWrapper = styled.div`
  background-color: ${props => props.theme.colors.primary};
  box-shadow: 10px 10px 10px rgba(0, 0, 0, 0.08);
`

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: ${({ theme }) => theme.widths.content};
  margin: 0 auto;
  padding: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 4rem;
  }
`

const Logo = styled.h1`
  font-size: 6rem;
  color: white;
`

const Navbar = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 4rem;
`

const NavbarLink = styled(Link)`
  padding: 1rem;
  color: ${({ theme }) => theme.colors.light};
  transition: transform 0.15s ease-in-out;
  font-weight:bold;

  &:hover {
    transform: scale(1.1);
  }
`

export default Header