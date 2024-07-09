// InputPage.js
import React, { useState } from 'react';
import { Box, Button, Input, Typography } from '@mui/joy';
import { supabase } from '../supabase/supabaseClient'; // Make sure to import your Supabase client

function InputPage({ isOpen, onClose, onSuccess }) {
  const [stockSymbol, setStockName] = useState('');
  const [buyPrice, setBuyPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const parsedQuantity = parseInt(quantity);
      const parsedBuyPrice = parseFloat(buyPrice);
      const stoploss = parsedBuyPrice - parsedBuyPrice * 0.05;
      const target = parsedBuyPrice + parsedBuyPrice * 0.10;
      const { data, error } = await supabase.auth.getUser();
      if (error) throw error;

      console.log('stockSymbol :', stockSymbol);


      const { data: insertData, error: insertError } = await supabase
        .from('swinglog')
        .insert([
          { symbol: stockSymbol, buy_price: parsedBuyPrice, quantity: parsedQuantity, stoploss, target, user_id: data.user.id },
        ]).select('*');

      if (insertError) throw insertError;
      console.log('insertError :', insertError);
      console.log('insertData :', insertData);


      setMessage(`Added swing trade: ${stockSymbol}`);
      onSuccess();
    } catch (error) {
      console.log('error :', error);
      setMessage(`Failed to add swing trade`);
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
          <Typography level="h4">Insert Record</Typography>
          <Input
            sx={{ mt: 2 }}
            required
            fullWidth
            placeholder="Stock Symbol"
            value={stockSymbol}
            onChange={(e) => setStockName(e.target.value.toUpperCase())}
          />
          <Input
            sx={{ mt: 2 }}
            required
            fullWidth
            placeholder="Buy Price"
            value={buyPrice}
            onChange={(e) => setBuyPrice(e.target.value)}
          />
          <Input
            sx={{ mt: 2 }}
            required
            fullWidth
            placeholder="Quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
          <Button
            sx={{ mt: 2 }}
            type="submit"
            fullWidth
            variant="solid"
            color="neutral"
            disabled={loading}
          >
            {loading ? 'Inserting...' : 'Insert Record'}
          </Button>
          {message && <Typography sx={{ mt: 2 }}>{message}</Typography>}
        </Box>
      </Box>
    </Box>
  );
}

export default InputPage;