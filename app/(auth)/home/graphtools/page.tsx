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
  const [viewGraph, setViewgraph] = useState(false);
  const [isGraphPercentage, setIsGraphPercentage] = useState(false);

  const [holdstrategy, setSetHoldstrategy] = useState<StockData[]>([]);

  const [holdstrategy_graph, setSetHoldstrategy_graph] = useState<StockData[]>([]);

  const [status, setStatus] = useState("initial");




  const handleToggleIsGraphPercentage = () => {
    setIsGraphPercentage((prev) => {
      if (prev) {
        /* absolute */
        setSetHoldstrategy_graph(holdstrategy);
        return false;
      } else {
        const h = holdstrategy.map((item) => {
          return ({ ...item, value: 100 * (item.value - holdstrategy[0].value) / holdstrategy[0].value })
        })

        setSetHoldstrategy_graph(h);
        return true;
      }
    });

  };

  const handleFileLoad = (items: StockData[]) => {
    setStatus("computed");
    setSetHoldstrategy(items);
    setSetHoldstrategy_graph(items);
    setViewgraph(true);

  };

  const render = function () {

    switch (status) {
      case "computing":
        return (<CircularProgress size="9rem" />);
      case "computed":

        return (
          <div>


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
        <Typography className="text-blue-900 text-center" variant="h5" gutterBottom>
          Graph Tools
        </Typography>
        <Card sx={{ maxWidth: 1200, margin: 'auto', padding: 2, backgroundColor: '#E0E0E0', borderRadius: '12px', }}>
          <Typography className="text-blue-900 text-center" variant="h5" gutterBottom>
            View Stock Value
          </Typography>

          <CsvFileReader onFileLoad={handleFileLoad} />
          <br></br>

          <br></br>

          <div>
            {viewGraph && (
              <>
                <br></br>

                <>
                  <p>Initial value: {holdstrategy[0].value.toFixed(4)} </p>
                  <p>Final value: {holdstrategy[holdstrategy.length - 1].value.toFixed(4)} </p>
                  <p>Performance: {(100 * (holdstrategy[holdstrategy.length - 1].value - holdstrategy[0].value) / holdstrategy[0].value).toFixed(2)}%  </p>
                </>

                <br></br>
                <div className="flex justify-between items-center mb-2">
                  <FormControlLabel
                    control={<Switch checked={isGraphPercentage} onChange={handleToggleIsGraphPercentage} />}
                    label={isGraphPercentage ? 'Percentage Value' : 'Absolute Value'}
                  />
                </div>
                <TradingChart
                  series={[
                    { data: holdstrategy_graph, color: '#f44336', title: 'Stock Value' },
                  ]}
                  className="bg-gray-800"
                />
              </>
            )}
          </div>
        </Card>

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



