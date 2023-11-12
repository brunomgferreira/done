import React, { useEffect, useRef, useState } from 'react'
import styled, { css } from 'styled-components'
import PropTypes from 'prop-types'

const MultiSelector = () => {
  const $options = ["No repeat", "Every Day", "Every Week", "Every Month", "Every Year"];
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");
  const selectRef = useRef(null);

  useEffect(() => {
      if (isOpen && selectRef.current) {
        // Find the selected option and calculate its offset
        const selectedOption = selectRef.current.querySelector('option:checked');
        if (selectedOption) {
          const offset = selectedOption.offsetTop;
    
          // Scroll to the selected option
          selectRef.current.scrollTop = offset;
        }
      }
    }, [isOpen]);

  return (
      <MultiSelectWrapper>
          <MultiSelectContainer
              ref={selectRef}
              $isOpen={isOpen}
              name="select1"
              value={selectedValue}
              onMouseDown={(e) => {
                  setIsOpen(true);
                  e.target.size = 6;
              }}
              onChange={(e) => {                    
                  setSelectedValue(e.target.value);
                  setIsOpen(false);
                  e.target.size = 0;
                  // $onChange(e.target.value);
              }}
              onBlur={(e) => {
                  setIsOpen(false);
                  e.target.size = 0;
              }}
              >
              {$options.map((option) => {
              return (
                  <option
                      key={option}
                      value={option}
                  >
                  {option}
                  </option>);
              })}
          </MultiSelectContainer>
      {/* {isOpen && <PlaceHolder></PlaceHolder>} */}
      </MultiSelectWrapper>
  )
}

MultiSelector.propTypes = {
    $options: PropTypes.any,
    $onChange: PropTypes.func,
    $value: PropTypes.number,
    min: PropTypes.number
}

const MultiSelectWrapper = styled.div`
    
`

const MultiSelectContainer = styled.select`
    /* position: ${({ $isOpen }) => ($isOpen ? "absolute" : "static")}; */
    top: ${({ $isOpen }) => ($isOpen ? "2rem" : "auto")};
    border: 1px solid ${({theme}) => theme.colors.grey.main};
    background-color: ${({theme}) => theme.colors.grey.light};
    padding: 0.5rem 1rem 0.5rem 1rem;
    border-radius: 4px;
    width: 100%;

    & option:hover{
        background-color: ${({theme}) => theme.colors.grey.main};
    }

    & option{
        text-align: center;
        padding: 0.4rem 0 0.4rem 0;
        margin-bottom: 0.2rem;
        border-radius: 4px;
    }
`

const PlaceHolder = styled.div`
    width: 6rem;
    border: 1px solid transparent;
    padding: 0.3rem 1rem 0.3rem 1rem;
`

export default MultiSelector;
