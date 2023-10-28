import React from 'react'
import PropTypes from 'prop-types'
import {BsArrowReturnLeft, BsCheckLg} from 'react-icons/bs';
import styled from 'styled-components';

const TaskBtn = ({$active}) => {
  return (
    <TaskBtnWrapper $active={$active}>
      {$active ? <BsCheckLg size={26} /> : <BsArrowReturnLeft size={22} />}
    </TaskBtnWrapper>
  )
}

TaskBtn.propTypes = {
  $active: PropTypes.bool,
}

const TaskBtnWrapper = styled.button`
  background-color: transparent;
  height: 2rem;
  width: 2rem;

  &:hover {
    transform: scale(1.1);
  }

  &:active {
    transform: scale(1.02);
  }
`

export default TaskBtn;