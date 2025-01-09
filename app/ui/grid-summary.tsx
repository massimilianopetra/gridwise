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

import { Card, Typography, Box, Grid, TextField } from '@mui/material';
import { GridType } from '@/app/lib/definitions';



export default function GridSummary({ rows, investment, P }: { rows: GridType[], investment: number, P: number }) {
  let qty = 0;
  let initInvestent = 0;
  let future = 0;
  rows.forEach((el) => {
    if (P < el.buyPrice) {
      qty += el.Quantity
      initInvestent += el.Quantity * P;

    } else {
      future += el.Quantity * el.buyPrice;
    }
  });

  const fields = [
    { label: "Proposed investment:", value: investment.toFixed(2) },
    { label: "Quantity purchased immediately:", value: qty.toFixed(5) },
    { label: "Capital allocated for the purchase: ", value: initInvestent.toFixed(2) },
    { label: "Reserved allocation for future purchases:", value: future.toFixed(2) },
    { label: "Residual capital not invested:", value: (investment - initInvestent - future).toFixed(2) },
    { label: "Estimated max grid profit", value: (rows[0].earn * 2.5 * rows.length).toFixed(2) },
    { label: "N. Grid ", value: rows.length },
    { label: "Single Grid Profit", value: rows[0].earn.toFixed(4) },
    { label: "Grid Step %", value: (100 * rows[0].earn / (rows[0].buyPrice/rows[0].Quantity)).toFixed(2) },

  ];

  return (
    <Card sx={{ maxWidth: 1200, margin: 'auto', padding: 2, backgroundColor: '#E0E0E0', borderRadius: '12px', }}>
      <div className='flex flex-col text-center'>
        <Typography className="text-blue-900" variant="h5" gutterBottom>
          Investment Summary
        </Typography>


        <Box sx={{ padding: 2 }}>
          <Grid container spacing={2}>
            {fields.map((field, index) => (
              <Grid item xs={4} key={index}>
                <Box>
                  <Typography variant="body1" sx={{ marginBottom: 1 }}>
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
      </div>
    </Card>
  );
}