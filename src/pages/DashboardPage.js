import React, { useState } from 'react';
import {
    Container, Grid, Paper, Typography, Box,
} from '@mui/material';
import StorageIcon from '@mui/icons-material/Storage';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { PageTitle } from '../components/common/PageTitle';
import { BASE_URL } from '../config/config';
import axios from 'axios';
import { useEffect } from 'react';

const DashboardPage = () => {
    const [summary, setSummary] = useState('');

    useEffect(() => {
        handleGetSummaryStock();

        return () => { }
    }, []);

    const handleGetSummaryStock = async () => {
        try {
            const url = `${BASE_URL}/stock/summary/all`;
            const response = await axios.get(url);
            if (response.data) {
                setSummary(response.data.data);
            }
        } catch (error) {
            console.log("Failed get summary stok");
        }
    }

    return (
        <Container maxWidth="lg">
            <PageTitle title="Dashboard" />
            <Grid container spacing={4}>
                {/* Kartu Total Stok */}
                <Grid
                    minWidth={250}
                    item xs={12}
                    sm={6} md={4}
                >
                    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', bgcolor: '#2b2b2b', color: 'white' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                                {summary.total_stock_qty ?? 0}
                            </Typography>
                            <StorageIcon sx={{ fontSize: 40 }} />
                        </Box>
                        <Typography variant="h6" sx={{ mt: 1 }}>
                            Total Stok
                        </Typography>
                    </Paper>
                </Grid>

                {/* Kartu Total Barang Masuk */}
                <Grid
                    minWidth={250}
                    item xs={12}
                    sm={6} md={4}
                >
                    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', bgcolor: '#388e3c', color: 'white' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                                {summary.total_all_inbound || 0}
                            </Typography>
                            <AddCircleOutlineIcon sx={{ fontSize: 40 }} />
                        </Box>
                        <Typography variant="h6" sx={{ mt: 1 }}>
                            Total Barang Masuk
                        </Typography>
                    </Paper>
                </Grid>

                {/* Kartu Total Barang Keluar */}
                <Grid
                    minWidth={250}
                    item xs={12}
                    sm={6} md={4}
                >
                    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', bgcolor: '#d32f2f', color: 'white' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                                {summary.total_all_outbound}
                            </Typography>
                            <RemoveCircleOutlineIcon sx={{ fontSize: 40 }} />
                        </Box>
                        <Typography variant="h6" sx={{ mt: 1 }}>
                            Total Barang Keluar
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default DashboardPage;