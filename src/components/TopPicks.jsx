import React, { useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from "@mui/joy/Typography";
import { supabase } from '../supabase/supabaseClient';
import Button from '@mui/joy/Button';


function TopPicks() {
    const [topPicks, setTopPicks] = React.useState([]);

    useEffect(() => {
        async function fetchTopPicks() {
            try {
                const topPicks = await getTopPicks();
                console.log('logsData fetchTopPicks:', topPicks);

                async function getTopPicks() {
                    try {
                        const { data, error } = await supabase.from('filter_history').select('*,todays_data(*)').eq('entry', true);
                        if (error) {
                            console.error('Query error:', error);
                            throw error;
                        }
                        return data;
                    } catch (error) {
                        console.error('Error occurred in getTopPicks:', error);
                    }
                }

                const updatedTopPicks = topPicks
                .filter((stock) => stock.todays_data.open <= stock.todays_data.close)
                .map((stock) => {
                    const volumeTimes = (stock.todays_data.volume / stock.todays_data.daily_avg_volume).toFixed(2);
                    const topWick = ((stock.todays_data.high - stock.todays_data.close) / stock.todays_data.high) * 100;
                    const redCandle = stock.todays_data.open > stock.todays_data.close;
                    if (redCandle){
                        return {}
                    }
                    let profitProbability = 0;
                    let problalityColor = '';
                    if (volumeTimes < 1.5) {
                        profitProbability = 'Low Volume Today';
                        problalityColor = '#FA7070';
                    } else if (volumeTimes < 2.5) {
                        profitProbability = 'Medium Volume Today';
                        problalityColor = 'orange';
                    } else {
                        profitProbability = 'High Volume Today';
                        problalityColor = '#2EB086';
                    }
                    return { ...stock.todays_data, volumeTimes, topWick, profitProbability, problalityColor };
                });

                setTopPicks(updatedTopPicks);
            } catch (error) {
                console.error('Error fetching CSV:', error);
            }
        }

        fetchTopPicks();
    }, []);


    return (
        <Box sx={{ p: 2, border: '1px grey', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Box sx={{ width: '100%', padding: 2 }}>
                <Typography level='title-lg' align='center'>Breakout Entry Stocks</Typography>
                {topPicks.length === 0 && <Typography variant="h6" align='center' padding={2}>No top picks for today</Typography>}
            </Box>

            <Box sx={{ paddingBottom: 6, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                {topPicks
                    .map((stock, index) => {
                        console.log('inside stock :', stock);
                        return (
                            <Box key={index} sx={{
                                padding: 1, margin: 1, border: '1px solid grey', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', backgroundColor: 'white',
                                borderRadius: '20px 0px 20px 0px',
                            }}>
                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                                    <Typography level="title-md"> {stock.symbol}  </Typography>
                                    <Box sx={{ display: 'flex', flexDirection: 'row', width: 'inherit', justifyContent: 'space-between' }}>
                                        <Typography level="body-sm"> Price: Rs.{stock.close}</Typography>

                                        <Typography level="body-sm"> ChangePct: {stock.change_pct}%</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', flexDirection: 'row', width: 'inherit', justifyContent: 'space-between' }}>
                                        <Typography level="body-sm"> Volume: {stock.volumeTimes}x</Typography>
                                        <Typography level="body-sm"> Wick: {stock.topWick.toFixed(2)}%</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', flexDirection: 'row', width: 'inherit', alignItems: 'center', marginTop: '10px', justifyContent: 'center' }}>
                                        <Button sx={{ backgroundColor: stock.problalityColor, marginRight: '10px' }}>{stock.profitProbability}</Button>
                                        <Button sx={{ marginLeft: '10px' }} onClick={() => window.open(`https://finance.yahoo.com/chart/${stock.symbol}.NS`, '_blank')}>Open  Chart</Button>
                                    </Box>
                                </Box>

                            </Box>
                        )
                    })}
            </Box>
        </Box>
    );
}

export default TopPicks;