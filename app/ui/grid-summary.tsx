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

import { Card, Typography, Box } from '@mui/material';
import { GridType } from '@/app/lib/definitions';



export default function GridSummary({ rows,investment,P }: { rows: GridType[],investment:number,P:number }) {
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

    return (
        <Card sx={{ maxWidth: 1200, margin: 'auto', padding: 2, backgroundColor: '#E0E0E0', borderRadius: '12px', }}>
            <div className='flex flex-col text-center'>
                <Typography className="text-blue-900" variant="h5" gutterBottom>
                    Investment Summary
                </Typography>
                <div className='text-left'>
                    <p className='text-blue-900'>Proposed investment: {investment.toFixed(2)} </p>
                    <br></br>
                    <p className='text-blue-900'>Quantity purchased immediately: {qty.toFixed(5)} </p>
                    <p className='text-blue-900'>Capital allocated for the purchase: {initInvestent.toFixed(2)} </p>
                    <p className='text-blue-900'>Reserved allocation for future purchases: {future.toFixed(2)} </p>
                    <br></br>
                    <p className='text-blue-900'>Residual capital not invested: {(investment-initInvestent-future).toFixed(2)} </p>
                    <br></br>
                </div>
            </div>
        </Card>
    );
}