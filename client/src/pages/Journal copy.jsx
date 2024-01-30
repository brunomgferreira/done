import React, { forwardRef, useEffect, useRef, useState } from 'react'
import DOMPurify from 'dompurify';
import Header from '../components/Header'
import styled from 'styled-components'
import Button from '../components/elements/Button'
import { FiUnderline, FiBold, FiItalic } from 'react-icons/fi'
import { FiSave } from "react-icons/fi";
import { TbBold, TbBoldOff, TbItalic } from "react-icons/tb";
import { IoSettingsOutline, IoCalendarOutline } from "react-icons/io5"
import axios from 'axios';
import { StatusCodes } from 'http-status-codes'
import DatePicker from 'react-date-picker'
import "../components/elements/DatePicker.css"

const Journal = () => {
    const [selectedWeekDay, setSelectedWeekDay] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
  

    const [todayDate, setTodayDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(todayDate);


    const updateSelectedWeekDay = (newValue) => {
        setSelectedWeekDay(newValue);
    }

    const getDate = (day) => {
        const currentDate = new Date();
        currentDate.setDate(selectedDate.getDate() + day);
        return currentDate;
    }


    const [editorContent, setEditorContent] = useState('');

    const makeBold = () => {
      // Get the selected text
      const selectedText = window.getSelection().toString();
  
      if (selectedText) {
        // Sanitize and wrap the selected text with a span with bold style
        const sanitizedText = DOMPurify.sanitize(selectedText);
        const formattedText = editorContent.replace(selectedText, `<span class="bold">${sanitizedText}</span>`);
        setEditorContent(formattedText);
      }
    };  

    return (
    <PageWrapper>
        <Header></Header>
        <SecondHeaderWrapper>
            <SecondHeader>
                <DatePicker 
                    calendarIcon={<IoCalendarOutline size={24}/>}
                    format="dd MMM"
                    value={selectedDate}
                    onChange={(value) => {
                        setSelectedDate(value);
                        updateSelectedWeekDay(0);
                    }}
                />
                <Navbar>
                    {[0, 1, 2, 3, 4, 5, 6, 7].map((day) => 
                        <Button 
                            key={day}
                            $title={getDate(day).toLocaleString('en-UK', { day: 'numeric', month: 'numeric', year:"2-digit" })}
                            $content={(getDate(day).getDate() === todayDate.getDate() && getDate(day).getMonth() === todayDate.getMonth() && getDate(day).getFullYear() === todayDate.getFullYear()) ? "TODAY" : getDate(day).toLocaleDateString('en-US', {weekday: "short"}).toUpperCase()}
                            $buttonStyle="icon"
                            $fontColor={day==selectedWeekDay ? "primary" : "black"}
                            $fontWeight={day==selectedWeekDay ? "bold" : "normal"}
                            $onClick={() => updateSelectedWeekDay(day)}
                            $animation="scale"
                        ></Button>
                    )}
                </Navbar>
            </SecondHeader>
        </SecondHeaderWrapper>
        <MainWrapper>
          <Container>
            <ButtonContainer>
              <ButtonContainerLeft>
                <Button
                    // TbBoldOff
                    $content={<FiUnderline size={26}/>}
                    $title="Underline"
                    $buttonStyle="roundIcon"
                    $animation="scale"
                    $color="transparent"
                    $fontColor="primary"
                    $onClick={() => console.log("Underline")}
                ></Button>
                <Button
                    // TbBoldOff
                    $content={<FiItalic size={26}/>}
                    $title="Italic"
                    $buttonStyle="roundIcon"
                    $animation="scale"
                    $color="transparent"
                    $fontColor="primary"
                    $onClick={() => console.log("Italic")}
                ></Button>
                <Button
                    // TbBoldOff
                    $content={<FiBold size={26}/>}
                    $title="Bold"
                    $buttonStyle="roundIcon"
                    $animation="scale"
                    $color="transparent"
                    $fontColor="primary"
                    $onClick={() => makeBold()}
                ></Button>
              </ButtonContainerLeft>
              <ButtonContainerRight>
                <Button
                    $content={<FiSave size={26}/>}
                    $title="Save"
                    $buttonStyle="roundIcon"
                    $animation="scale"
                    $color="transparent"
                    $fontColor="primary"
                    $onClick={() => console.log("Save")}
                ></Button>
              </ButtonContainerRight>
            </ButtonContainer>
            <TextEditor 
              contentEditable
              placeholder="Type here..."
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(editorContent) }}
              onInput={(e) => setEditorContent(e.currentTarget.innerHTML)}
            >
            </TextEditor>
          </Container>
        </MainWrapper>
    </PageWrapper>)
}

const PageWrapper = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
`

const SecondHeaderWrapper = styled.div`
    background-color: white;
    box-shadow: 10px 10px 10px rgba(0, 0, 0, 0.08);
`

const SecondHeader = styled.div`
    display: flex;
    align-items: center;
    max-width: ${({ theme }) => theme.widths.content};
    margin: 0 auto;
    padding: 2rem;
    gap: 8rem;
`

const Navbar = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    gap: 4rem;
`

const MainWrapper = styled.main`
    max-width: ${({ theme }) => theme.widths.content};
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: column;
    justify-content: center;
    margin-top: 4rem;
    margin-bottom: 4rem;
    gap: 1rem;
    height: 100%;
    width: 100%;
`

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;      
  padding: 4rem;
  border: 1px solid ${({theme}) => (theme.colors.grey.main)};
  border-radius: 3rem;
  box-shadow: 5px 5px 5px ${({theme}) => (theme.colors.shadow.main)};
  transition: 0.2s ease-in-out;
  height: 100%;
  width: 100%;
  background-color: white;
`

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 4rem;
  justify-content: center;
  width: 50%;
  padding-bottom: 2rem;
  border-bottom: 2px solid ${({theme}) => (theme.colors.primary)};
`

const ButtonContainerLeft = styled.div`
  display: flex;
  flex-direction: row;
  gap: 1rem;
`

const ButtonContainerRight = styled.div`
  display: flex;
  flex-direction: row;
  gap: 1rem;
`

const TextEditor = styled.div`
  margin-top: 2rem;
  width: 100%;
  height: 100%;
`

export default Journal