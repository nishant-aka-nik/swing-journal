import React from 'react';
import Home from '../components/Home';
import { Box } from '@mui/material';
import Header from '../components/header';
import Footer from '../components/footer';

function Success() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f7f9fc' }}>
      <Header />
      <Box sx={{ mt: '50px', flex: 1 }}> {/* Adjust mt to match the Header height */}
        <Home />
      </Box>
      <Footer />
    </Box>
  );
}

export default Success;