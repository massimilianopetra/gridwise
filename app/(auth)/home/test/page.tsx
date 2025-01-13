'use client';

import React, { useState } from "react";
import { parseCsv } from "@/app/lib/utility"

type GridType = {
  id: number;
  Quantity: number;
  buyPrice: number;
  capital: number;
  sellPrice: number;
  earn: number;
  status: boolean;
};

const CsvReader: React.FC = () => {
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [parsedData, setParsedData] = useState<GridType[] | null>(null);
  const [decimalSeparator, setDecimalSeparator] = useState<string>(".");

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setFileContent(e.target.result as string);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleParseCsv = () => {
    if (!fileContent) {
      alert("Please upload a file first!");
      return;
    }

    try {
      const typeDef: GridType = {
        id: 0,
        Quantity: 0,
        buyPrice: 0,
        capital: 0,
        sellPrice: 0,
        earn: 0,
        status: false,
      };

      const data = parseCsv<GridType>(fileContent, decimalSeparator, typeDef);
      setParsedData(data);
    } catch (error) {
      console.error("Error parsing CSV:", error);
      alert("Invalid CSV format. Please check your file.");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">CSV File Reader</h1>

      {/* Selezione del separatore decimale */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Decimal Separator
        </label>
        <select
          value={decimalSeparator}
          onChange={(e) => setDecimalSeparator(e.target.value)}
          className="border rounded px-3 py-2 w-full"
        >
          <option value=".">Dot (.)</option>
          <option value=",">Comma (,)</option>
        </select>
      </div>

      {/* Input file */}
      <div className="mb-4">
        <input
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          className="border rounded px-3 py-2 w-full"
        />
      </div>

      {/* Bottone per analizzare il CSV */}
      <button
        onClick={handleParseCsv}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Parse CSV
      </button>

      {/* Dati analizzati */}
      {parsedData && (
        <div className="mt-4">
          <h2 className="text-lg font-bold mb-2">Parsed Data:</h2>
          <pre className="bg-gray-100 p-2 rounded">
            {JSON.stringify(parsedData, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default CsvReader;


