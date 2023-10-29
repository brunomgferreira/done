import React from 'react'
import PropTypes from 'prop-types'
import styled, {css} from 'styled-components'

const Button = ({$onClick, $content, $size, $shape, $buttonStyle, $color, $fontColor, $fontWeight, $animation}) => {
  return (
    <ButtonWrapper
    $onClick={$onClick}
    $size={$size}
    $shape={$shape}
    $buttonStyle={$buttonStyle}
    $color={$color}
    $fontColor={$fontColor}
    $fontWeight={$fontWeight}
    $animation={$animation}
    >{$content}</ButtonWrapper>
  )
}

Button.propTypes = {
  $onClick: PropTypes.func,
  $content: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  $shape: PropTypes.string,
  $buttonStyle: PropTypes.string,
  $size: PropTypes.string,
  $color: PropTypes.string,
  $fontColor: PropTypes.string,
  $fontWeight: PropTypes.string,
  $animation: PropTypes.string,
}

const ButtonWrapper = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  font-weight: bold;

  /* $SIZE */

  ${({ $size }) =>
    $size === 'wide' &&
    css`
      width: 100%;
    `}

  ${({ $size }) =>
    $size === 'mediumWide' &&
    css`
      padding: 2rem 6rem 2rem 6rem;
    `}
    
  ${({ $size }) =>
    $size === 'big' &&
    css`
      width: 39rem;
      font-size: 4rem;
    `}

  ${({ $size }) =>
    $size === 'medium' &&
    css`
      width: 16rem;
      font-size: 1.5rem;
    `}

  ${({ $size }) =>
    $size === 'automatic' &&
    css`
      padding: 4rem 2rem 4rem 2rem;
      font-size: 1.5rem;
      line-height: 0;
    `}

  ${({ $size }) =>
    $size === 'small' &&
    css`
      width: 10rem;
      font-size: 1.3rem;
      line-height: 0;
    `}

  /* $SHAPE */

  ${({ $shape }) =>
    $shape === 'round' &&
    css`
      border-radius: 50px;
    `}

  ${({ $shape }) =>
    $shape === 'squared' &&
    css`
      border-radius: 5px;
    `}

  /* COLOR */

  ${({ $color }) =>
    $color === 'primary' &&
    css`
      background-color: ${({ theme }) => theme.colors.primary};
      color: ${({ theme }) => theme.colors.dark};
    `}

  ${({ $color }) =>
    $color === 'red' &&
    css`
      background-color: ${({ theme }) => theme.colors.red};
      color: ${({ theme }) => theme.colors.dark};
    `}

  ${({ $color }) =>
    $color === 'grey' &&
    css`
      background-color: ${({ theme }) => theme.colors.grey.main};
      color: ${({ theme }) => theme.colors.dark};
    `}

  ${({ $color }) =>
    $color === 'dark' &&
    css`
      background-color: ${({ theme }) => theme.colors.dark};
      color: ${({ theme }) => theme.colors.light};
    `}
  
  ${({ $color }) =>
    $color === 'white' &&
    css`
      background-color: white;
    `}

  /* BUTTON STYLE */

  ${({ $buttonStyle }) =>
    $buttonStyle === 'line' &&
    css`
      background-color: transparent;
      border: 2px solid white;
    `}
  
  ${({ $buttonStyle }) =>
    $buttonStyle === 'transparent' &&
    css`
      background-color: transparent;
      border-bottom: 2px solid transparent;
      border-radius: 0;
    `}

  ${({ $buttonStyle }) =>
    $buttonStyle === 'icon' &&
    css`
      background-color: transparent;
      padding: 0;
    `}
 
  /* FONT COLOR */

  ${({ $fontColor }) => 
    $fontColor === 'white' &&
    css`
      color: white;
    `}
  
  ${({ $fontColor }) => 
    $fontColor === 'primary' &&
    css`
      color: ${({theme}) => theme.colors.primary};
    `}

  /* FONT WEIGHT */

  ${({ $fontWeight }) => 
    $fontWeight === 'bold' &&
    css`
      font-weight: bold;
    `}
  
  ${({ $fontWeight }) => 
    $fontWeight === 'normal' &&
    css`
      font-weight: normal;
    `}

  /* ANIMATION */

  ${({ $animation }) =>
    $animation === 'underline' &&
    css`
      transition: 0.15s ease-in-out;

      &:hover {
        transform: scale(1.1);
        border-bottom: 2px solid white;
      }

      &:active {
        transform: scale(1.02);
      }
    `}

  ${({ $animation }) =>
    $animation === 'scale' &&
    css`
      transition: transform 0.15s ease-in-out;

      &:hover {
        transform: scale(1.1);
      }

      &:active {
        transform: scale(1.02);
      }
    `}

  ${({ $animation }) =>
    $animation === 'smallScale' &&
    css`
      transition: transform 0.15s ease-in-out;

      &:hover {
        transform: scale(1.06);
      }

      &:active {
        transform: scale(1.02);
      }
    `}

  ${({ $animation }) =>
    $animation === 'color' &&
    css`
      transition: background-color 0.15s ease-in-out;

      ${({ $color }) =>
        $color === 'primary' &&
        css`
          &:hover {
            background-color: ${({ theme }) => theme.colors.hover.primary};
          }

          &:active {
            background-color: ${({ theme }) => theme.colors.active.primary};
            transition: background-color 0.05s ease-in-out;
          }
        `}

        ${({ $color }) =>
        $color === 'white' &&
        css`
          transition: 0.05s ease-in-out;

          &:hover {
            background-color: white;
            color: ${({theme}) => theme.colors.primary};
            transform: scale(1.06);
          }

          &:active {
            transform: scale(0.98);
          }
        `}
    `}
`

export default Button