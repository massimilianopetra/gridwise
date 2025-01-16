import React, { useState } from 'react';
import {
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  InputAdornment,
  Typography,
  Snackbar,
  Box,
  Alert,
} from '@mui/material';
import { AtSymbolIcon, KeyIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function RegisterForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'error' | 'success'>('error');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setSnackbarMessage('Please enter a valid email address.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    if (password.length < 6) {
      setSnackbarMessage('Password must be at least 6 characters long.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    if (password !== confirmPassword) {
      setSnackbarMessage('Passwords do not match.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    if (!termsAccepted) {
      setSnackbarMessage('You must accept the terms and conditions to register.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    // Handle registration logic here
    setSnackbarMessage('Registration successful!');
    setSnackbarSeverity('success');
    setSnackbarOpen(true);
    console.log('Registration successful:', { email, password });
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <div className="flex flex-col items-center p-4">
      <Typography variant="h5" component="h1" gutterBottom>
        Register
      </Typography>
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        <TextField
          fullWidth
          label="Email"
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <AtSymbolIcon className="h-5 w-5" />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          fullWidth
          label="Password"
          type="password"
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <KeyIcon className="h-5 w-5" />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          fullWidth
          label="Confirm Password"
          type="password"
          variant="outlined"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <KeyIcon className="h-5 w-5" />
              </InputAdornment>
            ),
          }}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              color="primary"
            />
          }
          label="I have read and agree to the terms and conditions"
        />
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Button
            fullWidth
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mb: 2 }}
          >
            Register
          </Button>

          <Link href="/terms-of-use" passHref>
            <Typography
              color="primary"
              sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
            >
              Terms of Use
            </Typography>
          </Link>
        </Box>
      </form>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}
