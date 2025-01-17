'use client'

import React from 'react';
import { Box, Typography, Card, CardContent, List, ListItem, ListItemText, Button, Divider } from '@mui/material';

export default function Page() {
  return (
    <main>

      <Box className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-3">

        {/* Titolo principale */}
        <Typography className ="text-black text-center font-bold text-6xl">
          Welcome to OpenTradeNet
        </Typography>

      </Box>
    </main>
  );
}
