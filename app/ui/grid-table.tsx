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

import React, { useEffect, useState } from 'react';
import { Card, Typography, Box, Button, TextField } from '@mui/material';
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { GridType } from '@/app/lib/definitions';
import { convertToCSV } from '../lib/utility';



export default function GridTable({ rows }: { rows: GridType[] }) {

  const [decimalSeparator, setDecimalSeparator] = useState<string>(',');
  const [currency, setCurrency] = useState<string>('EUR');

  // Load preferences from localStorage or set defaults
  useEffect(() => {
    const savedDecimalSeparator = localStorage.getItem('decimalSeparator') || '.';
    const savedCurrency = localStorage.getItem('currency') || 'USD';

    setDecimalSeparator(savedDecimalSeparator);
    setCurrency(savedCurrency);
  }, []);

  const handleExportCSV = () => {
    const csvData = convertToCSV(rows, decimalSeparator);
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
  
    const link = document.createElement('a');
    link.href = url;
  
    // Usa il nome del file scelto dall'utente
    link.setAttribute('download', 'exported_grid.csv');
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

        const color = params.row.status ? 'red' : 'green';

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

        const color = params.row.status ? 'black' : 'red';

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
            {params.row.status ? "Wait to sell" : "Wait to buy"}
          </span>
        );
      },
    },

  ];



  return (
    <Card sx={{ maxWidth: 1200, margin: 'auto', padding: 2, backgroundColor: '#E0E0E0', borderRadius: '12px', }}>
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
        <div className="flex items-center justify-between mt-4">
          <Button
            variant="contained"
            color="primary"
            onClick={handleExportCSV}
          >
            Export to CSV
          </Button>
        </div>
      </div>
    </Card>
  );
}