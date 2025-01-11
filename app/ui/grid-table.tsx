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

import React, { useState } from 'react';
import { Card, Typography, Box, Button, TextField } from '@mui/material';
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { GridType } from '@/app/lib/definitions';



export default function GridTable({ rows }: { rows: GridType[] }) {

  const [fileName, setFileName] = useState('exported_data.csv'); // Nome del file predefinito

  // Funzione per convertire i dati in CSV senza virgolette
  const convertToCSV = (data: typeof rows) => {
    const headers = Object.keys(data[0]); // Intestazioni
    const csvRows = data.map((row) =>
      headers.map((header) => row[header as keyof typeof row]).join(';')
    );
    return [headers.join(';'), ...csvRows].join('\n');
  };

  // Funzione per esportare i dati
  const handleExportCSV = () => {
    const csvData = convertToCSV(rows);
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;

    // Usa il nome del file scelto dall'utente
    link.setAttribute('download', fileName);
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
          <TextField
            label="File Name"
            variant="outlined"
            size="small"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            sx={{ marginRight: 2 }}
          />
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