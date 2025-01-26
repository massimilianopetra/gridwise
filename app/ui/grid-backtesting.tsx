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

import React, { useState, useImperativeHandle, forwardRef, useEffect } from "react";
import { Card, Typography, FormControlLabel, Box, Grid, TextField } from '@mui/material';
import { GridType } from '@/app/lib/definitions';
import Switch from '@mui/material/Switch';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import CsvFileReader from '@/app/ui/CsvFileReader';
import { StockData } from '@/app/lib/definitions'
import { HoldStrategy, GridStrategy, GetHoldQuantity } from '@/app/lib/algorithm';
import FlagSection from '@/app/ui/FlagSection';
import TradingChart from '@/app/ui/TradingChart';

interface ISummary {
    profitableTrades: number,
    gridProfit: number
}

interface ILabelValue {
    label: string,
    value: string
}

interface GraphSeries {
    data: StockData[],
    color: string,
    title?: string
}

export type GridBacktestingRef = {
    reset: () => void;
};

const GridBacktesting = forwardRef<GridBacktestingRef, { rows: GridType[]; P: number }>(
    ({ rows, P }, ref) => {
        const [open, setOpen] = useState(false);

        const [summary, setSummary] = useState<ISummary>();
        const [isGraphPercentage, setIsGraphPercentage] = useState(false);
        const [isViewGrid, setIsViewGrid] = useState(false);
        const [holdstrategy, setSetHoldstrategy] = useState<StockData[]>([]);
        const [gridstrategy, setSetGridstrategy] = useState<StockData[]>([]);
        const [series, setSeries] = useState<GraphSeries[]>([]);
        const [viewGraph, setViewgraph] = useState(false);
        const [fields, setFields] = useState<ILabelValue[]>([]);

        const [flags, setFlags] = useState({
            buyOnGrid: true,
            sellOnGrid: true,
            commissionPercentage: "0",
            fixedCommission: "0",
        });

        const [decimalSeparator, setDecimalSeparator] = useState<string>(',');
        const [currency, setCurrency] = useState<string>('EUR');
        const [geid, setGEID] = useState<string>('10');

        /* ************ Handler ***************** */

        // Espone il metodo `reset` tramite la ref
        useImperativeHandle(ref, () => ({
            reset: () => {
                setViewgraph(false);
                console.log("GridBacktesting reset executed");
            },
        }));

        const handleFileLoad = (items: StockData[]) => {
            const h = HoldStrategy(rows, items);
            const g = GridStrategy(rows, items, flags);
            setSetHoldstrategy(h.stockdata);
            setSetGridstrategy(g.stockdata);

            setSeries([
                { data: h.stockdata, color: '#f44336', title: 'Hold Strategy' },
                { data: g.stockdata, color: '#4caf50', title: 'Grid Strategy' },
            ]);


            let gridProfit = 0;
            if (g.gridProfit) {
                gridProfit = g.gridProfit
            }
            let profitableTrades = 0;
            if (g.profitableTrades) {
                profitableTrades = g.profitableTrades
            }


            const f = [
                { label: "Initial Capital", value: g.stockdata[0].value.toFixed(2) + ` ${currency}` },
                { label: "Final Capital", value: g.stockdata[g.stockdata.length - 1].value.toFixed(2) + ` ${currency}` },
                { label: "Grid Strategy Gain", value: (100 * (g.stockdata[g.stockdata.length - 1].value - g.stockdata[0].value) / g.stockdata[0].value).toFixed(2) + `%` },
                { label: "Profitable Trades", value: profitableTrades.toString() },
                { label: "Grid Profit", value: gridProfit.toFixed(2) + ` ${currency}` }
            ];

            setFields(f);

            setViewgraph(true);

        };

        function buildSeries(percentage: boolean, grid: boolean) {

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



        // Load preferences from localStorage or set defaults
        useEffect(() => {
            const savedDecimalSeparator = localStorage.getItem('decimalSeparator') || '.';
            const savedCurrency = localStorage.getItem('currency') || 'USD';
            const savedGEID = localStorage.getItem('geid') || '10';

            setDecimalSeparator(savedDecimalSeparator);
            setCurrency(savedCurrency);
            setGEID(savedGEID);

        }, []);




        return (
            <>
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


                            <Typography className="text-blue-900" variant="h5" gutterBottom>
                                Backtesting Summary
                            </Typography>


                            <Box sx={{ padding: 2 }}>
                                <Grid container spacing={2}>
                                    {fields.map((field, index) => (
                                        <Grid item xs={4} key={index}>
                                            <Box>
                                                <Typography className='text-black' sx={{ marginBottom: 1 }}>
                                                    {field.label}
                                                </Typography>
                                                <TextField
                                                    value={field.value}
                                                    variant="outlined"
                                                    fullWidth
                                                    InputProps={{
                                                        readOnly: true,
                                                        sx: { textAlign: "right" }, // Allinea il testo a destra
                                                    }}
                                                    sx={{
                                                        backgroundColor: "white",
                                                    }}
                                                />
                                            </Box>
                                        </Grid>
                                    ))}
                                </Grid>
                            </Box>
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
                <Snackbar open={open} autoHideDuration={6000} onClose={() => { setOpen(false) }} anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}>
                    <Alert
                        severity="error"
                        variant="filled"
                        sx={{ width: '100%' }}
                    >
                        Input value are wrong
                    </Alert>
                </Snackbar>
            </>
        );
    });


export default GridBacktesting;