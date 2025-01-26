'use client'

/*
 * This file is part of the project by Massimiliano Petra.
 *
 * Copyright (C) 2025 Massimiliano Petra
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 */

import React, { useRef, useState, useEffect } from 'react';
import { Card, CardContent, CardActions, TextField, Typography, Button, FormControlLabel } from '@mui/material';
import Switch from '@mui/material/Switch';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { GridType } from '@/app/lib/definitions';
import GridTable from '@/app/ui/grid-table';
import GridSummary from '@/app/ui/grid-summary';
import { GometricGrid, LinearGrid } from '@/app/lib/algorithm';
import { parseCsv } from '@/app/lib/utility';
import GridBacktesting, { GridBacktestingRef } from '@/app/ui/grid-backtesting';


export default function Page() {
  const [open, setOpen] = useState(false);

  const [selPercentage, setSelPercentage] = useState(false);
  const [selInteger, setSelInteger] = useState(false);
  const [selGeometric, setSelGeometric] = useState(false);
  const [rows, setRows] = useState<GridType[]>([]);
  const [status, setStatus] = useState("initial");

  const inputInvestmentRef = useRef<HTMLInputElement>(null);
  const inputPaRef = useRef<HTMLInputElement>(null);
  const inputPbRef = useRef<HTMLInputElement>(null);
  const inputPRef = useRef<HTMLInputElement>(null);
  const inputNGridRef = useRef<HTMLInputElement>(null);
  const inputNIterationRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputAlreadyOwned = useRef<HTMLInputElement>(null);
  const gridBacktestingRef = useRef<GridBacktestingRef>(null);

  const [decimalSeparator, setDecimalSeparator] = useState<string>(',');
  const [currency, setCurrency] = useState<string>('EUR');
  const [geid, setGEID] = useState<string>('10');


  // Load preferences from localStorage or set defaults
  useEffect(() => {
    const savedDecimalSeparator = localStorage.getItem('decimalSeparator') || '.';
    const savedCurrency = localStorage.getItem('currency') || 'USD';
    const savedGEID = localStorage.getItem('geid') || '10';

    setDecimalSeparator(savedDecimalSeparator);
    setCurrency(savedCurrency);
    setGEID(savedGEID);

  }, []);


  const handleButtonImport = () => {
    fileInputRef.current?.click();
  };

  const handleImportGrid = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        try {
          const fileContent = e.target.result as string;

          const typeDef: GridType = {
            id: 0,
            Quantity: 0,
            buyPrice: 0,
            effectiveBuyPrice: 0,
            capital: 0,
            sellPrice: 0,
            earn: 0,
            status: false,
          };
          console.log(fileContent);
          const data = parseCsv<GridType>(fileContent, decimalSeparator, typeDef);
          setRows(data);

          if (inputPaRef.current) {
            inputPaRef.current.value = data[0].buyPrice.toFixed(3);
          }
          if (inputPbRef.current) {
            inputPbRef.current.value = data[data.length - 1].sellPrice.toFixed(3);
          }
          if (inputNGridRef.current) {
            inputNGridRef.current.value = (data.length).toFixed(0);
          }
          if (inputInvestmentRef.current && inputPRef.current) {
            let value = 0;
            let P = -1;
            data.forEach((item) => {
              value += item.capital;
              if (item.status && P < 0) {
                P = item.buyPrice;
              }
            });
            inputInvestmentRef.current.value = (value).toFixed(0);
            inputPRef.current.value = (P).toFixed(3);
          }

          // Resetta il valore per consentire la selezione dello stesso file
          event.target.value = "";
          setStatus("computed");

        } catch (error) {
          console.error("Error parsing CSV:", error);
          alert("Invalid CSV format. Please check your file.");
        }
      }
    };
    reader.readAsText(file);
  };

  const handleButtonCompute = () => {
    setStatus("computing");

    const investment = parseFloat(inputInvestmentRef.current?.value || '0');
    const Pa = parseFloat(inputPaRef.current?.value || '0');
    const Pb = parseFloat(inputPbRef.current?.value || '0');
    const P = parseFloat(inputPRef.current?.value || '0');
    const n = parseFloat(inputNGridRef.current?.value || '0');
    const iteration = parseFloat(inputNIterationRef.current?.value || geid);

    // Controllo congruenza parametri
    if (Pa > 0 && Pb > 0 && investment > 0 && n > 2 && P > 0 && Pb > Pa) {

      if (gridBacktestingRef.current) {
        gridBacktestingRef.current.reset(); // Chiama il metodo reset nel componente
      }
      if (selGeometric) {
        const grid = GometricGrid(investment, Pa, Pb, P, n, iteration, selPercentage, selInteger);
        setRows(grid);
      } else {
        const grid = LinearGrid(investment, Pa, Pb, P, n, iteration, selInteger);
        setRows(grid);
      }
      setStatus("computed");
    } else {
      setStatus("initial");
      setOpen(true);
    }

  };


  return (
    <div className="max-w-full">

      <div className='space-y-6'>
        <Card sx={{ maxWidth: 600, margin: 'auto', padding: 2, backgroundColor: '#E0E0E0', borderRadius: '12px', }}>
          <CardContent>
            <Typography className="text-blue-900" variant="h5" gutterBottom>
              Grid Parameter
            </Typography>
            <div className='flex flex-row space-x-4'>
              <TextField
                required
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
                required
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
            </div>
            <div className='flex flex-row space-x-4'>
              <TextField
                required
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
                required
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
            </div>
            <div className='flex flex-row space-x-4'>
              <TextField
                required
                className='bg-white rounded-md max-w-32'
                inputRef={inputNGridRef}
                type="number"

                label={selPercentage ? "Percentage" : "Number of Grid"}
                slotProps={{
                  inputLabel: { shrink: true },
                }}
                fullWidth
                margin="normal"
              />
              <FormControlLabel
                control={<Switch checked={selPercentage} onChange={() => {
                  if (selGeometric) {
                    setSelPercentage((prevSelected) => !prevSelected)
                  } else {
                    setSelPercentage(false);
                  }
                }}
                />}
                label={selPercentage ? 'Percentage' : 'N.Grid'}
              />

            </div>
            <div className='flex flex-row space-x-4'>
              <FormControlLabel
                control={<Switch checked={selInteger} onChange={() => setSelInteger((prevSelected) => !prevSelected)} />}
                label={selInteger ? 'Integer Qty' : 'Float Qty.'}
              />
              <FormControlLabel
                control={<Switch checked={selGeometric} onChange={() =>
                  setSelGeometric((prevSelected) => {
                    if (prevSelected) {
                      setSelPercentage(false);
                    }
                    return (!prevSelected)
                  })
                } />}
                label={selGeometric ? 'Geometric Grid' : 'Linear Grid'}
              />
            </div>
            <div className='flex flex-row space-x-4'>
              <TextField
                className='bg-white rounded-md max-w-36'
                inputRef={inputNIterationRef}
                type="number"
                label={"Engine Iteration"}
                slotProps={{
                  inputLabel: { shrink: true },
                }}
                fullWidth
                margin="normal"
              />
              <TextField
                className='bg-white rounded-md max-w-52'
                inputRef={inputAlreadyOwned}
                type="number"
                label="Already Owned Shares"
                fullWidth
                margin="normal"
                slotProps={{
                  inputLabel: { shrink: true },
                }}
              />
            </div>
          </CardContent>
          <CardActions>
            <Button variant="contained" color="primary" onClick={handleButtonCompute}>
              Compute Grid
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleButtonImport}
            >
              Import Grid
            </Button>
            <input
              type="file"
              accept=".csv"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleImportGrid}
            />
          </CardActions>
        </Card>

        {(status == "computed") &&
          <>
            <GridTable rows={rows} />
            <br></br>
            <GridSummary
              rows={rows}
              investment={parseFloat(inputInvestmentRef.current?.value || '0')}
              P={parseFloat(inputPRef.current?.value || '0')}
              geometric={selGeometric}
            />
            <br></br>
            <GridBacktesting
              ref={gridBacktestingRef}
              rows={rows}
            />

          </>
        }

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

    </div >
  );
};



