import Box from '@mui/material/Box';


function Footer() {
    return (
        <Box component="section" sx={{
            position: 'absolute',
            bottom: 0,
            width: '100%',
            backgroundColor: 'lightblue',
            padding: 2,
        }}>
            Made in china
        </Box>
    );
}

export default Footer;