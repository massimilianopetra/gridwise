'use client'

import React, { useState, useEffect } from "react";
import { Box, Button, Typography, Snackbar, Alert } from "@mui/material";

const CookieConsent = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      setOpen(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookie-consent", "true");
    setOpen(false);
  };

  return (
    <Snackbar
      open={open}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
      <Alert
        severity="info"
        action={
          <Button
            color="inherit"
            size="small"
            onClick={handleAccept}
          >
            Accept
          </Button>
        }
      >
        This site uses cookies to manage user login authorization. By continuing
        to use this site, you accept our cookie policy.
      </Alert>
    </Snackbar>
  );
};

export default CookieConsent;
