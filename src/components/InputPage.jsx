// InputPage.js
import React, { useState } from 'react';
import { Box, Button, Input, Typography, Textarea } from '@mui/joy';
import { supabase } from '../supabase/supabaseClient'; // Make sure to import your Supabase client
import Switch from '@mui/joy/Switch';


function InputPage({ isOpen, onClose, onSuccess }) {
    const [stockSymbol, setStockName] = useState('');
    const [buyPrice, setBuyPrice] = useState('');
    const [quantity, setQuantity] = useState('');
    const [note, setNote] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [longPosition, setLongPosition] = React.useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const parsedQuantity = parseInt(quantity);
            const parsedBuyPrice = parseFloat(buyPrice);
            const stoploss = parsedBuyPrice - (parsedBuyPrice * 0.10);
            const target = parsedBuyPrice + (parsedBuyPrice * 0.05);
            const { data, error } = await supabase.auth.getUser();
            if (error) throw error;

            const { data: newData, error: insertError } = await supabase
                .from('swinglog')
                .insert([
                    { symbol: stockSymbol, buy_price: parsedBuyPrice, quantity: parsedQuantity, stoploss, target, user_id: data.user.id, note, long_position: longPosition },
                ]).select('*');

            if (insertError) throw insertError;

            setMessage(`Last added ${stockSymbol} for Rs.${buyPrice*quantity}`);
            setStockName('');
            setBuyPrice('');
            setQuantity('');
            setNote('');
            setLongPosition(false);
            onSuccess(newData);
        } catch (error) {
            let extraMessage;
            if (error.details.includes("Key is not present in table")) {
                extraMessage = "stock symbol is incorrect please check the stock symbol"
            }
            setMessage(`Failed to add ${stockSymbol}, ${extraMessage}`);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <Box
            sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1200,
            }}
            onClick={onClose}
        >
            <Box
                sx={{
                    width: '80%',
                    maxWidth: '500px',
                    backgroundColor: 'white',
                    padding: '20px',
                    borderRadius: '10px',
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                    <Typography level="h4">Add trade</Typography>
                    <Input
                        sx={{ mt: 2 }}
                        required
                        fullwidth
                        placeholder="Stock Symbol"
                        value={stockSymbol}
                        onChange={(e) => setStockName(e.target.value.toUpperCase())}
                    />
                    <Input
                        sx={{ mt: 2 }}
                        required
                        fullwidth
                        placeholder="Buy Price"
                        value={buyPrice}
                        onChange={(e) => setBuyPrice(e.target.value)}
                    />
                    <Input
                        sx={{ mt: 2 }}
                        required
                        fullwidth
                        placeholder="Quantity"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                    />
                    <Textarea
                        minRows={2}
                        sx={{ mt: 2 }}
                        required
                        fullWidth
                        placeholder="Note"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                    />
                    <Switch
                        sx={{ mt: 2 }}
                        checked={longPosition}
                        onChange={(event) => setLongPosition(event.target.checked)}
                        color={'primary'}
                        endDecorator={longPosition ? 'Long Term' : 'Short Term'}
                    />
                    <Button
                        sx={{ mt: 2 }}
                        type="submit"
                        fullWidth
                        variant="solid"
                        color="neutral"
                        disabled={loading}
                    >
                        {loading ? 'Adding...' : 'Add trade'}
                    </Button>
                    {message && <Typography sx={{ mt: 2 }}>{message}</Typography>}
                </Box>
            </Box>
        </Box>
    );
}

export default InputPage;