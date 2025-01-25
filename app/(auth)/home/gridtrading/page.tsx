"use client";

import { useEffect, useState } from "react";
import { Tabs, Tab, Box, Typography } from "@mui/material";
import TabContent1 from "./TabContent1";
import TabContent2 from "./TabContent2";
import TabContent3 from "./TabContent3";
import Marquee from "@/app/ui/Marquee";
import { StockMarketQuote } from '@/app/lib/definitions';
import { GetCryptoQuote } from '@/app/lib/utility';


const Page = () => {

  const [activeTab, setActiveTab] = useState(0);

  const [decimalSeparator, setDecimalSeparator] = useState<string>(',');
  const [currency, setCurrency] = useState<string>('EUR');
  const [geid, setGEID] = useState<string>('10');
  const [stock, setStock] = useState<StockMarketQuote[]>([]);

  // Load preferences from localStorage or set defaults
  useEffect(() => {
    const savedDecimalSeparator = localStorage.getItem('decimalSeparator') || '.';
    const savedCurrency = localStorage.getItem('currency') || 'USD';
    const savedGEID = localStorage.getItem('geid') || '10';

    setDecimalSeparator(savedDecimalSeparator);
    setCurrency(savedCurrency);
    setGEID(savedGEID);

    const fetchData = async () => {
      const stock = await GetCryptoQuote();
      setStock(stock);
    };

    // Call fetchData immediately
    fetchData();

    // Set an interval to call fetchData every minute (60000 ms)
    const interval = setInterval(() => {
      fetchData();
    }, 60000);

    // Cleanup function to clear interval
    return () => clearInterval(interval);
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (

    <div className="max-w-full">
      <div style={{ padding: "20px" }}>
        <Marquee
          stocks={stock}
          description="Market Update:"
          descriptionPadding={20}
        />
      </div>
      <br></br>
      {/* Titolo principale */}
      <Typography className="text-black text-center font-bold " style={{ fontSize: '4rem' }}>
        Grid Trading Tools
      </Typography>
      {/* Unico box per tab e contenuti */}
      <Box className="bg-white shadow-md rounded-lg border border-gray-200 min-h-screen w-full">

        {/* Tabs con bordatura inferiore condivisa */}
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          textColor="primary"
          indicatorColor="primary"
          className="border-b border-gray-200"
        >
          <Tab
            label="Compute"
            className={`text-sm font-medium ${activeTab === 0 ? "text-blue-600" : "text-gray-500"
              }`}
          />
          <Tab
            label="Run"
            className={`text-sm font-medium ${activeTab === 1 ? "text-blue-600" : "text-gray-500"
              }`}
          />
          <Tab
            label="Analysis"
            className={`text-sm font-medium ${activeTab === 2 ? "text-blue-600" : "text-gray-500"
              }`}
          />
        </Tabs>

        {/* Contenuti dei tab */}
        <br></br>
        {activeTab === 0 && <TabContent1 />}
        {activeTab === 1 && <TabContent2 />}
        {activeTab === 2 && <TabContent3 />}

      </Box>
    </div>

  );
};

export default Page;
