import React, { useEffect, useRef, useState } from 'react'
import { IoMdCheckmark } from 'react-icons/io';
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import Button from '../elements/Button';

const SelectorWithAdd = ({ $options, $defaultOption, $onAdd}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState("");
    const [newOptionName, setNewOptionName] = useState("");
    const [newOptionColor, setNewOptionColor] = useState("#000000");

    const updateNewOptionName = (newValue) => {
        setNewOptionName(newValue);
    };

    const updateNewOptionColor = (newValue) => {
        setNewOptionColor(newValue);
    };


    const SelectorRef = useRef(null);

    const toggleOption = (option) => {
        setSelectedOption(option.name);
        setIsOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = ({target}) => {
            if(SelectorRef.current && !SelectorRef.current.contains(target)) setIsOpen(false);
        };

        const handleClickInside = () => {
            SelectorRef.current && setIsOpen(true);
        };
        
        document.addEventListener('mousedown', handleClickOutside);
        SelectorRef.current && SelectorRef.current.addEventListener('mousedown', handleClickInside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            SelectorRef.current && SelectorRef.current.removeEventListener('mousedown', handleClickInside);
        }
    }, [isOpen])

    return (
        <SelectorWrapper ref={SelectorRef}>
            <InputField type="text" value={selectedOption == "" ? $defaultOption.name : selectedOption} readOnly onFocus={() => setIsOpen(true)} $defaultOption={$defaultOption.name}/>
            {isOpen && 
                <Container>
                    <OptionsContainer>
                        <Option onClick={() => {setSelectedOption([]);setIsOpen(false);}} selected={selectedOption.length == 0}>{$defaultOption.name}<Color $color={$defaultOption.color}></Color></Option>
                        {$options.map((option) => (
                            <Option key={option.name} onClick={() => toggleOption(option)} selected={selectedOption == option.name}>{option.name}<Color $color={option.color}></Color></Option>
                        ))}
                    </OptionsContainer>
                    <AddOptionContainer>
                        <input value={newOptionName} onChange={(e) => updateNewOptionName(e.target.value)} placeholder='New category'/>
                        <ColorPicker value={newOptionColor} onChange={(e) => updateNewOptionColor(e.target.value)} type='color'></ColorPicker>
                        <Button 
                            $content={<IoMdCheckmark size={24}/>}
                            $buttonStyle="icon"
                            $color="transparent"
                            $fontColor="black"
                            $fontWeight="bold"
                            $animation="smallScale"
                            $onClick={() => $onAdd(newOptionName, newOptionColor)}
                        ></Button>
                    </AddOptionContainer>
                </Container>
            }
        </SelectorWrapper>
    )
}

SelectorWithAdd.propTypes = {
    $options: PropTypes.array, 
    $defaultOption: PropTypes.object,
    $onAdd: PropTypes.func
}

const SelectorWrapper = styled.div`
    position: relative;
    padding: 10px 10px;
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

const ColorPicker = styled.input`
    border-radius: 100%;
    width: 15px;
    height: 15px;
    cursor: pointer;
`

const OptionsContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: start;
    gap: 0.3rem;
    width: 100%;
    max-height: 18rem;
    overflow:scroll;
`

const Container = styled.div`
    position: absolute;
    top: 4rem;
    left: 0rem;
    display: flex;
    flex-direction: column;
    align-items: start;
    gap: 0.3rem;
    background-color: white;
    padding: 1rem;
    border: 1px solid ${({theme}) => theme.colors.grey.main};
    border-radius: 1rem;
    z-index: 100;
`

const AddOptionContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
`

const Option = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
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

const Color = styled.div`
    border: 1px solid grey;
    width: 15px;
    height: 15px;
    background-color: ${({$color}) => $color};
`

export default SelectorWithAdd