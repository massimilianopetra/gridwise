'use client'

import React, { useRef, useState } from 'react';
import { Card, CardContent, CardActions, TextField, Typography, Button } from '@mui/material';
import Switch from '@mui/material/Switch';
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Box } from "@mui/material";

type buyttype =   {
  id: number;
  buyQuantity: number;
  buyPrice: number;
};

type selltype =   {
  id: number;
  sellQuantity: number;
  sellPrice: number;
};

export default function GridCard() {
  const [selected, setSelected] = useState(false);
  const [rb, setrowsBuy] = useState<buyttype[]>([]);
  const [rs, setrowsSell] = useState<selltype[]>([]);
  const [status, setStatus] = useState("initial");
  const inputInvestmentRef = useRef<HTMLInputElement>(null);
  const inputCurrencyRef = useRef<HTMLInputElement>(null);
  const inputPaRef = useRef<HTMLInputElement>(null);
  const inputPbRef = useRef<HTMLInputElement>(null);
  const inputPRef = useRef<HTMLInputElement>(null);
  const inputNGridRef = useRef<HTMLInputElement>(null);


  const handleCalculation = () => {
    const investment = parseFloat(inputInvestmentRef.current?.value || '0');
    const Pa = parseFloat(inputPaRef.current?.value || '0');
    const Pb = parseFloat(inputPbRef.current?.value || '0');
    const P = parseFloat(inputPRef.current?.value || '0');
    const n = parseFloat(inputNGridRef.current?.value || '1');

    const grid_gain = (Pb / Pa) ** (1 / n);
    var _rb = [];
    
    for (let i = 0; i < n; i++) {
      const price = Pa*(grid_gain**i);
      _rb.push({id: i+1, buyQuantity: 10, buyPrice: price})
    }
    setrowsBuy(_rb);
    setStatus("computed");

  };

  const columnsBuy: GridColDef[] = [
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

  ];

  const columnsSell: GridColDef[] = [
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


  const render = function () {
    switch (status) {
      case "computed":
        return (
          <div className='flex flex-col text-center'>
            <Typography className="text-white" variant="h5" gutterBottom>
              Resulting Grids
            </Typography>
            <div className='flex flex-row'>>
              <Box className="bg-blue-100" sx={{ height: 400, width: "50%" }}>
                <DataGrid
                  rows={rb}
                  columns={columnsBuy}
                  sx={{
                    "& .MuiDataGrid-row:nth-of-type(even)": {
                      backgroundColor: "whitesmoke", // Righe pari
                    },
                    "& .MuiDataGrid-row:nth-of-type(odd)": {
                      backgroundColor: "white", // Righe dispari
                    },
                  }}
                />
              </Box>)
              < Box className="bg-blue-100" sx={{ height: 400, width: "50%" }}>
                <DataGrid
                  rows={rs}
                  columns={columnsSell}
                  sx={{
                    "& .MuiDataGrid-row:nth-of-type(even)": {
                      backgroundColor: "whitesmoke", // Righe pari
                    },
                    "& .MuiDataGrid-row:nth-of-type(odd)": {
                      backgroundColor: "white", // Righe dispari
                    },
                  }}
                />
              </Box >
            </div>
          </div>)

      default:
        return (<Box></Box>);

    }
  }

  return (
    <div className='space-y-6'>
      <Card className="bg-blue-100 rounded-xl" sx={{ maxWidth: 400, margin: 'auto', padding: 2 }}>
        <CardContent>
          <Typography className="text-blue-900" variant="h5" gutterBottom>
            Grid Calculator
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
            inputRef={inputPRef}
            type="number"
            label="Current Price"
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


