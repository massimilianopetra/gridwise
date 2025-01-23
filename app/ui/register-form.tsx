import React, { useState, useEffect } from 'react';
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
import { addUsers } from '../lib/actions';
import Link from 'next/link';
import { getValueByKey } from '../lib/actions';

export default function RegisterForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'error' | 'success'>('error');
  const [showForm, setShowForm] = useState(true);
  const [enteredCode, setEnteredCode] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0); // tempo rimanente in secondi

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleSubmitVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    // Logica di verifica del codice
    const activationCode = await getValueByKey(email);
    console.log(`EnteredcCode ${enteredCode} - ${activationCode}`)

    if (enteredCode.toString() == activationCode) {
      setIsVerified(true);

      //console.log(`TRY TO ADD USER ${email} ${password}`);
      await addUsers(email, "USER", password);
      console.log('USER ADDED');

    } else {
      alert('Invalid code, please try again.');
      setSnackbarMessage('Invalid code, please try again.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleResendCode = async () => {

    await fetch('/api/activation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: email}),
    });

    // Imposta il cooldown a 3 minuti (180 secondi)
    setResendCooldown(180);
  };

  const handleSubmit = async (event: React.FormEvent) => {
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
    setShowForm(false);

    await fetch('/api/activation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: email }),
    });

  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <div className="flex flex-col items-center p-4 bg-white">
      <Typography className="text-black mb-4 text-4xl">
        Register
      </Typography>
      {showForm ?
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
            className='text-black text-xs'
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
        :
        <>
          <Typography variant="body1" align="center">
            A verification email has been sent to <strong>{email}</strong> with the <strong>activationCode</strong>.
            Please check your inbox, and if you do not see the email, kindly check your spam folder.
          </Typography>
          <Box sx={{ maxWidth: 400, mx: 'auto', p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {!isVerified ? (
              <>
                <Typography variant="h5" gutterBottom>
                  Verify Your Email
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  Please enter the activation code sent to your email.
                </Typography>
                <TextField
                  label="Activation Code"
                  variant="outlined"
                  fullWidth
                  value={enteredCode}
                  onChange={(e) => setEnteredCode(e.target.value)}
                  sx={{ mb: 2 }}
                />
                <Button variant="contained" color="primary" onClick={handleSubmitVerify} fullWidth>
                  Verify Code
                </Button>
                <Button
                  variant="text"
                  color="secondary"
                  onClick={handleResendCode}
                  fullWidth
                  sx={{ mt: 2 }}
                  disabled={resendCooldown > 0} // Disabilita il pulsante se c'è un cooldown
                >
                  {resendCooldown > 0 ? `Resend Code (${resendCooldown}s)` : 'Resend Code'}
                </Button>
              </>
            ) : (
              <>
                <Typography variant="body1" align="center">
                  Your email has been successfully verified!
                </Typography>
                <Link className="text-blue-700" href="/login" passHref>

                  Proceed to login page

                </Link>
              </>
            )}
          </Box>
        </>
      }

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
