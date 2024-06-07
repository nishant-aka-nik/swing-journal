import { createClient } from '@supabase/supabase-js'
import { useNavigate } from 'react-router-dom';
import React, {useEffect, useState} from 'react';

const supabase = createClient('https://yutkfbluvhuoshqgbtxe.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1dGtmYmx1dmh1b3NocWdidHhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTc2OTI5NDEsImV4cCI6MjAzMzI2ODk0MX0.eopTb_b240QiYOvDfsFa0UcXh4c4xHXS9NvU4TdOECc')



function Success() {
    const [user, setUser] = useState({})
    const navigate = useNavigate();

    useEffect(() => {
        async function getUserData() {
            await supabase.auth.getUser().then((value) => {
                if (value?.data?.user?.user_metadata?.avatar_url) {
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
      <div className="App">
        <header className="App-header">
            <img src={user?.user_metadata?.avatar_url} alt='User profile' />
            <h1>Hi {user?.user_metadata?.name}</h1>
            <button onClick={() => signOutUser('/')}>Logout</button>
        </header>
      </div>
    );
  }
  
  export default Success;
  