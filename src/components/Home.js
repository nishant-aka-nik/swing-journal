import React from 'react';
import Box from '@mui/material/Box';
import SwingLogCard from './SwingLogCard';

function Home() {
  return (
    <Box sx={{ p: 2, border: '1px grey', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Box sx={{ width: '100%', padding: 2 }}>
        <SwingLogCard />
      </Box>
    </Box>
  );
}

export default Home;