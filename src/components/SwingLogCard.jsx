import React, { useState, useEffect } from 'react';
import Typography from "@mui/joy/Typography";
import Box from '@mui/joy/Box';
import Accordion from '@mui/joy/Accordion';
import AccordionDetails from '@mui/joy/AccordionDetails';
import AccordionGroup from '@mui/joy/AccordionGroup';
import AccordionSummary from '@mui/joy/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LinearProgress from '@mui/joy/LinearProgress';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import { supabase } from '../supabase/supabaseClient';
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded';
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';
import Divider from '@mui/joy/Divider';


export default function SwingLogCard() {
    const [swingLog, setswingLog] = useState([])
    const [sortCriteria, setSortCriteria] = useState('');
    const [sortedSwingLog, setSortedSwingLog] = useState([]);
    const [totalInvested, settotalInvested] = useState(0);
    const [totalProfit, settotalProfit] = useState(0)
    const [totalProfitPercentage, settotalProfitPercentage] = useState(0)
    const [profitIcon, setprofitIcon] = useState('')
    const [profitColor, setprofitColor] = useState('')

    const deleteSwingLog = async (id) => {
        try {
            const { error } = await supabase
                .from('swinglog')
                .delete()
                .eq('id', id).select('*');
            if (error) throw error;
            setswingLog((prevLogs) => prevLogs.filter(log => log.id !== id));
        } catch (error) {
            console.error('error occurred in deleteSwingLog Error: ', error);
        }
    }

    function getProfitIcon(totalProfit) {
        if (totalProfit > 0) {
            return <ArrowCircleUpIcon color="success" />;
        } else if (totalProfit < 0) {
            return <ArrowCircleDownIcon color="error" />;
        } else {
            return <ArrowCircleDownIcon color="warning" />;
        }
    }

    function getProfitColor(totalProfit) {
        if (totalProfit > 0) {
            return 'green';
        } else if (totalProfit < 0) {
            return 'red';
        } else {
            return 'yellow';
        }
    }

    useEffect(() => {
        async function fetchData() {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                const userId = user ? user.id : null;
                const logsData = await getLogs(userId);

                async function getLogs(userId) {
                    try {
                        //TODO: make table details config based
                        const { data, error } = await supabase.from('swinglog').select('*,todays_data(*)').eq('user_id', userId);
                        if (error) throw error;
                        return data;
                    } catch (error) {
                        console.error('error occurred in getLogs Error: ', error);
                    }
                }

                const updatedSwingLog = logsData.map((stock) => {
                    console.log('stock1111111 :', stock);
                    let progress = 0;

                    const targetPercentage = 5;
                    const stoplossPercentage = 10;

                    const pivot = stock.target - (stock.target * (targetPercentage / 100));

                    const isTarget = stock.todays_data.close >= pivot;
                    const isStoploss = stock.todays_data.close <= pivot;

                    const percentageDiffBetweenCloseAndPivot = ((stock.todays_data.close - pivot) / stock.todays_data.close) * 100;

                    if (isTarget) {
                        progress = (percentageDiffBetweenCloseAndPivot / targetPercentage) * 100;
                    }

                    if (isStoploss) {
                        progress = (percentageDiffBetweenCloseAndPivot / stoplossPercentage) * 100;
                    }

                    const profit = (stock.todays_data.close - stock.buy_price) * stock.quantity
                    const profitPercentage = ((stock.todays_data.close - stock.buy_price) / stock.buy_price) * 100
                    const invested = (stock.buy_price * stock.quantity).toFixed(2)
                    const createdAt = new Date(stock.created_at);
                    const today = new Date();

                    // Set both dates to midnight to avoid time differences
                    createdAt.setHours(0, 0, 0, 0);
                    today.setHours(0, 0, 0, 0);

                    const timeDifference = today - createdAt;
                    const age = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

                    const url = `https://finance.yahoo.com/chart/${stock.symbol}.NS/`;


                    return {
                        ...stock,
                        isTarget,
                        isStoploss,
                        progress,
                        profit,
                        profitPercentage,
                        age,
                        invested,
                        url
                    };
                });


                const totalInvested = updatedSwingLog.reduce((total, log) => total + (log.buy_price * log.quantity), 0);
                const totalCurrentValue = updatedSwingLog.reduce((total, log) => total + (log.todays_data.close * log.quantity), 0);
                const totalProfit = totalCurrentValue - totalInvested
                const totalProfitPercentage = ((totalCurrentValue - totalInvested) / totalInvested) * 100
                settotalInvested(totalInvested.toFixed(2));
                settotalProfit(totalProfit.toFixed(2));
                settotalProfitPercentage(totalProfitPercentage.toFixed(2));
                setprofitIcon(getProfitIcon(totalProfit));
                setprofitColor(getProfitColor(totalProfit));

                setswingLog(updatedSwingLog)
            } catch (error) {
                console.error('Error fetching CSV:', error);
            }
        }

        fetchData();
    }, []);

    useEffect(() => {
        const sortedData = [...swingLog].sort((a, b) => {
            let aValue, bValue;

            switch (sortCriteria) {
                case 'Risk_Reward':
                    aValue = Number(a.Risk_Reward);
                    bValue = Number(b.Risk_Reward);
                    return bValue - aValue;
                case 'profit':
                    aValue = Number(a.profit);
                    bValue = Number(b.profit);
                    return bValue - aValue;
                case 'near_target':
                    aValue = Number(a.progress);
                    bValue = Number(b.progress);
                    return bValue - aValue;
                case 'near_stoploss':
                    aValue = Number(a.progress);
                    bValue = Number(b.progress);
                    return aValue - bValue;
                default:
                    return 0;
            }
        });
        setSortedSwingLog(sortedData);
    }, [swingLog, sortCriteria]);

    return (
        <Box sx={{ p: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Box sx={{ padding: 1, display: 'flex', flexDirection: 'column', width: '100%', alignItems: 'center', marginBottom: 1, borderRadius: '15px', backgroundColor: '#F3F8FF' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', width: '100%' }}>
                    <Typography level="body-sm">Total Profit: <Typography level="title-lg" sx={{ display: 'flex', alignItems: 'center', color: profitColor }}>{totalProfit} ({totalProfitPercentage}%) {profitIcon}</Typography> </Typography>
                    <Typography level="body-sm">Total Invested: <Typography level="title-md" >{totalInvested}</Typography></Typography>
                </Box>
            </Box>

            <Box sx={{ paddingBottom: 1, paddingTop: 1, display: 'flex', justifyContent: 'left', width: '100%', alignItems: 'center', borderBottom: '1px solid grey', borderTop: '1px solid grey' }}>
                <Box sx={{ paddingRight: 1 }}>
                    <Typography level="title-lg">Filters: </Typography>
                </Box>
                <Box sx={{ paddingRight: 1 }}>
                    <Select
                        placeholder="Sort By"
                        size="sm"
                        sx={{ minWidth: 120, maxWidth: 200 }}
                        defaultValue={sortCriteria}
                    >
                        <Option value={'Risk_Reward'} onClick={() => setSortCriteria('Risk_Reward')}>Risk/Reward</Option>
                        <Option value={'profit'} onClick={() => setSortCriteria('profit')}>Profit</Option>
                        <Option value="near_target" onClick={() => setSortCriteria('near_target')}>Near Target</Option>
                        <Option value='near_stoploss' onClick={() => setSortCriteria('near_stoploss')}>Near Stoploss</Option>
                    </Select>
                </Box>
            </Box>

            <Box sx={{ paddingBottom: 5, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                {sortedSwingLog
                    .map((stock, index) => {
                        console.log('stock :', stock);
                        let progress = Math.abs(stock.progress)
                        if (progress > 100) {
                            progress = 100
                        }

                        const progresBarName = stock.isTarget ? 'Near Target' : 'Near Stoploss'
                        const progressBarColor = stock.isTarget ? '#ACE1AF' : '#FA7070'
                        const progressBarValue = stock.isTarget ? parseInt(stock.target) : parseInt(stock.stoploss)


                        const riskReward = ((stock.stoploss - stock.buy_price) / stock.buy_price) * 100
                        const RiskRewardMessage = riskReward > 0 ? 'Reward' : 'Risk'

                        return (
                            <Box key={index} sx={{
                                padding: 1, margin: 1, border: '1px solid grey', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', backgroundColor: 'white',
                                borderRadius: '20px 0px 20px 0px',
                                boxShadow: '0px 3px 2px rgba(0, 0, 0, 0.1)'
                            }}>
                                <Box sx={{ display: 'flex', flexDirection: 'row', width: 'inherit', justifyContent: 'space-between', marginBottom: 1 }}>
                                    <Typography level="title-md">{stock.symbol}
                                        <Typography level="body-xs"> Rs.{stock.todays_data.close} ({stock.todays_data.change_pct}%)</Typography>
                                    </Typography>
                                    <DeleteForeverRoundedIcon sx={{ cursor: 'pointer' }} onClick={() => deleteSwingLog(stock.id)} />
                                </Box>
                                <Box sx={{ display: 'flex', flexDirection: 'row', width: 'inherit', justifyContent: 'space-between' }}>
                                    <Box>
                                        <Typography level="body-sm"> Buy Price: {stock.buy_price}</Typography>
                                    </Box>
                                    <Box>
                                        <Typography level="body-sm" alignContent={'right'}>Invested: {stock.invested} ({stock.quantity}U)</Typography>
                                    </Box>
                                </Box>
                                <Divider />

                                <Box sx={{ display: 'flex', flexDirection: 'row', width: 'inherit', justifyContent: 'space-between' }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Typography level="body-sm" sx={{ color: stock.profit.toFixed(2) < 0 ? 'red' : 'green' }}>
                                            Profit: {stock.profit.toFixed(2)}
                                            <Typography level='body-sm' sx={{ color: stock.profit.toFixed(2) < 0 ? 'red' : 'green' }}> ({stock.profitPercentage.toFixed(2)}%)</Typography>
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex' }}>
                                        <Typography level="body-sm" sx={{ color: riskReward < 0 ? 'red' : 'green' }}>{RiskRewardMessage} {riskReward.toFixed(2)}%</Typography>
                                    </Box>
                                </Box>
                                <Divider />

                                <Box sx={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    width: 'inherit',
                                    justifyContent: 'space-between',
                                    padding: 1
                                }}>
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
                                    <Typography level="body-sm" sx={{ paddingLeft: 1 }}>
                                        {progressBarValue}
                                    </Typography>
                                </Box>

                                <Box sx={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    width: 'inherit',
                                    justifyContent: 'space-between',
                                    padding: 1,
                                    alignItems: 'center'
                                }}>
                                    <Typography level="body-sm">
                                        Age: {stock.age}
                                    </Typography>
                                    <Typography level="body-sm" >
                                        Stoploss: {stock.stoploss.toFixed(0)}
                                    </Typography>
                                    <Typography level="body-sm" >
                                        Target: {stock.target.toFixed(0)}
                                    </Typography>
                                    <Typography level="body-sm" onClick={() => window.open(stock.url)} variant="soft" color="warning" sx={{ cursor: 'pointer' , marginRight: .5}} >
                                        Open Chart
                                    </Typography>
                                </Box>

                                <Box sx={{ display: 'flex', flexDirection: 'row', width: 'inherit', justifyContent: 'space-between' }}>
                                    {stock.note && (
                                        <AccordionGroup size='sm' sx={{ background: '#f0f3f5', borderRadius: 10 }}>
                                            <Accordion>
                                                <AccordionSummary
                                                    expandIcon={<ExpandMoreIcon />}
                                                >
                                                    <Typography level="body-sm">Note</Typography>
                                                </AccordionSummary>
                                                <AccordionDetails>
                                                    <Typography level="body-sm">{stock.note}</Typography>
                                                </AccordionDetails>
                                            </Accordion>
                                        </AccordionGroup>
                                    )}
                                </Box>

                            </Box>
                        )
                    })}
            </Box>
        </Box>
    )

}