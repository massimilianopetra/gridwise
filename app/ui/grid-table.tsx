'use client'

import { Card, Typography, Box } from '@mui/material';
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { GridType } from '@/app/lib/definitions';



export default function GridTable({ rows }: { rows: GridType[] }) {

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
      </div>
    </Card>
  );
}