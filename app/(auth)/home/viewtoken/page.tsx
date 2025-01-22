'use client'


import React, { useState, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { setToken } from '@/app/lib/token';

export default function Page() {

  const [wtoken, setWtoken] = useState("");
  const [rtoken, setRtoken] = useState();



  useEffect(() => {
    const fetchData = async () => {
      const t = await setToken();
      setWtoken(t);
    };

    fetchData();
  }, [])

  const handleButton = async () => {
    const response = await fetch("/api/gettoken");
    const data = await response.json();
    setRtoken(data.token);
  }

  return (
    <main>

      <Box className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-3">

        {/* Titolo principale */}
        <Typography className="text-black text-center font-bold" style={{ fontSize: '4rem' }}>
          Written token is {wtoken}
        </Typography>

        <Typography className="text-black text-center font-bold" style={{ fontSize: '4rem' }}>
          Read token is {rtoken}
        </Typography>

        <Button variant="contained" color="primary" onClick={handleButton}>
         Read Token
        </Button>


      </Box>
    </main>
  );
}