'use client'

import React, { useRef, useState } from 'react';
import { Card, CardContent, CardActions, TextField, Typography, Button } from '@mui/material';
import Switch from '@mui/material/Switch';
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Box } from "@mui/material";

export default function GeoGridCard() {
  const [selected, setSelected] = useState(false);
  const [status, setStatus] = useState("initial");
  const inputInvestmentRef = useRef<HTMLInputElement>(null);
  const inputCurrencyRef = useRef<HTMLInputElement>(null);
  const inputPaRef = useRef<HTMLInputElement>(null);
  const inputPbRef = useRef<HTMLInputElement>(null);
  const inputNGridRef = useRef<HTMLInputElement>(null);


  const handleCalculation = () => {
    const investment = parseFloat(inputInvestmentRef.current?.value || '0');
    const Pa = parseFloat(inputPaRef.current?.value || '0');
    const Pb = parseFloat(inputPbRef.current?.value || '0');

  };

  const columns: GridColDef[] = [
    {
      field: "buyQuantity",
      headerName: "Quantità",
      width: 120,
      renderHeader: () => (
        <div style={{ textAlign: "center" }}>
          <div style={{ fontWeight: "bold" }}>Buy</div>
          <div>Quantità</div>
        </div>
      ),
    },
    {
      field: "buyPrice",
      headerName: "Prezzo",
      width: 120,
      renderHeader: () => (
        <div style={{ textAlign: "center" }}>
          <div style={{ fontWeight: "bold" }}>Buy</div>
          <div>Prezzo</div>
        </div>
      ),
    },
    {
      field: "sellQuantity",
      headerName: "Quantità",
      width: 120,
      renderHeader: () => (
        <div style={{ textAlign: "center" }}>
          <div style={{ fontWeight: "bold" }}>Sell</div>
          <div>Quantità</div>
        </div>
      ),
    },
    {
      field: "sellPrice",
      headerName: "Prezzo",
      width: 120,
      renderHeader: () => (
        <div style={{ textAlign: "center" }}>
          <div style={{ fontWeight: "bold" }}>Sell</div>
          <div>Prezzo</div>
        </div>
      ),
    },
  ];

  const rows = [
    { id: 1, buyQuantity: 10, buyPrice: 100, sellQuantity: 5, sellPrice: 50 },
    { id: 2, buyQuantity: 20, buyPrice: 200, sellQuantity: 10, sellPrice: 100 },
    { id: 3, buyQuantity: 15, buyPrice: 150, sellQuantity: 7, sellPrice: 70 },
    { id: 4, buyQuantity: 25, buyPrice: 250, sellQuantity: 12, sellPrice: 120 },
  ];

  const render = function () {
    switch (status) {
      default:
        return (
          <Box className = "bg-blue-100" sx={{ height: 400, width: "100%" }}>
            <DataGrid
              rows={rows}
              columns={columns}
              sx={{
                "& .MuiDataGrid-row:nth-of-type(even)": {
                  backgroundColor: "whitesmoke", // Righe pari
                },
                "& .MuiDataGrid-row:nth-of-type(odd)": {
                  backgroundColor: "white", // Righe dispari
                },
              }}
            />
          </Box>
        );

    }
  }

  return (
    <div>
      <Card className="bg-blue-100 rounded-xl" sx={{ maxWidth: 400, margin: 'auto', padding: 2 }}>
        <CardContent>
          <Typography className="text-blue-900" variant="h5" gutterBottom>
            Geometric Grid Computing
          </Typography>
          <div className='flex flex-row space-x-4'>
            <TextField
              className='bg-white rounded-md'
              inputRef={inputInvestmentRef}
              type="number"
              label="Investment"
              fullWidth
              margin="normal"
              slotProps={{
                inputLabel: { shrink: true },
              }}
            />
            <TextField
              className='bg-white rounded-md'
              inputRef={inputCurrencyRef}
              value="USDC"
              label="Currency"
              fullWidth
              margin="normal"
              slotProps={{
                inputLabel: { shrink: true },
              }}
            />
          </div>
          <TextField
            className='bg-white rounded-md'
            inputRef={inputPaRef}
            type="number"
            label="Initial Price"
            fullWidth
            margin="normal"
            slotProps={{
              inputLabel: { shrink: true },
            }}
          />
          <TextField
            className='bg-white rounded-md'
            inputRef={inputPbRef}
            type="number"
            label="Final Price"
            fullWidth
            margin="normal"
            slotProps={{
              inputLabel: { shrink: true },
            }}
          />
          <TextField
            className='bg-white rounded-md'
            inputRef={inputNGridRef}
            type="number"

            label={selected ? "Percentage" : "Number of Grid"}
            slotProps={{
              inputLabel: { shrink: true },
            }}
            fullWidth
            margin="normal"
          />


          <Switch
            checked={selected}
            onChange={() => setSelected((prevSelected) => !prevSelected)}
          >
          </Switch>
          <p>use grid percentage</p>
        </CardContent>
        <CardActions>
          <Button variant="contained" color="primary" onClick={handleCalculation}>
            Compute Grid
          </Button>
        </CardActions>
      </Card>
      <div>
        {render()}
      </div>

    </div>
  );
};


