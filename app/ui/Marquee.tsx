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

import React from "react";
import { Box, Typography } from "@mui/material";
import { StockMarketQuote } from "../lib/definitions";


interface MarqueeProps {
  stocks: StockMarketQuote[];
  description?: string; // Scritta descrittiva opzionale
  descriptionPadding?: number; // Numero di spazi bianchi prima della descrizione
}

const Marquee: React.FC<MarqueeProps> = ({
  stocks,
  description = "Stocks:",
  descriptionPadding = 5
}) => {
  // Creiamo uno spazio bianco personalizzabile prima della descrizione
  const paddedDescription = `${" ".repeat(descriptionPadding)}${description}`;

  return (
    <Box
      sx={{
        position: "relative",
        overflow: "hidden",
        width: "100%",
        backgroundColor: "#f9f9f9",
        border: "1px solid #ddd",
        display: "flex",
        alignItems: "center",
        height: "50px",
      }}
    >
      <Box
        component="div"
        sx={{
          display: "flex",
          whiteSpace: "nowrap",
          animation: "scroll 30s linear infinite",
        }}
      >
        {/* Scritta Descrittiva */}
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            marginRight: "32px",
          }}
        >
          <Typography sx={{ fontWeight: "bold", color: "#333" }}>
            {paddedDescription}
          </Typography>
        </Box>

        {/* Titoli */}
        {stocks.map((stock, index) => (
          <Box
            key={index}
            sx={{
              display: "inline-flex",
              alignItems: "center",
              marginRight: "32px",
            }}
          >
            <Typography
              sx={{
                display: "flex",
                alignItems: "center",
                color: stock.change >= 0 ? "green" : "red",
                fontWeight: "bold",
              }}
            >
              {stock.symbol}{" "}{stock.price}{" "}
              <span
                style={{
                  marginLeft: "8px",
                  color: stock.change >= 0 ? "green" : "red",
                }}
              >
                {stock.change >= 0 ? "▲" : "▼"}
              </span>{" "}
              <span style={{ marginLeft: "4px" }}>{stock.change.toFixed(2)}%</span>
            </Typography>
          </Box>
        ))}
      </Box>
      <style jsx>{`
        @keyframes scroll {
          from {
            transform: translateX(100%); /* Partenza da destra */
          }
          to {
            transform: translateX(-100%); /* Uscita completa a sinistra */
          }
        }
      `}</style>
    </Box>
  );
};

export default Marquee;
