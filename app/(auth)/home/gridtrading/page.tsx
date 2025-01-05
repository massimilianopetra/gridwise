'use client'

import React, { useRef, useState } from 'react';
import { Card, CardContent, CardActions, TextField, Typography, Button, FormControlLabel } from '@mui/material';
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
import { GridBackTesting, HoldStrategy, GridStrategy } from '@/app/lib/algorithm';
import { StockData } from '@/app/lib/definitions'
import TradingChart from '@/app/ui/TradingChart';
import FlagSection from '@/app/ui/FlagSection';

export default function Page() {
  const [open, setOpen] = useState(false);

  const [selected, setSelected] = useState(false);
  const [viewGraph, setViewgraph] = useState(false);
  const [isGraphPercentage, setIsGraphPercentage] = useState(false);
  const [rows, setRows] = useState<GridType[]>([]);
  const [holdstrategy, setSetHoldstrategy] = useState<StockData[]>([]);
  const [gridstrategy, setSetGridstrategy] = useState<StockData[]>([]);
  const [holdstrategy_graph, setSetHoldstrategy_graph] = useState<StockData[]>([]);
  const [gridstrategy_graph, setSetGridstrategy_graph] = useState<StockData[]>([]);
  const [status, setStatus] = useState("initial");
  const inputInvestmentRef = useRef<HTMLInputElement>(null);
  const inputCurrencyRef = useRef<HTMLInputElement>(null);
  const inputPaRef = useRef<HTMLInputElement>(null);
  const inputPbRef = useRef<HTMLInputElement>(null);
  const inputPRef = useRef<HTMLInputElement>(null);
  const inputNGridRef = useRef<HTMLInputElement>(null);
  const [flags, setFlags] = useState({
    buyOnGrid: false,
    sellOnGrid: false,
    commissionPercentage: "0",
    fixedCommission: "0",
  });


  const handleCalculation = () => {
    setStatus("computing");
    setViewgraph(false);
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
    const result = GridBackTesting(rows, items, flags);
    const h = HoldStrategy(rows, items);
    const g = GridStrategy(rows, items, flags);
    setSetHoldstrategy(h);
    setSetGridstrategy(g);
    setSetHoldstrategy_graph(h);
    setSetGridstrategy_graph(g);
    setViewgraph(true);

    //setRawData(result.join("\n"));
    console.log(result.join("\n"));
  };

  const handleToggleIsGraphPercentage = () => {
    setIsGraphPercentage((prev) => {
      if (prev) {
        /* absolute */
        setSetHoldstrategy_graph(holdstrategy);
        setSetGridstrategy_graph(gridstrategy);
        return false;
      } else {
        const h = holdstrategy.map((item) => {
          return ({ ...item, value: 100 * (item.value - holdstrategy[0].value) / holdstrategy[0].value })
        })
        const g = gridstrategy.map((item) => {
          return ({ ...item, value: 100 * (item.value - gridstrategy[0].value) / gridstrategy[0].value })
        })
        setSetHoldstrategy_graph(h);
        setSetGridstrategy_graph(g);
        return true;
      }
    });

  };

  const handleFlagsChange = (updatedFlags: { buyOnGrid: boolean; sellOnGrid: boolean }) => {
    setFlags((prev) => ({ ...prev, ...updatedFlags }));
  };

  const handleCommissionChange = (data: { commissionPercentage: string; fixedCommission: string }) => {
    setFlags((prev) => ({ ...prev, ...data }));
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
            <Card sx={{ maxWidth: 1200, margin: 'auto', padding: 2, backgroundColor: '#E0E0E0', borderRadius: '12px', }}>
              <Typography className="text-blue-900 text-center" variant="h5" gutterBottom>
                Investment Backtesting
              </Typography>


              <CsvFileReader onFileLoad={handleFileLoad} />
              <FlagSection onFlagsChange={handleFlagsChange} onCommissionChange={handleCommissionChange} />



              <br></br>

              <div>
                {viewGraph && (
                  <>
                    <div className="flex justify-between items-center mb-2">
                      <FormControlLabel
                        control={<Switch checked={isGraphPercentage} onChange={handleToggleIsGraphPercentage} />}
                        label={isGraphPercentage ? 'Percentage Value' : 'Absolute Value'}
                      />
                    </div>
                    <TradingChart
                      series={[
                        { data: holdstrategy_graph, color: '#f44336', title: 'Hold Strategy' },
                        { data: gridstrategy_graph, color: '#4caf50', title: 'Grid Strategy' },
                      ]}
                      className="bg-gray-800"
                    />
                  </>
                )}
              </div>
            </Card>
            <br></br>
            <Card>
              {/*<TextField
                label="Test Result"
                multiline
                rows={10}
                value={rawData}
                variant="outlined"
                fullWidth
                className="mt-4"
              />*/}
            </Card>

          </div >
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



