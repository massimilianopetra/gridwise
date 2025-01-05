import React, { useState } from "react";
import { Box, Typography, Checkbox, FormControlLabel, TextField, Paper } from "@mui/material";

interface FlagSectionProps {
  onFlagsChange: (flags: { buyOnGrid: boolean; sellOnGrid: boolean }) => void;
  onCommissionChange: (data: { commissionPercentage: string; fixedCommission: string }) => void;
}

const FlagSection: React.FC<FlagSectionProps> = ({ onFlagsChange, onCommissionChange }) => {
  const [flags, setFlags] = useState({
    buyOnGrid: false,
    sellOnGrid: false,
  });
  const [commissionPercentage, setCommissionPercentage] = useState("");
  const [fixedCommission, setFixedCommission] = useState("");

  const handleFlagChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedFlags = { ...flags, [event.target.name]: event.target.checked };
    setFlags(updatedFlags);
    onFlagsChange(updatedFlags);
  };

  const handleInputChange =
    (setter: React.Dispatch<React.SetStateAction<string>>, key: string) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setter(value);
      onCommissionChange({
        commissionPercentage: key === "commissionPercentage" ? value : commissionPercentage,
        fixedCommission: key === "fixedCommission" ? value : fixedCommission,
      });
    };

  return (
    <Paper elevation={3} sx={{ p: 2, maxWidth: 1000, margin: "0 auto" }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" gap={2}>
        {/* Flag Section */}
        <Box display="flex" alignItems="center" gap={2}>
          <FormControlLabel
            control={
              <Checkbox
                checked={flags.buyOnGrid}
                onChange={handleFlagChange}
                name="buyOnGrid"
                color="primary"
              />
            }
            label="Buy exact grid price"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={flags.sellOnGrid}
                onChange={handleFlagChange}
                name="sellOnGrid"
                color="primary"
              />
            }
            label="Sell exact gird price"
          />
        </Box>

        {/* Commission Section */}
        <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
          <TextField
            label="Commission (%)"
            type="number"
            value={commissionPercentage}
            onChange={handleInputChange(setCommissionPercentage, "commissionPercentage")}
            size="small"
            sx={{ maxWidth: 150 }}
          />
          <TextField
            label="Fixed Fee (EUR)"
            type="number"
            value={fixedCommission}
            onChange={handleInputChange(setFixedCommission, "fixedCommission")}
            size="small"
            sx={{ maxWidth: 150 }}
          />
        </Box>
      </Box>
    </Paper>
  );
};

export default FlagSection;
