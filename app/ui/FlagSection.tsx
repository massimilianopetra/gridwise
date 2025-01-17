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
  const [commissionPercentage, setCommissionPercentage] = useState("0");
  const [fixedCommission, setFixedCommission] = useState("0");

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
