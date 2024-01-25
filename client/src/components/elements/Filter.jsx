import React, { useState } from 'react'
import { IoMdClose } from "react-icons/io"
import { FiPlus } from 'react-icons/fi'
import { HiOutlineTrash } from 'react-icons/hi2'
import styled, { css } from 'styled-components'
import PropTypes from 'prop-types'
import axios from 'axios'
import Button from './Button'

const Filter = ({ $id, $name, $color, $isFiltersOpen, $isSelected, $updateSelectedCategory, $onDelete }) => {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <Container
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      $isSelected={$isSelected}
    >
      <FilterColor $color={$color}></FilterColor>
      <FilterName $isSelected={$isSelected}>{$name}</FilterName>
      {(isHovering || $isFiltersOpen) &&
        <Button 
          $content={$isSelected ? <IoMdClose size={18}/> : <FiPlus size={18}/> }
          $buttonStyle="icon"
          $fontColor={$isSelected ? "primary" : "grey"}
          $fontWeight={"normal"}
          $onClick={() => $updateSelectedCategory()}
          $animation="scale"
        ></Button>
      }
      {($isFiltersOpen && ($id !== 1)) &&
        <Button 
          $content={<HiOutlineTrash size={18}/> }
          $buttonStyle="icon"
          $fontColor={$isSelected ? "primary" : "grey"}
          $fontWeight={"normal"}
          $onClick={() => $onDelete()}
          $animation="scale"
        ></Button>
      }
    </Container>
  )
}

Filter.propTypes = {
  $id: PropTypes.number,
  $name: PropTypes.string,
  $color: PropTypes.string,
  $isFiltersOpen: PropTypes.bool,
  $isSelected: PropTypes.bool,
  $updateSelectedCategory: PropTypes.func,
  $onDelete: PropTypes.func,
}

const Container = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    font-size: 1.4rem;
    gap: 1rem;
    padding: 0.5rem 1rem 0.5rem 1rem;
    border: 2px solid ${  ({theme}) => (theme.colors.primary)};
    border-radius: 3rem;
    box-shadow: 5px 5px 5px ${({theme}) => (theme.colors.shadow.main)};
    transition: 0.2s ease-in-out;
    background-color: transparent;
    cursor: pointer;

    &:hover {
      scale: 1.1;
    }

    ${({ $isSelected }) =>
    !$isSelected &&
    css`
      border-color: ${({ theme }) => theme.colors.grey.main};
    `}
`

const FilterColor = styled.div`
  width: 1rem;
  height: 1rem;
  border-radius: 1rem;

  ${({ $color }) =>
    css`
      background-color: ${$color};
    `}
`

const FilterName = styled.p`
  ${({ $isSelected }) =>
    $isSelected &&
    css`
      color: ${({ theme }) => theme.colors.primary};
      font-weight: bold;
    `}
`

export default Filter