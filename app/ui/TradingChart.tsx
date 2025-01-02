'use client';

import React, { useEffect, useRef } from 'react';
import { createChart, IChartApi, LineData, } from 'lightweight-charts';

type Series = {
  data: LineData[];
  color: string; // Colore della linea
  title?: string; // Titolo opzionale per la serie
};

type TradingChartProps = {
  series: Series[]; // Lista di serie di dati
  className?: string; // Classe CSS opzionale per personalizzazione
};

const TradingChart: React.FC<TradingChartProps> = ({ series, className }) => {
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
        background: { color: backgroundColor },
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

    // Aggiungi serie con opzioni personalizzate
    series.forEach(({ data, color, title }, index) => {
      const lineSeries = chart.addLineSeries({
        color,
        lineWidth: 2,
        //priceScaleId: index === 0 ? 'right' : 'left', // Usa asse Y separato per la seconda serie
      });
      lineSeries.setData(data);

      // Aggiungi titolo opzionale
      if (title) {
        lineSeries.applyOptions({ title });
      }
    });

    chartInstance.current = chart;

    // Cleanup quando il componente viene smontato
    return () => chart.remove();
  }, [series]);

  return <div ref={chartContainerRef} className={className} style={{ position: 'relative' }} />;
};

export default TradingChart;
