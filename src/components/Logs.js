import { Card, CardContent } from '@mui/material';
import Box from '@mui/material/Box';
import { supabase } from '../supabase/supabaseClient';
import { useEffect, useState } from 'react';

import Divider from '@mui/material/Divider';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Typography from "@mui/joy/Typography";


function Logs() {
    const [logs, setLogs] = useState([])
    console.log('logs :', logs);

    useEffect(() => {
        async function fetchData() {
            const logsData = await getLogs();
            setLogs(logsData);
        }

        fetchData();

        async function getLogs() {
            try {
                const { data, error } = await supabase.from('swinglog').select('*,last_traded_price(last_traded_price)');
                if (error) throw error;
                return data;
            } catch (error) {
                console.error('error occurred in getLogs Error: ', error);
            }
        }

    }, []);

    return (

        <Card sx={{
            padding: 1,
            borderRadius: 5,
            background: '#FCEAE3',
            boxShadow: '-5px 4px 9px #3e5b8b, #6c9ff1',
        }}>
            <CardContent orientation='horizontal' sx={{ paddingLeft: 2, paddingTop: 2, paddingBottom: 1 }}>
                <Typography level="h2">Swing Log</Typography>
            </CardContent>

            <Divider variant="middle" />

            {logs.map((stock, index) => (
                <Card key={index} sx={{
                    padding: 1,
                    borderRadius: 5,
                    background: '#FEFBFA',
                    boxShadow: '-5px 4px 9px red, #6c9ff1',
                    marginBottom: 1, // Add some margin between cards
                    marginTop: 1,
                }}>
                    <CardContent orientation='vertical' sx={{ padding: 2, paddingBottom: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'left' }}>
                            <Box >
                                <Typography level="title-md">{stock.stock_name}
                                <Typography level="body-xs"> Rs.{stock.last_traded_price.ltp}</Typography>
                                </Typography>
                            </Box>
                            {/* <Box >
                                <Typography level="body-sm" alignContent={'right'}>LTP: {stock.LTP}</Typography>
                            </Box> */}
                        </Box>
                        <Divider variant="middle" />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography level="body-sm">Stop Loss: {stock.stoploss}</Typography>
                            <Typography level="body-sm">Target: {stock.target}</Typography>

                        </Box>
                        <Divider variant="middle" />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Box sx={{ display: 'flex' }}>
                                <Typography level="body-sm">Buy Price: {stock.buy_price}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'right' }}>
                                <Typography level="body-sm" alignContent={'right'}>Quantity: {stock.quantity}</Typography>
                            </Box>
                        </Box>
                        <Divider variant="middle" />
                        {/* <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography level="body-sm" sx={{ color: stock.DangerZone < 0 ? 'red' : 'green' }}>Profit: Rs. {parseFloat(stock.Profit.toFixed(2))}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex' }}>
                                <Typography level="body-sm" sx={{ color: stock.DangerZone < 0 ? 'red' : 'green' }}>Danger Zone: {parseFloat(stock.DangerZone.toFixed(2))}%</Typography>
                            </Box>
                        </Box> */}

                        {stock.notes && (
                            <Accordion>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1-content"
                                    id="panel1-header"
                                >
                                    <Typography level="body-sm">Notes</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Typography level="body-sm">{stock.notes}</Typography>
                                </AccordionDetails>
                            </Accordion>
                        )}
                    </CardContent>
                    <Divider variant="middle" />
                </Card>
            ))}
        </Card>
    )
}

export default Logs;