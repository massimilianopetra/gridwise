'use client';

import Marquee from "@/app/ui/Marquee";

export default function Page() {

  const stockData = [
    { symbol: "AAPL", change: +2.5 },
    { symbol: "TSLA", change: -3.7 },
    { symbol: "AMZN", change: +1.2 },
    { symbol: "GOOGL", change: -0.8 },
    { symbol: "META", change: -2.3 },
    { symbol: "NFLX", change: +0.5 },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <Marquee 
        stocks={stockData} 
        description="Market Update:" 
        descriptionPadding={20} 
      />
    </div>
  );
};

