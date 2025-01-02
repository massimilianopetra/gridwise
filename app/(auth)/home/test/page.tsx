'use client';

import React from 'react';
import TradingChart from '@/app/ui/TradingChart';
import { LineData } from 'lightweight-charts';

const Trading: React.FC = () => {
  const stockA: LineData[] = [
    { time: '2023-12-20', value: 100 },
    { time: '2023-12-21', value: 105 },
    { time: '2023-12-22', value: 110 },
    { time: '2023-12-23', value: 120 },
    { time: '2023-12-24', value: 115 },
    { time: '2023-12-25', value: 130 },
  ];

  const stockB: LineData[] = [
    { time: '2023-12-20', value: 900 },
    { time: '2023-12-21', value: 920 },
    { time: '2023-12-22', value: 910 },
    { time: '2023-12-23', value: 940 },
    { time: '2023-12-24', value: 930 },
    { time: '2023-12-25', value: 950 },
  ];

  return (
    <div className="bg-gray-900 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-3xl p-4">
        {/* Imposta larghezza per il contenitore del grafico */}
        <TradingChart
          series={[
            { data: stockA, color: '#4caf50', title: 'Stock A' },
            { data: stockB, color: '#f44336', title: 'Stock B' },
          ]}
          className="bg-gray-800  rounded-lg shadow-lg"
        />
      </div>
    </div>
  );
};

export default Trading;
