'use client'

import React, { useRef, useState } from 'react';
import { Card, CardContent, CardActions, TextField, Typography, Button } from '@mui/material';
import Switch from '@mui/material/Switch';

export default function LiquidityCard() {
  const [selected, setSelected] = useState(false);
  const input1Ref = useRef<HTMLInputElement>(null);
  const input2Ref = useRef<HTMLInputElement>(null);
  const input3Ref = useRef<HTMLInputElement>(null);
  const input4Ref = useRef<HTMLInputElement>(null);
  const YRef = useRef<HTMLInputElement>(null);
  const LRef = useRef<HTMLInputElement>(null);

  const handleCalculation = () => {
    const x = parseFloat(input1Ref.current?.value || '0');
    const P = parseFloat(input2Ref.current?.value || '0');
    const Pa = parseFloat(input3Ref.current?.value || '0');
    const Pb = parseFloat(input4Ref.current?.value || '0');

    const L = x*Math.sqrt(P*Pb)/(Math.sqrt(Pb)-Math.sqrt(P));
    const y = L*(Math.sqrt(P)-Math.sqrt(Pa));
    if (LRef.current) {
      LRef.current.value = L.toFixed(5); 
    }
    if (YRef.current) {
      YRef.current.value = y.toFixed(5); 
    }
  };

  return (
    <Card className="bg-blue-100 rounded-xl" sx={{ maxWidth: 400, margin: 'auto', padding: 2 }}>
      <CardContent>
        <Typography className="text-blue-900" variant="h5" gutterBottom>
          Liquidity Computing
        </Typography>
        <TextField
          className='bg-white rounded-md'
          inputRef={input1Ref}
          type="number"
          label="Tonken amount X"
          fullWidth
          margin="normal"
        />
        <TextField
          className='bg-white rounded-md'
          inputRef={input2Ref}
          type="number"
          label="Current Price P"
          fullWidth
          margin="normal"
        />
        <TextField
          className='bg-white rounded-md'
          inputRef={input3Ref}
          type="number"
          label="Min Price Pa"
          fullWidth
          margin="normal"
        />
        <TextField
          className='bg-white rounded-md'
          inputRef={input4Ref}
          type="number"
          label="Max Price Pb"
          fullWidth
          margin="normal"
        />
        <TextField
          className='bg-blue-200 rounded-md'
          inputRef={LRef}
          type="text"
          fullWidth
          margin="normal"
          label="Liquidity L"
          slotProps={{
            input: { readOnly: true, },
            inputLabel: { shrink: true },
          }}
        />
        <TextField
          className='bg-blue-200 rounded-md'
          inputRef={YRef}
          type="text"
          fullWidth
          margin="normal"
          label="Token Y"
          slotProps={{
            input: { readOnly: true, },
            inputLabel: { shrink: true },
          }}
        />

        <Switch
          checked={selected} 
          onChange={() => setSelected((prevSelected) => !prevSelected)}
        >
        </Switch>
        <p>use X96 arithmetics</p>
      </CardContent>
      <CardActions>
        <Button variant="contained" color="primary" onClick={handleCalculation}>
          Get Liquidity
        </Button>
      </CardActions>
    </Card>
  );
};


