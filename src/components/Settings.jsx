import React from 'react';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';

function Settings() {
  return (
    <Box sx={{ p: 2, border: '1px grey', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Box sx={{ width: '100%', padding: 2 }}>
       <Typography variant="h5" align='center'>Settings</Typography>
      </Box>
    </Box>
  );
}

export default Settings;