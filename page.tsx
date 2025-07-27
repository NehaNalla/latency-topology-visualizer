"use client";
import dynamic from "next/dynamic";
import Head from "next/head";
import { useState } from "react";
import  LatencyChart from "../../components/LatencyChart";
const WorldMap = dynamic(() => import("../../components/WorldMap"), {
  ssr: false,
});

export default function Home() {
  const [source, setSource] = useState("Binance");
  const [destination, setDestination] = useState("Bybit");
  const [range, setRange] = useState<"1h" | "24h" | "7d">("24h");
  return (
    <>
      <Head>
        <title>Latency Topology Visualizer</title>
      </Head>
      <main className="w-full h-screen bg-gray-900 text-white">
        <div className="absolute z-10 top-4 left-4 bg-white/10 p-4 rounded-xl backdrop-blur">
          <h1 className="text-2xl font-semibold">Latency Topology Visualizer</h1>
          <p className="text-sm text-gray-300">3D Map of Crypto Exchange Server Latency</p>
        </div>
        <div>
        <WorldMap />
        </div>
        <span/>

        
        <div className="controls">
        <select value={source} onChange={e => setSource(e.target.value)}>
          <option>Binance</option>
          <option>Bybit</option>
          <option>OKX</option>
        </select>
        <select value={destination} onChange={e => setDestination(e.target.value)}>
          <option>Bybit</option>
          <option>Binance</option>
          <option>OKX</option>
        </select>
        <select value={range} onChange={e => setRange(e.target.value as any)}>
          <option value="1h">1h</option>
          <option value="24h">24h</option>
          <option value="7d">7d</option>
        </select>
      </div>
      <div className="w-full h-84 bg-gray-800 rounded-xl p-4">
        <LatencyChart />
        </div>
      </main>
    </>
  );
}

