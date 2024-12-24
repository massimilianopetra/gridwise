'use client'

import React, { useRef, useState } from 'react';
import { Card, CardContent, CardActions, TextField, Typography, Button } from '@mui/material';
import Switch from '@mui/material/Switch';
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Box } from "@mui/material";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

type buyType = {
  id: number;
  buyQuantity: number;
  buyPrice: number;
};

type sellType = {
  id: number;
  sellQuantity: number;
  sellPrice: number;
  earn: number;
};

export default function GridCard() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(false);
  const [rb, setrowsBuy] = useState<buyType[]>([]);
  const [rs, setrowsSell] = useState<sellType[]>([]);
  const [status, setStatus] = useState("initial");
  const inputInvestmentRef = useRef<HTMLInputElement>(null);
  const inputCurrencyRef = useRef<HTMLInputElement>(null);
  const inputPaRef = useRef<HTMLInputElement>(null);
  const inputPbRef = useRef<HTMLInputElement>(null);
  const inputPRef = useRef<HTMLInputElement>(null);
  const inputNGridRef = useRef<HTMLInputElement>(null);


  const handleCalculation = () => {
    setStatus("computing");
    const investment = parseFloat(inputInvestmentRef.current?.value || '0');
    const Pa = parseFloat(inputPaRef.current?.value || '0');
    const Pb = parseFloat(inputPbRef.current?.value || '0');
    const P = parseFloat(inputPRef.current?.value || '0');
    const n = parseFloat(inputNGridRef.current?.value || '0');

    const grid_gain = (Pb / Pa) ** (1 / n);
    var _rb: buyType[] = [];
    var _rs: sellType[] = [];

    // Controllo congruenza parametri
    if (Pa > 0 && Pb > 0 && investment > 0 && n > 2) {

      for (let i = 0; i < n; i++) {

        const priceBuy = Pa * (grid_gain ** i);
        const priceSell = Pa * (grid_gain ** (i + 1));
        const qty = (investment / n) / priceBuy
        const earn = qty * (priceSell - priceBuy);
        _rb.push({ id: i + 1, buyQuantity: qty, buyPrice: priceBuy });
        _rs.push({ id: i + 1, sellQuantity: qty, sellPrice: priceSell, earn: earn });

      }

      ;

      setrowsBuy(_rb);
      setrowsSell(_rs);
      setStatus("computed");
    } else {
      setStatus("initial");
      setOpen(true);
    }

  };

  const columnsBuy: GridColDef[] = [
    {
      field: "id",

      width: 120,
      renderHeader: () => (
        <div style={{ textAlign: "center" }}>
          <div>N.</div>
        </div>
      ),
    },
    {
      field: "buyQuantity",

      width: 200,
      renderHeader: () => (
        <div style={{ textAlign: "center" }}>
          <div style={{ fontWeight: "bold" }}>Buy</div>
          <div>Quantity</div>
        </div>
      ),
    },
    {
      field: "buyPrice",

      width: 200,
      renderHeader: () => (
        <div style={{ textAlign: "center" }}>
          <div style={{ fontWeight: "bold" }}>Buy</div>
          <div>Price</div>
        </div>
      ),
    },


  ];

  const columnsSell: GridColDef[] = [
    {
      field: "id",

      width: 120,
      renderHeader: () => (
        <div style={{ textAlign: "center" }}>
          <div>N.</div>
        </div>
      ),
    },
    {
      field: "sellQuantity",

      width: 200,
      renderHeader: () => (
        <div style={{ textAlign: "center" }}>
          <div style={{ fontWeight: "bold" }}>Sell</div>
          <div>Quantity</div>
        </div>
      ),
    },
    {
      field: "sellPrice",

      width: 200,
      renderHeader: () => (
        <div style={{ textAlign: "center" }}>
          <div style={{ fontWeight: "bold" }}>Sell</div>
          <div>Price</div>
        </div>
      ),
    },
    {
      field: "earn",

      width: 200,
      renderHeader: () => (
        <div style={{ textAlign: "center" }}>
          <div style={{ fontWeight: "bold" }}>Earn</div>
        </div>
      ),
    },
  ];


  const render = function () {
    switch (status) {
      case "computed":
        return (
          <Card className="bg-blue-100 rounded-xl" sx={{ maxWidth: 1200, margin: 'auto', padding: 2 }}>
            <div className='flex flex-col text-center'>
              <Typography className="text-blue-900" variant="h5" gutterBottom>
                Resulting Grids
              </Typography>
              <div className='flex flex-row'>
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
                </Box>
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
            </div>
          </Card>
          );

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

      <Snackbar open={open} autoHideDuration={6000} onClose={() => { setOpen(false) }} anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}>
        <Alert
          severity="error"
          variant="filled"
          sx={{ width: '100%' }}
        >
          Input value wrong
        </Alert>
      </Snackbar>

    </div>
  );
};


