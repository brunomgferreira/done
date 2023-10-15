import React from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'

function InputField({type, name, placeholder, $err, onChange}) {
  return (
    <Input
        type={type} 
        name={name} 
        placeholder={placeholder}
        onChange={onChange}
        $err={$err}
    />
  )
}

InputField.propTypes = {
    type: PropTypes.string,
    name: PropTypes.string,
    placeholder: PropTypes.string,
    onChange: PropTypes.func,
    $err: PropTypes.string,
}

const Input = styled.input`
  border: 1px solid transparent;
  border-bottom: 1px solid rgba(0,0,0,0.2);
  padding: 18px 18px;
  width: 100%;  
  transition: 0.2s;

  ${({ $err }) =>
    $err &&
    css`
      border: 1px solid rgba(255, 0, 0, 0.474);
      border-radius: 5px;
    `}

  &:focus {
    border: 1px solid rgba(0,0,0,0.2);
    border-radius: 5px; 
  }
`

export default InputField