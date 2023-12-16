import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'

const MultiSelector = ({ $options, $defaultOption, $updateSelectedOptions, $selectedOptions }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOptions, setSelectedOptions] = useState($selectedOptions);
    const multiSelectorRef = useRef(null);

    const toggleOption = (option) => {

        if(option === $defaultOption) {
            setSelectedOptions([$defaultOption]);
        }
        else if (selectedOptions.includes(option)) {
            setSelectedOptions((prevState) => prevState.filter((item) => item !== option));
        } else {
            if($selectedOptions.includes($defaultOption)) {
                setSelectedOptions([]);
            }
            setSelectedOptions((prevState) => [...prevState, option]);
        }
        $updateSelectedOptions(selectedOptions);
    };


    useEffect(() => {
        $updateSelectedOptions(selectedOptions);
    }, [selectedOptions]);

    useEffect(() => {
        const handleClickOutside = ({target}) => {
            if(multiSelectorRef.current && !multiSelectorRef.current.contains(target)) setIsOpen(false);
        };

        const handleClickInside = () => {
            if(multiSelectorRef.current) setIsOpen(true);
        };
        
        document.addEventListener('mousedown', handleClickOutside);
        multiSelectorRef.current && multiSelectorRef.current.addEventListener('mousedown', handleClickInside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            multiSelectorRef.current && multiSelectorRef.current.removeEventListener('mousedown', handleClickInside);
        }
    }, [isOpen])

    return (
        <MultiSelectorWrapper ref={multiSelectorRef}>
            <InputField type="text" value={selectedOptions.join(', ')} readOnly onFocus={() => setIsOpen(true)} $defaultOption={$defaultOption}/>
            {isOpen && 
                <OptionsContainer>
                    <Option onClick={() => {toggleOption($defaultOption); setIsOpen(false);}} selected={selectedOptions.includes($defaultOption)}>{$defaultOption}</Option>
                    {$options.map((option) => (
                        <Option key={option} onClick={() => toggleOption(option)} selected={selectedOptions.includes(option)}>{option}</Option>
                    ))}
                </OptionsContainer>
            }
        </MultiSelectorWrapper>
    )
}

MultiSelector.propTypes = {
    $options: PropTypes.array, 
    $defaultOption: PropTypes.string,
    $updateSelectedOptions: PropTypes.func,
    $selectedOptions: PropTypes.array
}

const MultiSelectorWrapper = styled.div`
    position: relative;
    width: 100%;
` 

const InputField = styled.input`
    width: 100%;
    overflow: scroll;
    cursor: pointer;

    ${({value, $defaultOption}) => (
        value == $defaultOption && css`
            color: #616262;
        `
    )}
`

const OptionsContainer = styled.div`
    position: absolute;
    top: 4rem;
    left: 0rem;
    display: flex;
    flex-direction: column;
    align-items: start;
    gap: 0.3rem;
    background-color: white;
    padding: 1rem 1rem 1rem 1rem;
    border: 1px solid ${({theme}) => theme.colors.grey.main};
    border-radius: 1rem;
    z-index: 100;
`

const Option = styled.p`
    display: flex;
    flex-direction: row;
    align-items: center;
    text-align: center;
    padding: 0.5rem 1rem 0.5rem 1rem;
    border-radius: 4px;
    width: 100%;
    cursor: pointer;

    ${({selected}) => (
        !selected && css`
            &:hover{
                background-color: ${({theme}) => theme.colors.grey.main};
            }
        `
    )}

    background-color: ${({ selected }) => (selected ? '#e95420' : 'white')};
    color: ${({ selected }) => (selected ? 'white' : 'black')};
    font-weight: ${({ selected }) => (selected ? 'bold' : 'normal')};
`

export default MultiSelector