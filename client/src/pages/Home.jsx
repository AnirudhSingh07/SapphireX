import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Typography,
    Card,
    CardContent,
    Stack
} from '@mui/material';
import { useStateContext } from '../context/Index';
import { ethers } from "ethers";
import ContractABI from "../ABI/abi.json";

// Corrected Child Components
const EndOrder = ({ order }) => {
    return <Button variant="contained" color="error" size="small">End {order.name}</Button>;
};

const ClaimCollateral = ({ order }) => {
    return <Button variant="contained" color="success" size="small">Claim {order.Collateral}</Button>;
};

const Home = () => {
    const [activeTab, setActiveTab] = useState('lending');
    const { account, tkn1price, tkn2price, contractAddress } = useStateContext();

    const lendingOrders = [
        { id: 1, name: 'Lending Order 1', amount: '1000 TKN2' },
    ];

    const loanOrders = [
        { id: 1, name: 'Loan Order 1', Collateral: '2000 TKN1', Loan: '2000 TKN2' },
    ];

    const autoLiquidate = async () => {
        const { ethereum } = window;
        if (ethereum) {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(contractAddress, ContractABI, signer);
            try {
                await contract.autoLiquidate();
            } catch (error) {
                console.error(error);
                alert("Transaction failed, please check your connection");
            }
        }
    };

    useEffect(() => {
        if (loanOrders.length > 0 && tkn1price * parseFloat(loanOrders[0].Collateral) === tkn2price * parseFloat(loanOrders[0].Loan)) {
            autoLiquidate();
        }
    }, [tkn1price, tkn2price]);

    const ordersToRender = activeTab === 'lending' ? lendingOrders : loanOrders;

    return (
        <Box sx={{
            minHeight: '90vh',
            
        }}>
            {account === '' ? (
                <Box textAlign="center" sx={{ mt: 10 }}>
                    <Typography variant="h2" sx={{ color: '#EEEEEEFF', mb: 2 }}>
                        Investments made Private!
                    </Typography>
                    
                </Box>
            ) : (
                <>
                    {/* Tabs */}
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3, gap: 2 }}>
                        <Button
                            variant={activeTab === 'lending' ? 'contained' : 'outlined'}
                            onClick={() => setActiveTab('lending')}
                            sx={{
                                color: activeTab === 'lending' ? '#000' : '#FFFFFF',
                                backgroundColor: activeTab === 'lending' ? '#FFFFFF' : 'transparent',
                                fontWeight: 600
                            }}
                        >
                            Lending Orders
                        </Button>
                        <Button
                            variant={activeTab === 'loan' ? 'contained' : 'outlined'}
                            onClick={() => setActiveTab('loan')}
                            sx={{
                                color: activeTab === 'loan' ? '#000' : '#FFFFFF',
                                backgroundColor: activeTab === 'loan' ? '#FFFFFF' : 'transparent',
                                fontWeight: 600
                            }}
                        >
                            Loan Orders
                        </Button>
                    </Box>

                    {/* Orders */}
                    <Typography variant="h5" sx={{ textAlign: 'center', mb: 3, color: '#EAEAEA' }}>
                        {activeTab === 'lending' ? 'Lending Orders' : 'Loan Orders'}
                    </Typography>

                    {ordersToRender.length > 0 ? (
                        <Stack spacing={3} alignItems="center">
                            {ordersToRender.map(order => (
                                <Card key={order.id} sx={{ width: '80%', backgroundColor: '#2A2A2A', color: '#EAEAEA' }}>
                                    <CardContent>
                                        <Typography variant="h6">{order.name}</Typography>
                                        {activeTab === 'lending' ? (
                                            <Typography>Amount: {order.amount}</Typography>
                                        ) : (
                                            <>
                                                <Typography>Collateral: {order.Collateral}</Typography>
                                                <Typography>Loan: {order.Loan}</Typography>
                                                <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                                                    <EndOrder order={order} />
                                                    <ClaimCollateral order={order} />
                                                </Box>
                                            </>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                        </Stack>
                    ) : (
                        <Typography variant="h6" sx={{ textAlign: 'center', color: '#EAEAEA', mt: 5 }}>
                            You don't have any active orders yet
                        </Typography>
                    )}
                </>
            )}
        </Box>
    );
};

export default Home;
