/**
 * Prometheus HTTP client
 * Queries the Prometheus API exposed via NodePort 30090 on the K8s master.
 * PROMETHEUS_URL env var = http://65.2.224.226:30090
 */

const PROMETHEUS_URL = process.env.PROMETHEUS_URL || 'http://13.207.71.68:30080/prometheus';
const TIMEOUT_MS = 5000;

/**
 * Run a single instant PromQL query.
 * Returns the numeric value or null on failure.
 */
export async function queryPrometheus(promql) {
  try {
    const url = `${PROMETHEUS_URL}/api/v1/query?query=${encodeURIComponent(promql)}`;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    const resp = await fetch(url, { signal: controller.signal });
    clearTimeout(timer);
    if (!resp.ok) {
      console.error(`[Prometheus] HTTP ${resp.status} for query: ${promql}`);
      return null;
    }
    const json = await resp.json();
    const result = json?.data?.result;
    if (!result || result.length === 0) {
      return null;
    }
    return parseFloat(result[0].value[1]);
  } catch (err) {
    console.error(`[Prometheus] Error querying ${promql}:`, err.message);
    return null;
  }
}

/**
 * Run a range PromQL query for time-series chart data.
 * Returns array of { time, value } or empty array on failure.
 * @param {string} promql
 * @param {number} hoursBack - how many hours of history
 * @param {number} stepHours - resolution step in hours
 */
export async function queryPrometheusRange(promql, hoursBack = 24, stepHours = 2) {
  try {
    const end = Math.floor(Date.now() / 1000);
    const start = end - hoursBack * 3600;
    const step = stepHours * 3600;
    const url = `${PROMETHEUS_URL}/api/v1/query_range?query=${encodeURIComponent(promql)}&start=${start}&end=${end}&step=${step}`;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    const resp = await fetch(url, { signal: controller.signal });
    clearTimeout(timer);
    if (!resp.ok) return [];
    const json = await resp.json();
    const result = json?.data?.result;
    if (!result || result.length === 0) return [];
    // Merge all series into one averaged series
    const merged = {};
    result.forEach((series) => {
      series.values.forEach(([ts, val]) => {
        if (!merged[ts]) merged[ts] = { sum: 0, count: 0 };
        merged[ts].sum += parseFloat(val);
        merged[ts].count += 1;
      });
    });
    return Object.entries(merged)
      .sort(([a], [b]) => Number(a) - Number(b))
      .map(([ts, { sum, count }]) => ({
        time: new Date(Number(ts) * 1000).toISOString().slice(11, 16), // HH:MM
        value: Math.round((sum / count) * 10) / 10,
      }));
  } catch {
    return [];
  }
}

/**
 * Query Prometheus for a specific service/job label.
 * Returns { cpu, memory, latency, up } for that service.
 * Falls back to null values on error so the caller can use store.js defaults.
 */
export async function getServiceMetrics(jobName) {
  const [cpuRaw, memUsed, memMax, latencyRaw, upRaw] = await Promise.all([
    queryPrometheus(`process_cpu_usage{job="${jobName}"}`),
    queryPrometheus(`jvm_memory_used_bytes{job="${jobName}",area="heap"}`),
    queryPrometheus(`jvm_memory_max_bytes{job="${jobName}",area="heap"}`),
    queryPrometheus(
      `rate(http_server_requests_seconds_sum{job="${jobName}"}[5m]) / rate(http_server_requests_seconds_count{job="${jobName}"}[5m])`
    ),
    queryPrometheus(`up{job="${jobName}"}`),
  ]);

  const cpu = cpuRaw != null ? Math.round(cpuRaw * 1000) / 10 : null; // 0-100%
  const memory =
    memUsed != null && memMax != null && memMax > 0
      ? Math.round((memUsed / memMax) * 1000) / 10
      : null;
  const latency = latencyRaw != null ? Math.round(latencyRaw * 1000) : null; // ms
  const status = upRaw === 1 ? 'healthy' : upRaw === 0 ? 'down' : null;

  return { cpu, memory, latency, status };
}

/**
 * Get cluster-wide CPU and Memory using cAdvisor (kubelet) first,
 * then Node Exporter as fallback. cAdvisor metrics are always available
 * from the Kubernetes kubelet without a separate deployment.
 */
export async function getClusterMetrics() {
  const [
    cadvisorCpu,   // cAdvisor: container CPU usage rate (always available from kubelet)
    nodeExporterCpuIdle, // Node Exporter: CPU idle % (requires node-exporter daemonset)
    memTotal,
    memAvail,
    networkIn,
  ] = await Promise.all([
    queryPrometheus('sum(rate(container_cpu_usage_seconds_total{image!="",container!="POD"}[5m])) / sum(machine_cpu_cores) * 100'),
    queryPrometheus('avg(rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100'),
    queryPrometheus('node_memory_MemTotal_bytes'),
    queryPrometheus('node_memory_MemAvailable_bytes'),
    queryPrometheus('sum(rate(node_network_receive_bytes_total[5m])) / 1024'),
  ]);

  // Prefer cAdvisor, fall back to Node Exporter (inverted idle)
  const cpuUsage = cadvisorCpu != null
    ? Math.round(cadvisorCpu * 10) / 10
    : nodeExporterCpuIdle != null
      ? Math.round((100 - nodeExporterCpuIdle) * 10) / 10
      : null;

  const memoryUsage = (memTotal != null && memAvail != null && memTotal > 0)
    ? Math.round(((memTotal - memAvail) / memTotal) * 1000) / 10
    : null;

  // cAdvisor memory fallback
  const cadvisorMemPromise = memoryUsage == null
    ? queryPrometheus('sum(container_memory_working_set_bytes{image!="",container!="POD"}) / sum(machine_memory_bytes) * 100')
    : Promise.resolve(null);
  const cadvisorMem = await cadvisorMemPromise;

  return {
    cpuUsage,
    memoryUsage: memoryUsage ?? (cadvisorMem != null ? Math.round(cadvisorMem * 10) / 10 : null),
    networkTraffic: networkIn != null ? Math.round(networkIn) : null,
  };
}

/**
 * Get CPU, Memory, and Network trend data for charts (last 24h).
 */
export async function getChartTrends() {
  const [cadvisorCpu, nodeExporterCpu, memory, network] = await Promise.all([
    queryPrometheusRange('sum(rate(container_cpu_usage_seconds_total{image!="",container!="POD"}[5m])) / sum(machine_cpu_cores) * 100'),
    queryPrometheusRange('avg(rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100'),
    queryPrometheusRange('(1 - avg(node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes)) * 100'),
    queryPrometheusRange('sum(rate(node_network_receive_bytes_total[2h])) / 1024'),
  ]);

  // Use cAdvisor if it has data, otherwise invert node-exporter idle%
  const cpu = cadvisorCpu.length > 0
    ? cadvisorCpu
    : nodeExporterCpu.map(p => ({ ...p, value: Math.round((100 - p.value) * 10) / 10 }));

  return { cpu, memory, network };
}
