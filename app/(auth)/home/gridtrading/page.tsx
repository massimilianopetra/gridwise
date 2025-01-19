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
import { Box } from "@mui/material";
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { GridType } from '@/app/lib/definitions';
import GridTable from '@/app/ui/grid-table';
import GridSummary from '@/app/ui/grid-summary';
import { GometricGrid } from '@/app/lib/algorithm';
import CsvFileReader from '@/app/ui/CsvFileReader';
import { GridBackTesting, HoldStrategy, GridStrategy, GetHoldQuantity } from '@/app/lib/algorithm';
import { parseCsv } from '@/app/lib/utility';
import { StockData } from '@/app/lib/definitions'
import TradingChart from '@/app/ui/TradingChart';
import FlagSection from '@/app/ui/FlagSection';
import Marquee from "@/app/ui/Marquee";

interface ISummary {
  profitableTrades: number,
  gridProfit: number
}
interface GraphSeries {
  data: StockData[],
  color: string,
  title?: string
}

export default function Page() {
  const [open, setOpen] = useState(false);

  const [selPercentage, setSelPercentage] = useState(false);
  const [selInteger, setSelInteger] = useState(false);
  const [summary, setSummary] = useState<ISummary>();
  const [viewGraph, setViewgraph] = useState(false);
  const [isGraphPercentage, setIsGraphPercentage] = useState(false);
  const [isViewGrid, setIsViewGrid] = useState(false);
  const [rows, setRows] = useState<GridType[]>([]);
  const [holdstrategy, setSetHoldstrategy] = useState<StockData[]>([]);
  const [gridstrategy, setSetGridstrategy] = useState<StockData[]>([]);
  const [series, setSeries] = useState<GraphSeries[]>([]);
  const [status, setStatus] = useState("initial");
  const inputInvestmentRef = useRef<HTMLInputElement>(null);
  const inputPaRef = useRef<HTMLInputElement>(null);
  const inputPbRef = useRef<HTMLInputElement>(null);
  const inputPRef = useRef<HTMLInputElement>(null);
  const inputNGridRef = useRef<HTMLInputElement>(null);
  const inputNIterationRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputAlreadyOwned = useRef<HTMLInputElement>(null);
  const [flags, setFlags] = useState({
    buyOnGrid: false,
    sellOnGrid: false,
    commissionPercentage: "0",
    fixedCommission: "0",
  });
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


  const stock = [
    { symbol: "AAPL", change: +2.5 },
    { symbol: "TSLA", change: -3.7 },
    { symbol: "AMZN", change: +1.2 },
    { symbol: "GOOGL", change: -0.8 },
    { symbol: "META", change: -2.3 },
    { symbol: "NFLX", change: +0.5 },
  ];

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
    setViewgraph(false);
    const investment = parseFloat(inputInvestmentRef.current?.value || '0');
    const Pa = parseFloat(inputPaRef.current?.value || '0');
    const Pb = parseFloat(inputPbRef.current?.value || '0');
    const P = parseFloat(inputPRef.current?.value || '0');
    const n = parseFloat(inputNGridRef.current?.value || '0');
    const iteration = parseFloat(inputNIterationRef.current?.value || geid);

    // Controllo congruenza parametri
    if (Pa > 0 && Pb > 0 && investment > 0 && n > 2 && P > 0 && Pb > Pa) {

      const grid = GometricGrid(investment, Pa, Pb, P, n, iteration, selPercentage, selInteger);
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
    setSetHoldstrategy(h.stockdata);
    setSetGridstrategy(g.stockdata);
    setSummary(g.summary)

    setSeries([
      { data: h.stockdata, color: '#f44336', title: 'Hold Strategy' },
      { data: g.stockdata, color: '#4caf50', title: 'Grid Strategy' },
    ]);
    setViewgraph(true);

    //setRawData(result.join("\n"));
    console.log(result.join("\n"));

  };

  function buildSeries(percentage: boolean, grid: boolean) {

    const P = parseFloat(inputPRef.current?.value || '0');
    const qty = GetHoldQuantity(rows, P);
    const grid_line: StockData[][] = Array.from({ length: rows.length + 1 }, () => [...holdstrategy]);



    if (!percentage) {
      /* absolute */

      const originalArray = [
        { data: holdstrategy, color: '#f44336', title: 'Hold Strategy' },
        { data: gridstrategy, color: '#4caf50', title: 'Grid Strategy' },
      ];

      if (grid) {

        const transformedGridLine = grid_line.map((row, index) =>
          row.map(item => {
            if (index < rows.length) {
              return ({ time: item.time, value: rows[index].buyPrice * qty });
            } else {
              return ({ time: item.time, value: rows[index - 1].sellPrice * qty });
            }
          })
        );

        // Aggiungi le righe di transformedGridLine all'array originale
        const newArray = [
          ...originalArray,
          ...transformedGridLine.map((data, index) => ({
            data: data,
            color: '#00aaaa', // Colore personalizzato per ogni nuovo elemento
            //title: `G${index + 1}`, // Titolo con numerazione (G1, G2, ...)
          }))
        ];
        setSeries(newArray);
      } else {
        setSeries(originalArray);
      }

    } else {

      /* percentage */

      const h = holdstrategy.map((item) => {
        return ({ ...item, value: 100 * (item.value - holdstrategy[0].value) / holdstrategy[0].value })
      })
      const g = gridstrategy.map((item) => {
        return ({ ...item, value: 100 * (item.value - gridstrategy[0].value) / gridstrategy[0].value })
      })

      const originalArray = [
        { data: h, color: '#f44336', title: 'Hold Strategy' },
        { data: g, color: '#4caf50', title: 'Grid Strategy' },
      ]

      if (grid) {

        const transformedGridLine = grid_line.map((row, index) =>
          row.map(item => {
            if (index < rows.length) {
              return ({ time: item.time, value: 100 * (rows[index].buyPrice - P) / P });
            } else {
              return ({ time: item.time, value: 100 * (rows[index - 1].sellPrice - P) / P });
            }
          })
        );

        // Aggiungi le righe di transformedGridLine all'array originale
        const newArray = [
          ...originalArray,
          ...transformedGridLine.map((data, index) => ({
            data: data,
            color: '#00aaaa', // Colore personalizzato per ogni nuovo elemento
            //title: `G${index + 1}`, // Titolo con numerazione (G1, G2, ...)
          }))
        ];
        setSeries(newArray);

      } else {
        setSeries(originalArray);
      }

    }
  }

  const handleToggleShowGrid = () => {
    setIsViewGrid((prev) => {
      if (prev) {
        buildSeries(isGraphPercentage, false);
        return false;
      } else {
        buildSeries(isGraphPercentage, true);
        return true;
      }
    });

  };

  const handleToggleIsGraphPercentage = () => {
    setIsGraphPercentage((prev) => {
      if (prev) {
        buildSeries(false, isViewGrid);
        return false;
      } else {
        buildSeries(true, isViewGrid);
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


  return (
    <div className="max-w-full h-60">
      <div style={{ padding: "20px" }}>
        <Marquee
          stocks={stock}
          description="Market Update:"
          descriptionPadding={20}
        />
      </div>
      <br></br>
      {/* Titolo principale */}
      <Typography className="text-black text-center font-bold " style={{ fontSize: '4rem' }}>
        Grid Trading
      </Typography>
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
                control={<Switch checked={selPercentage} onChange={() => setSelPercentage((prevSelected) => !prevSelected)} />}
                label={selPercentage ? 'Percentage' : 'N.Grid'}
              />
              <FormControlLabel
                control={<Switch checked={selInteger} onChange={() => setSelInteger((prevSelected) => !prevSelected)} />}
                label={selInteger ? 'Integer Qty' : 'Float Qty.'}
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
            <GridSummary rows={rows} investment={parseFloat(inputInvestmentRef.current?.value || '0')} P={parseFloat(inputPRef.current?.value || '0')} />
            <br></br>
            <Card sx={{ maxWidth: 1200, margin: 'auto', padding: 2, backgroundColor: '#E0E0E0', borderRadius: '12px', }}>
              <Typography className="text-blue-900 text-center" variant="h5" gutterBottom>
                Investment Backtesting
              </Typography>


              <CsvFileReader onFileLoad={handleFileLoad} />
              <br></br>
              <FlagSection onFlagsChange={handleFlagsChange} onCommissionChange={handleCommissionChange} />



              <br></br>
              {viewGraph &&
                (<>
                  <p>Initial Capital: {gridstrategy[0].value.toFixed(2)} </p>
                  <p>Final Capital: {gridstrategy[gridstrategy.length - 1].value.toFixed(2)} </p>
                  <p>Strategy Gain: {(100 * (gridstrategy[gridstrategy.length - 1].value - gridstrategy[0].value) / gridstrategy[0].value).toFixed(2)}%  </p>
                  <p>Profitable Trades: {summary?.profitableTrades} </p>
                  <p>Grid Profit: {summary?.gridProfit.toFixed(2)}$ </p>
                </>
                )}
              <br></br>

              <div>
                {viewGraph && (
                  <>
                    <div className="flex justify-between items-center mb-2">
                      <FormControlLabel
                        control={<Switch checked={isGraphPercentage} onChange={handleToggleIsGraphPercentage} />}
                        label={isGraphPercentage ? 'Percentage Value' : 'Absolute Value'}
                      />
                      <FormControlLabel
                        control={<Switch checked={isViewGrid} onChange={handleToggleShowGrid} />}
                        label={isViewGrid ? 'Hide Grid' : 'Show Grid'}
                      />
                    </div>
                    <TradingChart
                      series={series}
                      className="bg-gray-800"
                    />
                  </>
                )}
              </div>
            </Card>
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



