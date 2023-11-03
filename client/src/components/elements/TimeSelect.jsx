import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components';

const TimeSelect = ({$options, $onChange, $value, min}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState($value);
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
        <TimeSelectWrapper>
            <TimeSelectContainer
                ref={selectRef}
                min={min}
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
                    $onChange(e.target.value);
                }}
                onBlur={(e) => {
                    setIsOpen(false);
                    e.target.size = 0;
                }}
                >
                {$options.map((option) => {
                // Disable options earlier than the minimum hour
                const optionValue = parseInt(option.props.value);
                const isDisabled = optionValue < min;
                return (
                    <option
                        key={optionValue}
                        value={optionValue}
                        disabled={isDisabled}
                    >
                    {option.props.children}
                    </option>);
                })}
            </TimeSelectContainer>
        {isOpen && <PlaceHolder></PlaceHolder>}
        </TimeSelectWrapper>
    )
}

TimeSelect.propTypes = {
    $options: PropTypes.any,
    $onChange: PropTypes.func,
    $value: PropTypes.number,
    min: PropTypes.number
}

const TimeSelectWrapper = styled.div`
    
`

const TimeSelectContainer = styled.select`
    position: ${({ $isOpen }) => ($isOpen ? "absolute" : "static")};
    top: ${({ $isOpen }) => ($isOpen ? "2rem" : "auto")};
    border: 1px solid ${({theme}) => theme.colors.grey.main};
    background-color: ${({theme}) => theme.colors.grey.light};
    padding: 0.5rem 1rem 0.5rem 1rem;
    border-radius: 4px;
    width: 6rem;

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

export default TimeSelect