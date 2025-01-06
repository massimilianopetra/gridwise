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
import { Typography, Button, TextField } from '@mui/material';
import { StockData } from '@/app/lib/definitions'


interface CsvFileReaderProps {
    onFileLoad: (rows: StockData[]) => void;
}

const CsvFileReader: React.FC<CsvFileReaderProps> = ({ onFileLoad }) => {
    const [error, setError] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<string | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file.name);
            setError(null); // Reset error
        } else {
            setSelectedFile(null);
            setError("No file selected!");
            return;
        }

        const reader = new FileReader();

        reader.onload = (e) => {
            const text = e.target?.result as string;
            try {
                const parsedRows: StockData[] = text.split("\n").map((line, index) => {
                    const [time, value] = line.split(";");
                    //console.log(`label: ${label} value: ${value}`);

                    if (!time || isNaN(Number(value))) {
                        throw new Error(`Error at line ${index + 1}: invalid format.`);
                    }

                    return { time: time.trim(), value: parseFloat(value.trim()) };
                });

                setError(null);
                onFileLoad(parsedRows);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Unknown error.");
            }
        };

        reader.onerror = () => {
            setError("Error while reading file.");
        };

        reader.readAsText(file);
    };

    return (

        <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
                <Button
                    variant="contained"
                    component="label"
                    className="mb-4 h-12"
                >
                    Choose File
                    <input
                        type="file"
                        accept=".csv"
                        onChange={handleFileChange}
                        hidden
                    />
                </Button>
                <TextField
                    value={selectedFile || ""}
                    placeholder="No file chosen"
                    variant="outlined"
                    InputProps={{
                        readOnly: true,
                    }}
                    className="h-12 bg-white w-64"
                    sx={{
                        "& .MuiOutlinedInput-root": {
                            height: "3rem", // Uniforma l'altezza (circa 48px)
                            backgroundColor: "white", // Sfondo bianco
                        },
                    }}
                />
            </div>
            {error && <Typography color="error">{error}</Typography>}
        </div>

    );
};

export default CsvFileReader;
