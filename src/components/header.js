import React from 'react';
import Box from '@mui/material/Box';
import { supabase } from '../supabase/supabaseClient'; // Make sure to import your Supabase client
import { Typography } from '@mui/joy';
import { useState, useEffect } from 'react';
import Avatar from '@mui/joy/Avatar';
import PixRoundedIcon from '@mui/icons-material/PixRounded';


async function fetchUserData() {
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    if (data?.user?.user_metadata) {
      console.log('data?.user :', data?.user);
      return data.user;
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
}
function Header() {
  const [user, setUser] = useState({});

  useEffect(() => {
    const getUserData = async () => {
      const userData = await fetchUserData();
      if (userData) {
        console.log('userData :', userData);
        setUser(userData);
      }
    };
    getUserData();
  }, []);
  return (
    <Box
      sx={{
        // borderBottom: '1px solid grey',
        position: 'fixed',
        top: 0,
        width: '100%',
        textAlign: 'center',
        zIndex: 1100, // Ensures it stays above other content
        backgroundColor: 'inherit'
      }}
    >
      <Box sx={{
        marginTop: '10px',
        marginBottom: '10px',
        marginLeft: '15px',
        marginRight: '15px',
        p: 1.5,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: '20px',
        border: '0.5px solid #c9ccd1',
        backgroundColor: 'white',
      }}>
        <PixRoundedIcon />
        <Typography level='title-lg'>Home</Typography>
        <Avatar size="sm" variant="outlined" alt="User Avatar" src={user?.user_metadata?.avatar_url} sx={{ ml: 2 }} />
      </Box>
    </Box>
  );
}

export default Header;