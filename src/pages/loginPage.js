import { createClient } from '@supabase/supabase-js'
import { useNavigate } from 'react-router-dom';
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import React, {useEffect} from 'react';


const supabase = createClient('https://yutkfbluvhuoshqgbtxe.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1dGtmYmx1dmh1b3NocWdidHhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTc2OTI5NDEsImV4cCI6MjAzMzI2ODk0MX0.eopTb_b240QiYOvDfsFa0UcXh4c4xHXS9NvU4TdOECc')

function Login() {
    const navigate = useNavigate();

    useEffect(() => {
        supabase.auth.onAuthStateChange(async (event, session) => {
            console.log(session?.user?.role)
    
            if (session?.user?.role === 'authenticated') {
                navigate('/success')
            } else {
                navigate('/')
            }
        })
    }, [navigate])

    return (
        <div className="App">
            <header className="App-header">
                <Auth
                    supabaseClient={supabase}
                    providers={['google']}
                    theme='dark'
                    appearance={{ theme: ThemeSupa }}
                />
            </header>
        </div>
    );
}

export default Login;
