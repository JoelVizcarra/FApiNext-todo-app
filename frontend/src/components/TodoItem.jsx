import React from 'react';
import PropTypes from 'prop-types';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

const TodoItem = ({ id, text, completed, onEdit, onDelete, onToggle }) => {
  return (
    <ListItem
      secondaryAction={
        <IconButton
          data-id={id}
          edge="end"
          aria-label="delete"
          onClick={onDelete}
        >
          <DeleteIcon />
        </IconButton>
      }
    >
      <IconButton data-id={id} aria-label="toggle" onClick={onToggle}>
        {completed ? <CheckCircleIcon /> : <CancelIcon />}
      </IconButton>
      <ListItemText primary={text} sx={{ ml: 1 }} />
    </ListItem>
  );
};

TodoItem.propTypes = {
  id: PropTypes.number,
  text: PropTypes.string,
  completed: PropTypes.bool,
};

export default TodoItem;
