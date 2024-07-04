import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import { Typography } from '@mui/material';
import { supabase } from '../supabase/supabaseClient';
import SwingLogCard from './SwingLogCard';



function Home() {
    const [user, setUser] = useState({})
    const navigate = useNavigate();

    useEffect(() => {
        async function getUserData() {
            await supabase.auth.getUser().then((value) => {
                if (value?.data?.user?.user_metadata) {
                    console.log('value?.data?.user :', value?.data?.user);
                    setUser(value.data.user)
                }
            })

        }
        getUserData()
    }, [])

    async function signOutUser(params) {
        await supabase.auth.signOut()
        navigate('/')
    }

    return (
        <Box component="home" sx={{ p: 2, border: '1px grey', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

            {/*header box*/}
            <Box sx={{ p: 2, border: '1px grey', display: 'flex', flexDirection: 'row', alignItems: 'center', width: '100%' }}>
                <Box sx={{ p: 1, border: '1px grey', display: 'flex', alignItems: 'center' }}>
                    <Avatar alt="Remy Sharp" src={user?.user_metadata?.avatar_url} />
                </Box>

                <Box sx={{ p: 1, color: 'white', border: '1px grey', ml: 1 }}>
                    <Typography variant="h5">{user?.user_metadata?.full_name}</Typography>
                </Box>
            </Box>

            {/*data box*/}
            <Box sx={{
                bottom: 0,
                width: '100%',
                padding: 2,
            }}>
                <SwingLogCard />
            </Box>
            

            {/*sign out box*/}
            <Box sx={{
                position: 'absolute',
                bottom: 0,
                width: '100%',
                backgroundColor: 'lightblue',
                padding: 2,
            }}>
                <Button variant="outlined" onClick={() => signOutUser('/')}>Sign Out</Button>
            </Box>
        </Box>
    );
}

export default Home;