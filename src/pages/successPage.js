import React, { useState } from 'react';
import Home from '../components/Home';
import { Box } from '@mui/material';
import Header from '../components/header';
import Footer from '../components/footer';
import InputPage from '../components/InputPage';
import Settings from '../components/Settings';

function Success() {
  const [isInputPageOpen, setIsInputPageOpen] = useState(false);
  const [currentView, setCurrentView] = useState('home'); // Add state to manage the current view

  const handleAddClick = () => {
    setIsInputPageOpen(true);
  };

  const handleClose = () => {
    setIsInputPageOpen(false);
  };

  const handleSuccess = () => {
    setIsInputPageOpen(false);
    window.location.reload();
  };

  const handleHomeClick = () => {
    setCurrentView('home'); // Set the current view to 'home'
  };

  const handleSettingsClick = () => {
    setCurrentView('settings'); // Set the current view to 'settings' (if you have a settings component)
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f7f9fc' }}>
      <Header />
      <Box sx={{ mt: '50px', flex: 1 }}> {/* Adjust mt to match the Header height */}
        {currentView === 'home' && <Home />}
        {currentView === 'settings' && <Settings />}
      </Box>
      <Footer 
        onAddClick={handleAddClick}
        onHomeClick={handleHomeClick}
        onSettingsClick={handleSettingsClick}
      />
      <InputPage isOpen={isInputPageOpen} onClose={handleClose} onSuccess={handleSuccess} />
    </Box>
  );
}

export default Success;