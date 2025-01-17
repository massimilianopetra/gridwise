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

import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  MenuItem,
  Button,
  Paper,
  Snackbar,
  Alert,
} from '@mui/material';

export default function Page() {
  const [decimalSeparator, setDecimalSeparator] = useState<string>(',');
  const [currency, setCurrency] = useState<string>('EUR');
  const [geid, setGEID] = useState<string>('10');
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);

  // Load preferences from localStorage or set defaults
  useEffect(() => {
    const savedDecimalSeparator = localStorage.getItem('decimalSeparator') || '.';
    const savedCurrency = localStorage.getItem('currency') || 'USD';
    const savedGEID =  localStorage.getItem('geid') || '10';

    setDecimalSeparator(savedDecimalSeparator);
    setCurrency(savedCurrency);
    setGEID(savedGEID);
  }, []);

  // Save preferences to localStorage
  const saveSettings = () => {
    localStorage.setItem('decimalSeparator', decimalSeparator);
    localStorage.setItem('currency', currency);
    localStorage.setItem('geid', geid);
    setSnackbarOpen(true); // Show Snackbar on save
  };

  // Close Snackbar
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography className="text-blue-900 text-center" variant="h5" gutterBottom>
          Settings
        </Typography>

        <Box component="form" noValidate autoComplete="off" sx={{ mt: 3 }}>
          {/* Decimal Separator Field */}
          <Typography className="text-blue-900" variant="body1" sx={{ mb: 1 }}>
            Decimal Separator Import/Export CSV
          </Typography>
          <TextField
            select
            fullWidth
            variant="standard"
            value={decimalSeparator}
            onChange={(e) => setDecimalSeparator(e.target.value)}
          >
            <MenuItem value=",">Comma (,)</MenuItem>
            <MenuItem value=".">Dot (.)</MenuItem>
          </TextField>

          {/* Currency Field */}
          <Typography className="text-blue-900" variant="body1" sx={{ mt: 3, mb: 1 }}>
            Currency
          </Typography>
          <TextField
            select
            fullWidth
            variant="standard"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
          >
            <MenuItem value="EUR">EUR (€)</MenuItem>
            <MenuItem value="USD">USD ($)</MenuItem>
            <MenuItem value="GBP">GBP (£)</MenuItem>
          </TextField>

          {/* Currency Field */}
          <Typography className="text-blue-900" variant="body1" sx={{ mt: 3, mb: 1 }}>
            Grid Engine Iteration Default
          </Typography>
          <TextField
            select
            fullWidth
            variant="standard"
            value={geid}
            onChange={(e) => setGEID(e.target.value)}
          >
            <MenuItem value="1">1 Iteration </MenuItem>
            <MenuItem value="5">5 Iteration</MenuItem>
            <MenuItem value="10">10 Iteration</MenuItem>
            <MenuItem value="20">20 Iteration</MenuItem>
          </TextField>

          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={saveSettings}
              sx={{ textTransform: 'none' }}
            >
              Save Settings
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Snackbar for success message */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          Settings saved successfully!
        </Alert>
      </Snackbar>
    </Container>
  );
};


