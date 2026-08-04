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
    if (!resp.ok) return null;
    const json = await resp.json();
    const result = json?.data?.result;
    if (!result || result.length === 0) return null;
    return parseFloat(result[0].value[1]);
  } catch {
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
 * Get cluster-wide averages for CPU and Memory from all digitaltwin services.
 */
export async function getClusterMetrics() {
  const [cpuAvg, memAvg, networkIn] = await Promise.all([
    queryPrometheus(
      'avg(process_cpu_usage{job=~"api-gateway|auth-service|cluster-sync|topology-service|simulation-service|risk-service|cost-service"}) * 100'
    ),
    queryPrometheus(
      'avg(jvm_memory_used_bytes{area="heap",job=~"api-gateway|auth-service|cluster-sync|topology-service|simulation-service|risk-service|cost-service"} / jvm_memory_max_bytes{area="heap",job=~"api-gateway|auth-service|cluster-sync|topology-service|simulation-service|risk-service|cost-service"}) * 100'
    ),
    queryPrometheus('sum(rate(node_network_receive_bytes_total[5m])) / 1024'),
  ]);

  return {
    cpuUsage: cpuAvg != null ? Math.round(cpuAvg * 10) / 10 : null,
    memoryUsage: memAvg != null ? Math.round(memAvg * 10) / 10 : null,
    networkTraffic: networkIn != null ? Math.round(networkIn) : null,
  };
}

/**
 * Get CPU, Memory, and Network trend data for charts (last 24h).
 */
export async function getChartTrends() {
  const [cpu, memory, network] = await Promise.all([
    queryPrometheusRange(
      'avg(process_cpu_usage{job=~"api-gateway|auth-service|cluster-sync|topology-service|simulation-service|risk-service|cost-service"}) * 100'
    ),
    queryPrometheusRange(
      'avg(jvm_memory_used_bytes{area="heap"} / jvm_memory_max_bytes{area="heap"}) * 100'
    ),
    queryPrometheusRange('sum(rate(node_network_receive_bytes_total[2h])) / 1024'),
  ]);

  return { cpu, memory, network };
}
