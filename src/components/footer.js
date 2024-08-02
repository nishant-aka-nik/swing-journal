import React from 'react';
import Box from '@mui/material/Box';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

function Footer({ onAddClick, onHomeClick, onSettingsClick, onTopPicksClick }) {
  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 0,
        width: '100%',
        textAlign: 'center',
        zIndex: 1100,
        backgroundColor: 'transparent',
      }}
    >
      <Box sx={{
        marginTop: '10px',
        marginBottom: '10px',
        marginLeft: '15px',
        marginRight: '15px',
        p: 2,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: '20px',
        border: '0.5px solid #c9ccd1',
        backgroundColor: 'white',
      }}>
        <HomeRoundedIcon onClick={onHomeClick} />
        <EmojiEventsIcon onClick={onTopPicksClick} />
        <AddBoxOutlinedIcon onClick={onAddClick} />
        <SettingsRoundedIcon onClick={onSettingsClick} />
      </Box>
    </Box>
  );
}

export default Footer;