import React, { useState, useEffect } from 'react';
import Card from "@mui/material/Card";
import CardContent from "@mui/joy/CardContent";
import Typography from "@mui/joy/Typography";
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import Accordion from '@mui/joy/Accordion';
import AccordionDetails from '@mui/joy/AccordionDetails';
import AccordionGroup from '@mui/joy/AccordionGroup';
import AccordionSummary from '@mui/joy/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LinearProgress from '@mui/joy/LinearProgress';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import { supabase } from '../supabase/supabaseClient';



export default function SwingLogCard() {
    const [swingLog, setswingLog] = useState([])
    const [sortCriteria, setSortCriteria] = useState('Risk_Reward');
    const [sortedSwingLog, setSortedSwingLog] = useState([]);



    useEffect(() => {
        async function fetchData() {
            try {
                const logsData = await getLogs();
                console.log('logsData :', logsData);

                async function getLogs() {
                    try {
                        const { data, error } = await supabase.from('swinglog').select('*,last_traded_price(last_traded_price)');
                        if (error) throw error;
                        return data;
                    } catch (error) {
                        console.error('error occurred in getLogs Error: ', error);
                    }
                }

                const updatedSwingLog = logsData.map((stock) => {
                    console.log('stock1111111 :', stock);
                    let progress = 0;

                    const midValue = stock.target - stock.target * 0.05;

                    const isTarget = stock.last_traded_price.last_traded_price >= midValue;
                    const isStoploss = stock.last_traded_price.last_traded_price <= midValue;

                    const targetPercentage = 5;
                    const stoplossPercentage = 10;

                    const percentageDiffBetweenLTPandMidvalue = ((stock.last_traded_price.last_traded_price - midValue) / stock.last_traded_price.last_traded_price) * 100;

                    if (isTarget) {
                        progress = (percentageDiffBetweenLTPandMidvalue / targetPercentage) * 100;
                    }

                    if (isStoploss) {
                        progress = (percentageDiffBetweenLTPandMidvalue / stoplossPercentage) * 100;
                    }

                    const profit = (stock.last_traded_price.last_traded_price - stock.buy_price) * stock.quantity
                    const profitPercentage = ((stock.last_traded_price.last_traded_price - stock.buy_price) / stock.buy_price) * 100


                    return {
                        ...stock,
                        isTarget,
                        isStoploss,
                        progress,
                        profit,
                        profitPercentage
                    };
                });

                setswingLog(updatedSwingLog)
            } catch (error) {
                console.error('Error fetching CSV:', error);
            }
        }

        fetchData();
    }, []);

    useEffect(() => {
        const sortedData = [...swingLog].sort((a, b) => {
            if (sortCriteria === 'Risk_Reward') {
                return b.Risk_Reward - a.Risk_Reward;
            } else if (sortCriteria === 'profit') {
                return b.Profit - a.Profit;
            } else if (sortCriteria === 'near_target') {
                return (b.progress - a.progress);
            } else if (sortCriteria === 'near_stoploss') {
                return (a.progress - b.progress);
            }
            return 0;
        });
        setSortedSwingLog(sortedData);
    }, [swingLog, sortCriteria]);

    return (

        <Card sx={{
            padding: 1,
            borderRadius: 5,
            background: '#FCEAE3',
            boxShadow: '-5px 4px 9px #3e5b8b, #6c9ff1',
        }}>
            <CardContent orientation='horizontal' sx={{ paddingLeft: 2, paddingTop: 2, paddingBottom: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                    <Box>
                        <Typography level="h2">Swing Log</Typography>
                    </Box>

                    <Box sx={{ paddingRight: 2 }}>
                        <Select
                            placeholder="Sort By"
                            size="sm"
                            defaultValue={sortCriteria}
                        >
                            <Option value={'Risk_Reward'} onClick={() => setSortCriteria('Risk_Reward')}>Risk/Reward</Option>
                            <Option value={'profit'} onClick={() => setSortCriteria('profit')}>Profit</Option>
                            <Option value="near_target" onClick={() => setSortCriteria('near_target')}>Near Target</Option>
                            <Option value='near_stoploss' onClick={() => setSortCriteria('near_stoploss')}>Near Stoploss</Option>

                        </Select>
                    </Box>

                </Box>
            </CardContent>

            <Divider variant="middle" />

            {sortedSwingLog
                .map((stock, index) => {
                    console.log('stock :', stock);
                    const progress = Math.abs(stock.progress)

                    const progresBarName = stock.isTarget ? 'Near Target' : 'Near Stoploss'
                    const progressBarColor = stock.isTarget ? '#ACE1AF' : '#FA7070'

                    const riskReward = ((stock.stoploss - stock.buy_price) / stock.buy_price) * 100
                    console.log('riskReward :', riskReward);
                    const RiskRewardMessage = riskReward > 0 ? 'Reward' : 'Risk'
                    console.log('RiskRewardMessage :', RiskRewardMessage);

                    return (
                        <Card key={index} sx={{
                            padding: 1,
                            borderRadius: 5,
                            background: '#FEFBFA',
                            boxShadow: '-5px 4px 90px red, #6c9ff1',
                            margin: '8px',
                        }}>
                            <CardContent orientation='vertical' sx={{ padding: 2, paddingBottom: 3 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'left' }}>
                                    <Box >
                                        <Typography level="title-md">{stock.symbol}
                                            <Typography level="body-xs"> Rs.{stock.last_traded_price.last_traded_price}</Typography>
                                        </Typography>
                                    </Box>
                                    {/* <Box >
                                <Typography level="body-sm" alignContent={'right'}>LTP: {stock.last_traded_price.last_traded_price}</Typography>
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
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Typography level="body-sm" sx={{ color: riskReward < 0 ? 'red' : 'green' }}>
                                            Profit: Rs. {stock.profit.toFixed(2)}
                                            <Typography level='body-sm' sx={{ color: riskReward < 0 ? 'red' : 'green' }}> ({stock.profitPercentage.toFixed(2)})%</Typography>
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex' }}>
                                        <Typography level="body-sm" sx={{ color: riskReward < 0 ? 'red' : 'green' }}>{RiskRewardMessage}: {riskReward.toFixed(2)}%</Typography>
                                    </Box>
                                </Box>

                                <Box sx={{
                                    position: 'relative', width: '100%', paddingTop: 2, display: 'flex',
                                    alignItems: 'center'
                                }}>
                                    <Typography level="body-sm" sx={{ paddingRight: 2 }}>
                                        Age: {stock.age}
                                    </Typography>
                                    <LinearProgress

                                        size="lg"
                                        variant="soft"
                                        determinate
                                        value={progress}
                                        thickness={15}
                                        // color= {progressBarColor}
                                        sx={{ color: progressBarColor }}
                                    >

                                        <Typography level="title-sm" sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                                            {progresBarName}
                                        </Typography>
                                    </LinearProgress>
                                </Box>

                                <Box sx={{ paddingTop: 2 }}>
                                    {stock.Note && (
                                        <AccordionGroup size='sm' sx={{ background: '#f0f3f5', borderRadius: 10 }}>
                                            <Accordion>
                                                <AccordionSummary
                                                    expandIcon={<ExpandMoreIcon />}
                                                >
                                                    <Typography level="body-sm">Notes</Typography>
                                                </AccordionSummary>
                                                <AccordionDetails>
                                                    <Typography level="body-sm">{stock.Note}</Typography>
                                                </AccordionDetails>
                                            </Accordion>
                                        </AccordionGroup>
                                    )}
                                </Box>

                            </CardContent>
                        </Card>
                    )
                })}
        </Card>
    )

}