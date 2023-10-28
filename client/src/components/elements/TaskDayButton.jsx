import React from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'

const DayButton = ({$active, $content}) => {
  return (
    <DayButtonWrapper $active={$active}>{$content}</DayButtonWrapper>
  )
}

DayButton.propTypes = {
  $active: PropTypes.bool,
  $content: PropTypes.string
}

const DayButtonWrapper = styled.button`
  background-color: transparent;
  transition: 0.15s ease-in-out;

  ${({ $active }) =>
    $active &&
    css`
      color: ${({ theme }) => theme.colors.primary};
      font-weight: bold;
    `}

  &:hover {
    transform: scale(1.1);
  }
`

export default DayButton