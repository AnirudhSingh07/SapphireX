import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Chip, Stack } from '@mui/material';
import { useStateContext } from '../context/Index';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const { connect, account, tkn1price, tkn2price, setTkn1price, setTkn2price } = useStateContext();
    const navigate = useNavigate();

    const tkn1priceSet = [602, 604, 600, 610, 605];
    const tkn2priceSet = [301, 304, 301, 295, 300];

    // Shorten wallet address
    const displayAddress = (address) => `${address.slice(0, 6)}...${address.slice(-4)}`;

    // Animate token prices
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => {
                const next = (prev + 1) % tkn1priceSet.length;
                setTkn1price(tkn1priceSet[next]);
                setTkn2price(tkn2priceSet[next]);
                return next;
            });
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <AppBar position="static" sx={{ backgroundColor: '#121212', px: 3 }}>
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                
                {/* Logo / Title */}
                <Typography variant="h5" sx={{ color: '#FFFFFF', fontWeight: '700', cursor: 'pointer' }} onClick={() => navigate('/')}>
                    SapphireX
                </Typography>

                {/* Token Prices */}
                <Stack direction="row" spacing={2} alignItems="center">
                    <Chip label={`TKN1: ${tkn1price}`} sx={{ backgroundColor: '#1F1F1F', color: '#00FF7F', fontWeight: 'bold' }} />
                    <Chip label={`TKN2: ${tkn2price}`} sx={{ backgroundColor: '#1F1F1F', color: '#00FF7F', fontWeight: 'bold' }} />
                </Stack>

                {/* Navigation Buttons */}
                <Stack direction="row" spacing={2} alignItems="center">
                    <Button variant="text" sx={{ color: '#EAEAEA' }} onClick={() => navigate('lend')}>
                        Lend
                    </Button>
                    <Button variant="text" sx={{ color: '#EAEAEA' }} onClick={() => navigate('loan')}>
                        Loan
                    </Button>
                    <Button variant="text" sx={{ color: '#EAEAEA' }} onClick={() => navigate('')}>
                        Dashboard
                    </Button>
                </Stack>

                {/* Connect Wallet Button */}
                <Box>
                    <Button
                        variant="contained"
                        onClick={connect}
                        sx={{
                            background: 'linear-gradient(90deg, #00FF7F 0%, #00CC99 100%)',
                            color: '#000',
                            fontWeight: '600',
                            textTransform: 'none',
                            px: 3,
                            '&:hover': {
                                background: 'linear-gradient(90deg, #00CC99 0%, #00FF7F 100%)',
                            },
                        }}
                    >
                        {account === '' ? 'Connect Wallet' : displayAddress(account)}
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
