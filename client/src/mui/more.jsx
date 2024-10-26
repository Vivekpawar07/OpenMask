import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Report, BlockUser } from '../hooks/reportHook'; 

const mainOptions = ["Report", "Block user"];
const reportOptions = ['Spam', 'Abuse', 'Fake account', 'Other'];

const ITEM_HEIGHT = 48;

export default function LongMenu({currentUserId,userToaction}) {

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [currentOptions, setCurrentOptions] = React.useState(mainOptions);
  const [isReporting, setIsReporting] = React.useState(false); 
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  if (currentUserId === userToaction) {
    if (!mainOptions.includes('delete post')) {
      mainOptions.push('delete post');
    }
  }
  const handleOptionClick = (option) => {

    if (option === "Block user") {
      BlockUser(currentUserId,userToaction);
      handleClose();
    } else if (option === "Report") {
      setIsReporting(true);
      setCurrentOptions(reportOptions);
    } else if (isReporting) {
      Report(currentUserId,userToaction,option);
      handleClose();
      setTimeout(() => {
        setIsReporting(false);
        setCurrentOptions(mainOptions);
      }, 300);
    }
  };

  return (
    <div>
      <IconButton
        aria-label="more"
        id="long-button"
        aria-controls={open ? 'long-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVertIcon className='text-white' />
      </IconButton>
      <Menu
        id="long-menu"
        MenuListProps={{
          'aria-labelledby': 'long-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        slotProps={{
          paper: {
            style: {
              maxHeight: ITEM_HEIGHT * 4.5,
              width: '20ch',
            },
          },
        }}
      >
        {currentOptions.map((option) => (
          <MenuItem 
            key={option} 
            onClick={() => handleOptionClick(option)} 
            sx={{ bgcolor: "#2c2c2c", color: "white" }}
          >
            {option}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}