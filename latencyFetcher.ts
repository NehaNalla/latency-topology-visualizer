// utils/latencyFetcher.ts
// utils/latencyFetcher.ts
import { collection, getDocs, query, where, Timestamp } from "firebase/firestore";
import { db } from '../utils/firebase';// Adjust if your firebase config path is different

// utils/latencyFetcher.ts



// utils/latencyFetcher.ts



export type ServerData = {
  exchange: string;
  cloud: "AWS";
  timestamp: Timestamp;
  lat: number;
  lng: number;
  latency: number; // in ms
};

// Fetch all servers' latest latency data
export async function fetchServers(): Promise<ServerData[]> {
  try {
    const snap = await getDocs(collection(db, "latency_snapshots"));
    return snap.docs.map((doc) => doc.data() as ServerData);
  } catch (error) {
    console.error("Error fetching latency data:", error);
    return [];
  }
}

// Optional: Fetch historical latency data by exchange and time range
export async function fetchHistoricalLatency(
  exchange: string,
  startTime: number
): Promise<ServerData[]> {
  const q = query(
    collection(db, "latency_snapshots"),
    where("exchange", "==", exchange),
    where("timestamp", ">", Timestamp.fromMillis(startTime))
  );

  try {
    const snap = await getDocs(q);
    return snap.docs.map((doc) => doc.data() as ServerData);
  } catch (error) {
    console.error("Error fetching historical latency data:", error);
    return [];
  }
}