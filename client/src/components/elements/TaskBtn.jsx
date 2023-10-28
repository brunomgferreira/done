import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components';
import { FiCheckCircle, FiCircle } from 'react-icons/fi';

const TaskBtn = ({$active}) => {
  return (
    <TaskBtnWrapper $active={$active}>
      {$active ? <FiCircle size={26} /> : <FiCheckCircle size={22} />}
    </TaskBtnWrapper>
  )
}

TaskBtn.propTypes = {
  $active: PropTypes.bool,
}

const TaskBtnWrapper = styled.button`
  display: flex;
  align-items: center;
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