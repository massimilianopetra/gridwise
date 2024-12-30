'use client'

import React, { useRef, useState } from 'react';
import { Card, CardContent, CardActions, TextField, Typography, Button } from '@mui/material';



export default function Home() {

    const handleCalculation = () => {
    }

    return (
        <div>
            <Card sx={{ maxWidth: 400, margin: 'auto', padding: 2, backgroundColor: '#E0E0E0',  borderRadius: '12px', }}>
                <CardContent>
                    <Typography className="text-blue-900" variant="h5" gutterBottom>
                        Grid Calculator
                    </Typography>
        
                </CardContent>
                <CardActions>
                    <Button variant="contained" color="primary" onClick={handleCalculation}>
                        Compute Grid
                    </Button>
                </CardActions>
            </Card>
        </div>
    );
}