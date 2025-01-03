'use client'

import { Card, Typography, Box } from '@mui/material';
import { GridType } from '@/app/lib/definitions';



export default function GridSummary({ rows,investment,P }: { rows: GridType[],investment:number,P:number }) {
    let qty = 0;
    let initInvestent = 0;
    let saved = 0;
    let future = 0;
    rows.forEach((el) => {
      if (P < el.buyPrice) {
        qty += el.Quantity
        initInvestent += el.Quantity * P;
        saved += el.Quantity * (el.buyPrice - P)

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
                    <p className='text-blue-900'>Total investment: {investment.toFixed(2)} </p>
                    <br></br>
                    <p className='text-blue-900'>Initial early buy quantity: {qty.toFixed(5)} </p>
                    <p className='text-blue-900'>Initial allocation for early buy: {initInvestent.toFixed(2)} </p>
                    <p className='text-blue-900'>Initial saved allocation: {saved.toFixed(2)} </p>
                    <br></br>
                    <p className='text-blue-900'>Reserved allocation for future purchases: {future.toFixed(2)} </p>
                    <br></br>
                </div>
            </div>
        </Card>
    );
}