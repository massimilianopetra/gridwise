'use client';

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

import React, { useEffect, useRef } from 'react';
import { createChart, IChartApi, CandlestickData, } from 'lightweight-charts';

type CandlestickChartProps = {
  data: CandlestickData[];
  className?: string; // Classe CSS opzionale per il contenitore
};

const CandlestickChart: React.FC<CandlestickChartProps> = ({ data, className }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<IChartApi | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Ottieni il colore di sfondo dalla classe TailwindCSS applicata al contenitore
    const computedStyle = getComputedStyle(chartContainerRef.current);
    const backgroundColor = computedStyle.backgroundColor;

    // Crea il grafico
    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 400,
      layout: {
        background: { color: backgroundColor }, // Imposta il colore di sfondo
        textColor: '#d1d4dc',
      },
      grid: {
        vertLines: { color: '#2b2b43' },
        horzLines: { color: '#363c4e' },
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
      },
    });

    const series = chart.addCandlestickSeries({
      upColor: '#4caf50',
      downColor: '#f44336',
      borderVisible: true,
      wickUpColor: '#4caf50',
      wickDownColor: '#f44336',
    });

    series.setData(data);

    chartInstance.current = chart;

    // Cleanup quando il componente viene smontato
    return () => chart.remove();
  }, [data]);

  return <div ref={chartContainerRef} className={className} style={{ position: 'relative' }} />;
};

export default CandlestickChart;
