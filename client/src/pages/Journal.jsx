import React, { forwardRef, useEffect, useRef, useState } from 'react'
import DOMPurify from 'dompurify';
import Header from '../components/Header'
import styled, {css} from 'styled-components'
import Button from '../components/elements/Button'
import { FiUnderline, FiBold, FiItalic } from 'react-icons/fi'
import { BiStrikethrough } from "react-icons/bi";
import { GrUndo, GrRedo } from "react-icons/gr";
import { CiTextAlignLeft, CiTextAlignRight, CiTextAlignCenter, CiTextAlignJustify } from "react-icons/ci";
import { AiOutlineUnorderedList, AiOutlineOrderedList } from "react-icons/ai";
import { FaLink, FaLinkSlash } from "react-icons/fa6";
import { FiSave } from "react-icons/fi";
import { TbBold, TbBoldOff, TbItalic } from "react-icons/tb";
import { IoSettingsOutline, IoCalendarOutline } from "react-icons/io5"
import axios from 'axios';
import { StatusCodes } from 'http-status-codes'
import DatePicker from 'react-date-picker'
import "../components/elements/DatePicker.css"

const Journal = () => {
  const [todayDate, setTodayDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(sessionStorage.getItem("selectedDate") ? new Date(JSON.parse(sessionStorage.getItem("selectedDate"))) : todayDate);
  const [selectedWeekDay, setSelectedWeekDay] = useState(sessionStorage.getItem("selectedWeekDay") ? JSON.parse(sessionStorage.getItem("selectedWeekDay")) : 0);
  const [journalEntry, setJournalEntry] = useState(null);
  const [currentColor, setCurrentColor] = useState('#000000');
  const [formatBlockValue, setFormatBlockValue] = useState('');
  const [fontSizeValue, setFontSizeValue] = useState('');

  const fetchJournalEntry = async () => {
    const currentJournalEntry = JSON.parse(sessionStorage.getItem("journalEntry"));

    if(currentJournalEntry && currentJournalEntry != "undefined") setJournalEntry(currentJournalEntry);
    else {
      const result = await fetchJournalEntryByDay(getDate(selectedWeekDay));
      if(!result) {
        await createJournalEntry("", getDate(selectedWeekDay));
      }
    }
  };

  useEffect(() => {
    fetchJournalEntry();
  }, []);

  useEffect(() => {
    sessionStorage.removeItem("journalEntry");
    fetchJournalEntry();
  }, [selectedDate, selectedWeekDay])

  const fetchJournalEntryByDay = async (day) => {
    try {
      const jwtToken = localStorage.getItem('token');
      if(!jwtToken) throw new Error;
      const result = await axios.get(`http://localhost:3000/api/v1/journal/day/${day}`, 
      { headers: {Authorization: `Bearer ${jwtToken}`}});
      if (result.status === StatusCodes.OK) {
        sessionStorage.setItem("journalEntry", JSON.stringify(result.data.journalEntry));
        setJournalEntry(result.data.journalEntry);
        return true;
      }
    } catch (error) {
        console.error("There was an error:", error.message);
        return false;
    }
  };

  const createJournalEntry = async (notes, day) => {
    try {
      const jwtToken = localStorage.getItem('token');
      if(!jwtToken) throw new Error;
      const result = await axios.post('http://localhost:3000/api/v1/journal/', 
      { text: notes, date: day },
      { headers: {Authorization: `Bearer ${jwtToken}`}});
      sessionStorage.setItem("journalEntry", JSON.stringify({id: result.data.journalEntryId, notes: notes, date: day}));
      setJournalEntry({id: result.data.journalEntryId, notes: notes, date: day});
    } catch (error) {
        console.log(error);
    }
  };

  const updateJournalEntry = async (id, notes) => {
    try {
      const jwtToken = localStorage.getItem('token');
      if(!jwtToken) throw new Error;
      await axios.patch(`http://localhost:3000/api/v1/journal/${id}`, 
      { text: notes },
      { headers: {Authorization: `Bearer ${jwtToken}`}});
    } catch (error) {
        console.log(error);
    }
  }


  useEffect(() => {
    if(journalEntry) contentRef.current.innerHTML = journalEntry.notes ? journalEntry.notes : 'Lorem, ipsum...';
  }, [journalEntry]);

  const updateSelectedWeekDay = (newValue) => {
    setSelectedWeekDay(newValue);
    sessionStorage.setItem("selectedWeekDay", newValue);
  }

  const updateSelectedDate = (newValue) => {
      setSelectedDate(newValue);
      sessionStorage.setItem("selectedDate", JSON.stringify(newValue));
  }

  const getDate = (day) => {
      const currentDate = new Date(selectedDate);
      currentDate.setDate(selectedDate.getDate() + day);
      return currentDate;
  };

  const contentRef = useRef(null);

  const formatDoc = (cmd, value = null) => {
    if (value) {
      document.execCommand(cmd, false, value);
    } else {
      document.execCommand(cmd);
    }
  };

  const addLink = () => {
    const url = prompt('Insert url');
    formatDoc('createLink', url);
  };

  const handleMouseEnter = () => {
    const a = contentRef.current.querySelectorAll('a');
    a.forEach((item) => {
      item.addEventListener('mouseenter', () => {
        contentRef.current.setAttribute('contenteditable', false);
        item.target = '_blank';
      });
      item.addEventListener('mouseleave', () => {
        contentRef.current.setAttribute('contenteditable', true);
      });
    });
  };

  const handleColorChange = (event) => {
    const newColor = event.target.value;
    setCurrentColor(newColor);
    formatDoc('foreColor', newColor);
  };

  const handleFormatBlockChange = (event) => {
    const newValue = event.target.value;
    setFormatBlockValue(newValue);
    formatDoc('formatBlock', newValue);
  };

  const handleFontSizeChange = (event) => {
    const newValue = event.target.value;
    setFontSizeValue(newValue);
    formatDoc('fontSize', newValue);
  };

  const save = async () => {
    const newContent = contentRef.current.innerHTML;
    await setJournalEntry(async (prevJournalEntry) => { 
      sessionStorage.setItem("journalEntry", JSON.stringify({ ...prevJournalEntry, notes: contentRef.current.innerHTML }));
      updateJournalEntry(prevJournalEntry.id, contentRef.current.innerHTML);
      return { ...prevJournalEntry, notes: contentRef.current.innerHTML };
    });
    contentRef.current.innerHTML = newContent ? newContent : 'Lorem, ipsum...';
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
                      updateSelectedDate(value);
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
                  $content={<GrUndo size={20}/>}
                  $title="Undo"
                  $buttonStyle="roundIcon"
                  $animation="scale"
                  $color="transparent"
                  $fontColor="primary"
                  $onClick={() => formatDoc('undo')}
                ></Button>
                <Button
                  $content={<GrRedo size={20}/>}
                  $title="Redo"
                  $buttonStyle="roundIcon"
                  $animation="scale"
                  $color="transparent"
                  $fontColor="primary"
                  $onClick={() => formatDoc('redo')}
                ></Button>
                <Button
                  $content={<FiBold size={20}/>}
                  $title="Bold"
                  $buttonStyle="roundIcon"
                  $animation="scale"
                  $color="transparent"
                  $fontColor="primary"
                  $onClick={() => formatDoc('bold')}
                ></Button>
                <Button
                  $content={<FiUnderline size={20}/>}
                  $title="Bold"
                  $buttonStyle="roundIcon"
                  $animation="scale"
                  $color="transparent"
                  $fontColor="primary"
                  $onClick={() => formatDoc('underline')}
                ></Button>
                <Button
                  $content={<FiItalic size={20}/>}
                  $title="Italic"
                  $buttonStyle="roundIcon"
                  $animation="scale"
                  $color="transparent"
                  $fontColor="primary"
                  $onClick={() => formatDoc('italic')}
                ></Button>
                <Button
                  $content={<BiStrikethrough size={20}/>}
                  $title="Strike Through"
                  $buttonStyle="roundIcon"
                  $animation="scale"
                  $color="transparent"
                  $fontColor="primary"
                  $onClick={() => formatDoc('strikeThrough')}
                ></Button>
                <Button
                  $content={<CiTextAlignLeft size={20}/>}
                  $title="Justify Left"
                  $buttonStyle="roundIcon"
                  $animation="scale"
                  $color="transparent"
                  $fontColor="primary"
                  $onClick={() => formatDoc('justifyLeft')}
                ></Button>
                <Button
                  $content={<CiTextAlignCenter size={20}/>}
                  $title="Justify Center"
                  $buttonStyle="roundIcon"
                  $animation="scale"
                  $color="transparent"
                  $fontColor="primary"
                  $onClick={() => formatDoc('justifyCenter')}
                ></Button>
                <Button
                  $content={<CiTextAlignRight size={20}/>}
                  $title="Justify Right"
                  $buttonStyle="roundIcon"
                  $animation="scale"
                  $color="transparent"
                  $fontColor="primary"
                  $onClick={() => formatDoc('justifyRight')}
                ></Button>
                <Button
                  $content={<CiTextAlignJustify size={20}/>}
                  $title="Justify Full"
                  $buttonStyle="roundIcon"
                  $animation="scale"
                  $color="transparent"
                  $fontColor="primary"
                  $onClick={() => formatDoc('justifyFull')}
                ></Button>
                <Button
                  $content={<AiOutlineOrderedList size={20}/>}
                  $title="Insert Ordered List"
                  $buttonStyle="roundIcon"
                  $animation="scale"
                  $color="transparent"
                  $fontColor="primary"
                  $onClick={() => formatDoc('insertOrderedList')}
                ></Button>
                <Button
                  $content={<AiOutlineUnorderedList size={20}/>}
                  $title="Insert Unordered List"
                  $buttonStyle="roundIcon"
                  $animation="scale"
                  $color="transparent"
                  $fontColor="primary"
                  $onClick={() => formatDoc('insertUnorderedList')}
                ></Button>
                <Button
                  $content={<FaLink size={20}/>}
                  $title="Add Link"
                  $buttonStyle="roundIcon"
                  $animation="scale"
                  $color="transparent"
                  $fontColor="primary"
                  $onClick={() => addLink()}
                ></Button>
                <Button
                  $content={<FaLinkSlash size={20}/>}
                  $title="Remove Link"
                  $buttonStyle="roundIcon"
                  $animation="scale"
                  $color="transparent"
                  $fontColor="primary"
                  $onClick={() => formatDoc('unlink')}
                ></Button>
                <Select title='Format' value={formatBlockValue} onChange={handleFormatBlockChange}>
                  <option value="" disabled>Format</option>
                  <option value="h1">Heading 1</option>
                  <option value="h2">Heading 2</option>
                  <option value="h3">Heading 3</option>
                  <option value="h4">Heading 4</option>
                  <option value="h5">Heading 5</option>
                  <option value="h6">Heading 6</option>
                  <option value="p">Paragraph</option>
                </Select>
                <Select title='Font Size' value={fontSizeValue} onChange={handleFontSizeChange}>
                  <option value="" disabled>Font size</option>
                  <option value="1">Extra small</option>
                  <option value="2">Small</option>
                  <option value="3">Regular</option>
                  <option value="4">Medium</option>
                  <option value="5">Large</option>
                  <option value="6">Extra Large</option>
                  <option value="7">Big</option>
                </Select>
                <ColorInput title='Text Color' type="color" value={currentColor} onChange={handleColorChange} />
              </ButtonContainerLeft>
              <ButtonContainerRight>
                <Button
                    $content={<FiSave size={26}/>}
                    $title="Save"
                    $buttonStyle="roundIcon"
                    $animation="scale"
                    $color="primary"
                    $fontColor="white"
                    $onClick={() => save()}
                ></Button>
              </ButtonContainerRight>
            </ButtonContainer>
            <TextEditor
              ref={contentRef}
              onMouseEnter={handleMouseEnter}
              contentEditable="true"
              spellCheck="false"
              dangerouslySetInnerHTML={{ __html: contentRef.current ? DOMPurify.sanitize(contentRef.current.innerHTML) : 'Lorem, ipsum...' }}
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
    padding-bottom: 0.4rem;
    padding-top: 0.4rem;
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
    padding-left: 2rem;
    padding-right: 2rem;
`

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;      
  padding: 4rem;
  border: 1px solid ${({theme}) => (theme.colors.grey.main)};
  border-radius: 3rem;
  box-shadow: 5px 5px 5px ${({theme}) => (theme.colors.shadow.main)};
  transition: 0.2s ease-in-out;
  height: 100%;
  max-height: 70vh;
  width: 100%;
  background-color: white;
`

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 4rem;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding-bottom: 2rem;
  border-bottom: 2px solid ${({theme}) => (theme.colors.primary)};
`

const ButtonContainerLeft = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
`

const ButtonContainerRight = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
`

const Select = styled.select`
  background: transparent;
	border: 2px solid ${({ theme }) => theme.colors.primary};;
	border-radius: 2rem;
  padding: 1.2rem;
  font-size: 1.6rem;
	outline: none;
	cursor: pointer;
`

const ColorInput = styled.input`
	border: 1.7rem solid ${(props) => props.value};
  outline: none;
  border-radius: 2rem;
	padding: 0;
	width: 1rem;
	height: 1rem;
	background: #fff;
	cursor: pointer;
`

const TextEditor = styled.div`
  padding: 16px;
	outline: none;
	height: 100%;
  width: 100%;
	overflow: auto;
`

export default Journal