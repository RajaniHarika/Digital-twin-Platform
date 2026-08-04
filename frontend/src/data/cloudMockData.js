export const cloudMockData = {
  header: {
    title: "Cloud Engineer Dashboard",
    provider: "AWS",
    region: "us-east-1",
  },
  kpis: {
    totalInstances: 145,
    monthlySpend: 24500,
    costTrend: "+5.2%",
    totalStorage: "125 TB",
    storageTrend: "+2.1%",
    activeNodes: 138,
  },
  resourceUtilization: {
    cpu: 68,
    memory: 74,
    disk: 52,
    network: 41,
  },
  nodeCapacity: [
    { id: 'node-worker-01', state: 'running', cpu: 45, memory: 60, storage: 20, network: 35 },
    { id: 'node-worker-02', state: 'warning', cpu: 82, memory: 92, storage: 85, network: 75 },
    { id: 'node-db-01', state: 'running', cpu: 30, memory: 45, storage: 15, network: 20 },
    { id: 'node-cache-01', state: 'stopped', cpu: 0, memory: 0, storage: 50, network: 0 },
    { id: 'node-api-01', state: 'running', cpu: 95, memory: 88, storage: 70, network: 85 },
  ],
  costAnalysis: [
    { name: 'Compute', value: 12500, color: '#C7FF3A' },
    { name: 'Database', value: 6200, color: '#94C600' },
    { name: 'Storage', value: 3800, color: '#111111' },
    { name: 'Networking', value: 1500, color: '#565656' },
  ],
  storageUsage: {
    total: 150,
    used: 125,
    free: 25,
    percentage: 83.33,
    breakdown: [
      { type: 'Block Storage', value: 85, color: '#C7FF3A' },
      { type: 'Object Storage', value: 25, color: '#94C600' },
      { type: 'Archive', value: 15, color: '#111111' },
    ]
  },
  networkTraffic: [
    { time: '00:00', inbound: 450, outbound: 280 },
    { time: '04:00', inbound: 320, outbound: 150 },
    { time: '08:00', inbound: 850, outbound: 560 },
    { time: '12:00', inbound: 1200, outbound: 850 },
    { time: '16:00', inbound: 980, outbound: 720 },
    { time: '20:00', inbound: 650, outbound: 420 },
  ],
};
