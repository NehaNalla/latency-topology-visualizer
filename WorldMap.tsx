// components/WorldMap.tsx
// components/WorldMap.tsx
'use client';
import  React, { useEffect, useState , useRef} from 'react';
import dynamic from 'next/dynamic';

// components/WorldMap.tsx


import Globe from "react-globe.gl";
import type { ServerData } from "../utils/latencyFetcher";
import { fetchServers } from "../utils/latencyFetcher";
import { HexagonLayer } from 'deck.gl';







const getColor = (latency: number): string =>
  latency < 50 ? "green" : latency < 100 ? "yellow" : "red";

const getColorRGBA = (latency: number): [number, number, number, number] => {
  if (latency < 50) return [0, 255, 0, 150];
  if (latency < 100) return [255, 255, 0, 180];
  return [255, 0, 0, 200];
};

const cloudColors: Record<string, string> = {
  AWS: "#1e90ff",
  GCP: "#ff6f61",
  Azure: "#9370db",
};

export default function WorldMap() {
  const globeRef = useRef<any>(null);
  const [servers, setServers] = useState<ServerData[]>([]);
  const [selectedCloud, setSelectedCloud] = useState<string | null>(null);

  useEffect(() => {
    fetchServers().then(setServers).catch(console.error);
  }, []);

  const filteredServers = selectedCloud
    ? servers.filter((s) => s.cloud === selectedCloud)
    : servers;

  const heatmapData = filteredServers.map((d) => ({
    lat: d.lat,
    lng: d.lng,
    value: d.latency,
  }));

  return (
    <div style={{ width: "100%", height: "80vh", position: "relative" }}>
      <Globe
        ref={globeRef}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
        backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
        pointsData={filteredServers}
        pointLat={(d: ServerData) => d.lat}
        pointLng={(d: ServerData) => d.lng}
        pointColor={(d: ServerData) => cloudColors[d.cloud] || getColor(d.latency)}
        pointAltitude={0.02}
        pointLabel={(d: ServerData) => '${d.exchange} - ${d.latency}ms - ${d.cloud}'}
        onPointClick={(d: ServerData) => alert('${d.exchange} @ ${d.region}')}
        hexPolygonsData={heatmapData}
        hexPolygonColor={(d: any) => getColorRGBA(d.value)}
        hexPolygonResolution={3}
      />

      <div
        style={{
          position: "absolute",
          top: 10,
          left: 10,
          background: "rgba(255,255,255,0.9)",
          padding: "10px",
          borderRadius: "8px",
          fontSize: "14px",
        }}
      >
        <div><strong>Legend:</strong></div>
        <div><span style={{ color: "green" }}>●</span> &lt; 50ms</div>
        <div><span style={{ color: "yellow" }}>●</span> 50–100ms</div>
        <div><span style={{ color: "red" }}>●</span> &gt; 100ms</div>
        <hr />
        <div><strong>Cloud Filters:</strong></div>
        <button onClick={() => setSelectedCloud(null)}>All</button>
        <button onClick={() => setSelectedCloud("AWS")}>AWS</button>
        <button onClick={() => setSelectedCloud("GCP")}>GCP</button>
        <button onClick={() => setSelectedCloud("Azure")}>Azure</button>
      </div>
    </div>
  );
}