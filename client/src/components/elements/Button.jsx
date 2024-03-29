import React from 'react'
import PropTypes from 'prop-types'
import styled, {css} from 'styled-components'

const Button = ({$onClick, $content, $size, $shape, $buttonStyle, $color, $fontColor, $fontWeight, $animation, $borderColor, $title}) => {
  return (
    <ButtonWrapper
    title={$title}
    onClick={$onClick}
    $size={$size}
    $shape={$shape}
    $buttonStyle={$buttonStyle}
    $color={$color}
    $fontColor={$fontColor}
    $fontWeight={$fontWeight}
    $animation={$animation}
    $borderColor={$borderColor}
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
  $borderColor: PropTypes.string,
  $title: PropTypes.string,
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

  ${({ $color }) =>
    $color === 'transparent' &&
    css`
      background-color: transparent;
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
    $buttonStyle === 'border' &&
    css`
      border: 2px solid white;
      border-radius: 0;
    `}

  ${({ $buttonStyle }) =>
    $buttonStyle === 'icon' &&
    css`
      background-color: transparent;
      padding: 0;
    `}

  ${({ $buttonStyle }) => 
    $buttonStyle === 'roundIcon' &&
    css`
      border: 2px solid ${({theme}) => (theme.colors.primary)};
      padding: 1rem;
      border-radius: 50rem;
    `}
  
  ${({ $buttonStyle }) => 
    $buttonStyle === 'roundText' &&
    css`
      border: 2px solid ${({theme}) => (theme.colors.primary)};
      padding: 1rem 2rem 1rem 2rem;
      border-radius: 50rem;
    `}
  
  ${({ $buttonStyle }) =>
    $buttonStyle === 'text' &&
    css`
      background-color: transparent;
      padding: 1rem 2rem 1rem 2rem;
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

  ${({ $fontColor }) => 
    $fontColor === 'red' &&
    css`
      color: ${({theme}) => theme.colors.red};
    `}

  ${({ $fontColor }) => 
    $fontColor === 'grey' &&
    css`
      color: ${({theme}) => theme.colors.grey.transparent};
    `}

  /* BORDER COLOR */

  ${({ $borderColor }) => 
    $borderColor === 'primary' &&
    css`
      border-color: ${({theme}) => theme.colors.primary};
    `}

  ${({ $borderColor }) => 
    $borderColor === 'white' &&
    css`
      border-color: ${({theme}) => theme.colors.light};
    `}
  
  ${({ $borderColor }) => 
    $borderColor === 'red' &&
    css`
      border-color: ${({theme}) => theme.colors.red};
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

      ${({ $color, $buttonStyle }) =>
        $color === 'white' && $buttonStyle !== 'border' &&
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

      ${({ $color, $buttonStyle }) =>
        $color === 'white' && $buttonStyle === 'border' &&
        css`
          transition: 0.05s ease-in-out;

          &:hover {
            background-color: ${({theme}) => theme.colors.primary};;
            color: ${({theme}) => theme.colors.light};
            transform: scale(1.06);
          }

          &:active {
            transform: scale(0.98);
          }
        `}
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
`

export default Button