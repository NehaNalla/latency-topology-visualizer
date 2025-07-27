
// components/LatencyChart.tsx
// components/LatencyChart.tsx
// components/LatencyChart.tsx
// utils/latencyFetcher.ts
"use client";
//import React,{ useEffect, useState } from 'react';



//import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
//import  {fetchServers,ServerData}  from "../utils/latencyFetcher";

//import { useEffect, useState } from "react";
//import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";






import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { fetchServers, ServerData } from "../utils/latencyFetcher";
import ThemeToggle from "./ThemeToggle";

const timeRanges = {
  "1h": 60 * 60 * 1000,
  "24h": 24 * 60 * 60 * 1000,
  "7d": 7 * 24 * 60 * 60 * 1000,
  "30d": 30 * 24 * 60 * 60 * 1000,
};

type ChartData = {
  time: string;
  latency: number;
};

export default function LatencyChart() {
  const [data, setData] = useState<ChartData[]>([]);
  const [sourceExchange, setSourceExchange] = useState("Binance");
  const [timeRange, setTimeRange] = useState("24h");
  const [stats, setStats] = useState({ min: 0, max: 0, avg: 0 });

  useEffect(() => {
    async function fetchData() {
      const res = await fetch("../../pages/api/historocal");
      const allData = await res.json();

      const now = Date.now();
      const filtered = allData.filter(
        (d: any) =>
          d.exchange === sourceExchange &&
          now - d.timestamp < timeRanges[timeRange]
      );

      const chartData = filtered.map((d: any) => ({
        time: new Date(d.timestamp).toLocaleTimeString(),
        latency: d.latency,
      }));

      setData(chartData);

      // Calculate statistics
      const latencies = chartData.map((d) => d.latency);
      if (latencies.length > 0) {
        const min = Math.min(...latencies);
        const max = Math.max(...latencies);
        const avg =
          latencies.reduce((acc, val) => acc + val, 0) / latencies.length;
        setStats({ min, max, avg: parseFloat(avg.toFixed(2)) });
      } else {
        setStats({ min: 0, max: 0, avg: 0 });
      }
    }

    fetchData();
  }, [sourceExchange, timeRange]);

  // Export data as CSV
  function handleExportCSV() {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["Time,Latency"].concat(
        data.map((d) => '${d.time},${d.latency}')
      ).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", 'latency_${sourceExchange}_${timeRange}.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div className="p-4">
      <div className="flex gap-4 mb-4">
        <select
          value={sourceExchange}
          onChange={(e) => setSourceExchange(e.target.value)}
          className="p-2 rounded border"
        >
          <option>Binance</option>
          <option>Bybit</option>
          <option>OKX</option>
          <option>Deribit</option>
        </select>

        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="p-2 rounded border"
        >
          {Object.keys(timeRanges).map((range) => (
            <option key={range}>{range}</option>
          ))}
        </select>
        <ThemeToggle/>
        <button
          onClick={handleExportCSV}
          className="p-2 bg-blue-500 text-white rounded"
        >
          Export CSV
        </button>
      </div>

      <div className="text-sm text-gray-700 mb-2">
        <strong>Stats:</strong> Min: {stats.min} ms | Max: {stats.max} ms | Avg: {stats.avg} ms
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <XAxis dataKey="time" />
          <YAxis dataKey="latency" unit="ms" />
          <Tooltip />
          <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
          <Line
            type="monotone"
            dataKey="latency"
            stroke="#8884d8"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}