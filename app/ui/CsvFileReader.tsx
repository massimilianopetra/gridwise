import React, { useState } from "react";
import { Card, Typography, Button } from '@mui/material';

interface Row {
    label: string;
    value: number;
}

interface CsvFileReaderProps {
    onFileLoad: (rows: Row[]) => void;
}

const CsvFileReader: React.FC<CsvFileReaderProps> = ({ onFileLoad }) => {
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onload = (e) => {
            const text = e.target?.result as string;
            try {
                const parsedRows: Row[] = text.split("\n").map((line, index) => {
                    const [label, value] = line.split(";");
                    //console.log(`label: ${label} value: ${value}`);

                    if (!label || isNaN(Number(value))) {
                        throw new Error(`Error at line ${index + 1}: invalid format.`);
                    }

                    return { label: label.trim(), value: parseFloat(value.trim()) };
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
        <Card sx={{ maxWidth: 1200, margin: 'auto', padding: 2, backgroundColor: '#E0E0E0', borderRadius: '12px', }}>
            <Typography className="text-blue-900" variant="h5" gutterBottom>
                Load CSV for Backtesting
            </Typography>
            <Button
                variant="contained"
                component="label"
                className="mb-4"
            >
                Choose File
                <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                    hidden
                />
            </Button>
            {error && <Typography color="error">{error}</Typography>}
        </Card>
    );
};

export default CsvFileReader;
