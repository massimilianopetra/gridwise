import React from 'react';
import CandlestickChart from '@/app/ui/CandlestickChart';
import { CandlestickData } from 'lightweight-charts';

const Home: React.FC = () => {
  // Dati di esempio
  const mockData: CandlestickData[] = [
    { time: '2022-01-01', open: 100, high: 110, low: 90, close: 105 },
    { time: '2022-01-02', open: 105, high: 115, low: 95, close: 100 },
    { time: '2022-01-03', open: 100, high: 120, low: 85, close: 110 },
    { time: '2022-01-04', open: 110, high: 125, low: 100, close: 120 },
    { time: '2022-01-05', open: 120, high: 130, low: 110, close: 115 },
    { time: '2022-01-06', open: 115, high: 135, low: 105, close: 130 },
    { time: '2022-01-07', open: 130, high: 140, low: 120, close: 125 },
    { time: '2022-01-08', open: 125, high: 145, low: 115, close: 135 },
    { time: '2022-01-09', open: 135, high: 150, low: 130, close: 140 },
    { time: '2022-01-10', open: 140, high: 155, low: 125, close: 150 },
  ];

  return (
    <div className=''>
      <h1 style={{ textAlign: 'center', color: '#fff', marginBottom: '20px' }}>Grafico a Candele</h1>
      <CandlestickChart  className="bg-gray-800" data={mockData} />
    </div>
  );
};

export default Home;s
