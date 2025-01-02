'use client'

import React, { useRef, useState } from 'react';
import { Card, CardContent, CardActions, TextField, Typography, Button } from '@mui/material';
import Switch from '@mui/material/Switch';
import { Box } from "@mui/material";
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { GridType } from '@/app/lib/definitions';
import GridTable from '@/app/ui/grid-table';
import GridSummary from '@/app/ui/grid-summary';
import { GometricGrid } from '@/app/lib/algorithm';
import CsvFileReader from '@/app/ui/CsvFileReader';
import { GridBackTesting, HoldStrategy } from '@/app/lib/algorithm';
import { StockData } from '@/app/lib/definitions'
import TradingChart from '@/app/ui/TradingChart';

export default function Page() {
  const [open, setOpen] = useState(false);

  const [selected, setSelected] = useState(false);
  const [rows, setRows] = useState<GridType[]>([]);
  const [holdstrategy, setSetHoldstrategy] = useState<StockData[]>([]);
  const [gridstrategy, setSetGridstrategy] = useState<StockData[]>([]);
  const [rawData, setRawData] = useState<string>("");
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

    // Controllo congruenza parametri
    if (Pa > 0 && Pb > 0 && investment > 0 && n > 2 && P > 0 && Pb > Pa) {

      const grid = GometricGrid(investment, Pa, Pb, P, n);
      setRows(grid);
      setStatus("computed");
    } else {
      setStatus("initial");
      setOpen(true);
    }

  };


  const handleFileLoad = (items: StockData[]) => {
    const result = GridBackTesting(rows, items);

    setSetHoldstrategy(HoldStrategy(rows,items));
    setRawData(result.join("\n"));
  };

  const render = function () {

    switch (status) {
      case "computing":
        return (<CircularProgress size="9rem" />);
      case "computed":
        const investment = parseFloat(inputInvestmentRef.current?.value || '0');
        const P = parseFloat(inputPRef.current?.value || '0');
        return (
          <div>
            <GridTable rows={rows} />
            <br></br>
            <GridSummary rows={rows} investment={investment} P={P} />
            <br></br>
            <div className='text-center'>
              <CsvFileReader onFileLoad={handleFileLoad} />
            </div>
            <br></br>
            <Card>
              <TextField
                label="Test Result"
                multiline
                rows={10}
                value={rawData}
                variant="outlined"
                fullWidth
                className="mt-4"
              />
            </Card>
            <br></br>
            <Card>
              {/* Imposta larghezza per il contenitore del grafico */}
              <TradingChart
                series={[
                  { data: holdstrategy, color: '#4caf50', title: 'Hold Strategy' },
                ]}
                className="bg-gray-800"
              />
            </Card>

            <br></br>
          </div>
        );

      default:
        return (<Box></Box>);

    }
  }

  return (
    <div style={{ height: 250, width: '100%' }}>

      <br></br>
      <div className='space-y-6'>
        <Card sx={{ maxWidth: 400, margin: 'auto', padding: 2, backgroundColor: '#E0E0E0', borderRadius: '12px', }}>
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

    </div>
  );
};



