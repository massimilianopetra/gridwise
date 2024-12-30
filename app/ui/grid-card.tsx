'use client'

import React, { useRef, useState } from 'react';
import { Card, CardContent, CardActions, TextField, Typography, Button } from '@mui/material';
import Switch from '@mui/material/Switch';
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Box } from "@mui/material";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

type gridType = {
  id: number;
  Quantity: number;
  buyPrice: number;
  capital: number;
  sellPrice: number;
  earn: number;
  status: string;
};

export default function GridCard() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(false);
  const [rows, setRows] = useState<gridType[]>([]);
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
    var _r: gridType[] = [];

    // Controllo congruenza parametri
    if (Pa > 0 && Pb > 0 && investment > 0 && n > 2 && P > 0 && Pb > Pa) {

      for (let i = 0; i < n; i++) {

        const priceBuy = Pa * (grid_gain ** i);
        const priceSell = Pa * (grid_gain ** (i + 1));
        const qty = (investment / n) / priceBuy
        const earn = qty * (priceSell - priceBuy);
        if (P > priceBuy) {
          _r.push({ id: i + 1, Quantity: qty, buyPrice: priceBuy, capital: qty * priceBuy, sellPrice: priceSell, earn: earn, status: "Wait to buy" });
        } else {
          _r.push({ id: i + 1, Quantity: qty, buyPrice: priceBuy, capital: qty * priceBuy, sellPrice: priceSell, earn: earn, status: "Wait to sell" });
        }


      }

      setRows(_r);
      setStatus("computed");
    } else {
      setStatus("initial");
      setOpen(true);
    }

  };

  const columns: GridColDef[] = [
    {
      field: "id",

      width: 100,
      renderHeader: () => (
        <div style={{ textAlign: "center" }}>
          <div style={{ fontWeight: "bold" }}>Grid Id</div>
        </div>
      ),
    },
    {
      field: "Quantity",

      width: 180,
      renderHeader: () => (
        <div style={{ textAlign: "center" }}>
          <div style={{ fontWeight: "bold" }}>Quantity</div>
        </div>
      ),
      renderCell: (params) => {

        const color = 'black';
  
        return (
          <span style={{ color }}>
            {params.row.Quantity.toFixed(5)}
          </span>
        );
      },
    },
    {
      field: "buyPrice",

      width: 180,
      renderHeader: () => (
        <div style={{ textAlign: "center" }}>
          <div style={{ fontWeight: "bold" }}>Buy Price</div>
        </div>
      ),
      renderCell: (params) => {

        const color = params.row.status == 'Wait to sell' ? 'green' : 'red';
  
        return (
          <span style={{ color }}>
            {params.row.buyPrice.toFixed(5)}
          </span>
        );
      },
    },
    {
      field: "capital",

      width: 180,
      renderHeader: () => (
        <div style={{ textAlign: "center" }}>
          <div style={{ fontWeight: "bold" }}>Capital Share</div>
        </div>
      ),
      renderCell: (params) => {

        const color = 'black';
  
        return (
          <span style={{ color }}>
            {params.row.capital.toFixed(2)}
          </span>
        );
      },
    },
    {
      field: "sellPrice",

      width: 180,
      renderHeader: () => (
        <div style={{ textAlign: "center" }}>
          <div style={{ fontWeight: "bold" }}>Sell Price</div>
        </div>
      ),
      renderCell: (params) => {

        const color = params.row.status == 'Wait to sell' ? 'red' : 'black';
  
        return (
          <span style={{ color }}>
            {params.row.sellPrice.toFixed(5)}
          </span>
        );
      },
    },
    {
      field: "earn",

      width: 180,
      renderHeader: () => (
        <div style={{ textAlign: "center" }}>
          <div style={{ fontWeight: "bold" }}>Profit</div>
        </div>
      ),
      renderCell: (params) => {

        const color = 'black';
  
        return (
          <span style={{ color }}>
            {params.row.earn.toFixed(5)}
          </span>
        );
      },
    },
    {
      field: "status",

      width: 180,
      renderHeader: () => (
        <div style={{ textAlign: "center" }}>
          <div style={{ fontWeight: "bold" }}>Status</div>
        </div>
      ),
      renderCell: (params) => {

        const color = 'blue';
  
        return (
          <span style={{ color }}>
            {params.row.status}
          </span>
        );
      },
    },

  ];




  const render = function () {

    switch (status) {
      case "computed":
        const investment = parseFloat(inputInvestmentRef.current?.value || '0');
        let qty = 0;
        let initInvestent = 0;
        let saved = 0;
        let future = 0;
        const P = parseFloat(inputPRef.current?.value || '0');
        rows.forEach((el) => {
          if (P < el.buyPrice) {
            qty += el.Quantity
            initInvestent += el.Quantity * P;
            saved += el.Quantity * (el.buyPrice-P)

          } else {
            future += el.Quantity * el.buyPrice;
          }
        });

        return (
          <div>
            <Card className="bg-gray-300 rounded-xl" sx={{ maxWidth: 1200, margin: 'auto', padding: 2 }}>
              <div className='flex flex-col text-center'>
                <Typography className="text-blue-900" variant="h5" gutterBottom>
                  Resulting Grids
                </Typography>
                <div className='flex flex-row'>
                  <Box sx={{ height: 400, width: "100%" }}>
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
                </div>
              </div>
            </Card>
            <br></br>
            <Card className="bg-gray-300 rounded-xl" sx={{ maxWidth: 1200, margin: 'auto', padding: 2 }}>
              <div className='flex flex-col text-center'>
                <Typography className="text-blue-900" variant="h5" gutterBottom>
                  Summary
                </Typography>
                <div className='text-left'>
                  <p className='text-blue-900'>Total investment: {investment.toFixed(2)} </p>
                  <br></br>
                  <p className='text-blue-900'>Initial early buy quantity: {qty.toFixed(5)} </p>
                  <p className='text-blue-900'>Initial allocation for early buy: {initInvestent.toFixed(2)} </p>
                  <p className='text-blue-900'>Initial saved allocation: {saved.toFixed(2)} </p>
                  <br></br>
                  <p className='text-blue-900'>Reserved allocation for future purchases: {future.toFixed(2)} </p>
                  <br></br>
                </div>
              </div>
            </Card>
            <br></br>
            <br></br>
          </div>
        );

      default:
        return (<Box></Box>);

    }
  }

  return (
    <div className='space-y-6'>
      <Card className="bg-gray-300 rounded-xl" sx={{ maxWidth: 400, margin: 'auto', padding: 2 }}>
        <CardContent>
          <Typography className="text-blue-900" variant="h5" gutterBottom>
            Grid Calculator
          </Typography>
          <div className='flex flex-row space-x-4'>
            <TextField
              className='bg-white rounded-md'
              inputRef={inputInvestmentRef}
              type="number"
              label="Total Investment"
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

      <Snackbar open={open} autoHideDuration={6000} onClose={() => { setOpen(false) }} anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}>
        <Alert
          severity="error"
          variant="filled"
          sx={{ width: '100%' }}
        >
          Input value are wrong
        </Alert>
      </Snackbar>

    </div>
  );
};


