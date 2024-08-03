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
                        const { data, error } = await supabase.from('filter_history').select('*').eq('entry', true);
                
                        if (error) {
                            console.error('Query error:', error);
                            throw error;
                        }
                        return data;
                    } catch (error) {
                        console.error('Error occurred in getTopPicks:', error);
                    }
                }

                const updatedTopPicks = topPicks.map((stock) => {
                    const volumeTimes = (stock.volume / stock.daily_avg_volume).toFixed(2);
                    const topWick = ((stock.high - stock.close) / stock.high) * 100;
                    let profitProbability = 0;
                    let problalityColor = '';
                    if (volumeTimes < 1.5) {
                        profitProbability = 'Weak Profit Probability';
                        problalityColor = '#FA7070';
                    } else if (volumeTimes < 2.5) {
                        profitProbability = 'Moderate Profit Probability';
                        problalityColor = 'orange';
                    } else {
                        profitProbability = 'Strong Profit Probability';
                        problalityColor = '#2EB086';
                    }
                    return { ...stock, volumeTimes, topWick, profitProbability, problalityColor };
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
                <Typography level='title-lg' align='center'>Top picks for today 🏆</Typography>
                { topPicks.length === 0 && <Typography variant="h6" align='center' padding={2}>No top picks for today</Typography> }
            </Box>

            <Box sx={{ paddingBottom: 5, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
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
                                    <Box sx={{ display: 'flex', flexDirection: 'column', width: 'inherit', alignItems: 'center', marginTop: '10px' }}>
                                        <Button sx={{ backgroundColor: stock.problalityColor }} onClick={() => window.open(`https://finance.yahoo.com/chart/${stock.symbol}.NS`, '_blank')}>{stock.profitProbability}</Button>
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