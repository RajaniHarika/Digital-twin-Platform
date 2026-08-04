const mapAlertsLocal = (alerts) =>
  (alerts || []).map((a, i) => ({
    id: a.id || String(i),
    title: a.title,
    message: a.message || a.title,
    severity: a.severity === 'critical' ? 'Critical' : a.severity === 'warning' ? 'Warning' : 'Info',
    status: a.acknowledged ? 'Resolved' : 'Active',
  }));

export const buildBackendDashboardData = (health, metrics, topologyNodes, topologyEdges) => {
  const services = health?.services || [];
  const avgUptime = services.length
    ? services.reduce((s, svc) => s + svc.uptime, 0) / services.length
    : 99.5;
  const avgLatency =
    services.length > 0
      ? Math.round(services.reduce((s, svc) => s + (100 - svc.uptime) * 2 + 15, 0) / services.length)
      : 24;
  const mysql = topologyNodes?.find((n) => n.id === 'mysql' || n.type === 'database') || {
    label: 'MySQL Cluster',
    status: 'healthy',
    latency: 8,
    cpu: 33.5,
    memory: 74.1,
  };
  const redis = {
    label: 'Redis Cache',
    status: 'healthy',
    hitRate: 94.2,
    memoryUsed: '412 MB',
    keys: 12840,
    latency: 2,
  };
  const dependencies = (topologyEdges || []).slice(0, 8).map((edge) => {
    const source = topologyNodes?.find((n) => n.id === edge.source);
    const target = topologyNodes?.find((n) => n.id === edge.target);
    return {
      id: edge.id,
      from: source?.label || edge.source,
      to: target?.label || edge.target,
      status: target?.status || 'healthy',
    };
  });

  return {
    summary: {
      apiHealth: `${Math.round(avgUptime * 100) / 100}%`,
      responseTime: `${avgLatency}ms`,
      errorRate: metrics?.riskScore ? `${(metrics.riskScore / 1000).toFixed(2)}%` : '0.08%',
      healthyServices: services.filter((s) => s.status === 'healthy').length,
      totalServices: services.length,
    },
    apiServices: services.map((s) => ({
      name: s.name,
      status: s.status,
      uptime: s.uptime,
      latency: Math.round(20 + (100 - s.uptime) * 2),
    })),
    mysql: {
      name: mysql.label || 'MySQL Cluster',
      status: mysql.status || 'healthy',
      latency: `${mysql.latency || 8}ms`,
      cpu: mysql.cpu || 33,
      memory: mysql.memory || 74,
      connections: 142,
    },
    redis,
    dependencies,
    latencyTrend: (metrics?.trends?.cpu || []).map((p, i) => ({
      time: p.name || p.time || `${i * 2}:00`,
      p50: Math.round(18 + (p.value || p.usage || 50) * 0.15),
      p99: Math.round(45 + (p.value || p.usage || 50) * 0.35),
    })),
  };
};

export const buildSreDashboardData = (health, metrics, alerts, history) => {
  const services = health?.services || [];
  const avgUptime = services.length
    ? services.reduce((s, svc) => s + svc.uptime, 0) / services.length
    : 99.92;
  const slaTarget = 99.9;
  const errorBudget = Math.max(0, ((avgUptime - slaTarget) / (100 - slaTarget)) * 100);
  const incidents = (history || []).filter((h) => h.status === 'failed' || h.type === 'incident');
  const mappedAlerts = mapAlertsLocal(alerts || []);

  return {
    summary: {
      availability: `${Math.round(avgUptime * 100) / 100}%`,
      sla: `${slaTarget}%`,
      errorBudget: `${Math.round(errorBudget)}%`,
      activeAlerts: mappedAlerts.filter((a) => a.status === 'Active').length,
      openIncidents: incidents.length || 2,
    },
    slaHistory: [
      { week: 'W1', actual: 99.94, target: 99.9 },
      { week: 'W2', actual: 99.91, target: 99.9 },
      { week: 'W3', actual: 99.97, target: 99.9 },
      { week: 'W4', actual: avgUptime, target: 99.9 },
    ],
    errorBudget: {
      consumed: Math.round(100 - errorBudget),
      remaining: Math.round(errorBudget),
      burnRate: metrics?.riskScore ? `${(metrics.riskScore / 10).toFixed(1)}%/day` : '1.2%/day',
    },
    incidents: (history || [])
      .filter((h) => ['failed', 'warning'].includes(h.status) || h.type === 'simulation')
      .slice(0, 6)
      .map((h) => ({
        id: h.id,
        title: h.action || h.title,
        status: h.status,
        user: h.user,
        timestamp: h.timestamp,
      })),
    alerts: mappedAlerts.slice(0, 6),
    serviceAvailability: services.map((s) => ({
      name: s.name,
      uptime: s.uptime,
      status: s.status,
    })),
  };
};

export const buildProjectManagerDashboardData = (deployments, history, risk, cost) => {
  const riskItems = risk?.items || [];
  const breakdown = cost?.breakdown || [];
  const teamActivity = (history || []).slice(0, 8).map((h) => ({
    id: h.id,
    action: h.action,
    user: h.user,
    type: h.type,
    timestamp: h.timestamp,
    status: h.status,
  }));
  const activeProjects = [
    { name: 'Platform Modernization', status: 'On Track', progress: 72, owner: 'DevOps Lead' },
    { name: 'Cost Optimization Q3', status: 'At Risk', progress: 45, owner: 'Cloud Architect' },
    { name: 'SRE Reliability Sprint', status: 'On Track', progress: 61, owner: 'SRE Lead' },
  ];

  return {
    summary: {
      projectStatus: '2 On Track · 1 At Risk',
      deployments: deployments?.length || 0,
      teamEvents: teamActivity.length,
      riskScore: risk?.overallScore ?? 58,
      monthlyCost: cost?.total ?? breakdown.reduce((s, c) => s + c.monthly, 0),
    },
    projects: activeProjects,
    deployments: (deployments || []).slice(0, 6).map((d) => ({
      id: d.id,
      service: d.service,
      version: d.version,
      status: d.status,
      timestamp: d.timestamp,
    })),
    teamActivity,
    riskReports: riskItems.slice(0, 5).map((r) => ({
      id: r.id,
      title: r.title,
      severity: r.severity,
      service: r.service,
      score: r.score,
    })),
    costReports: breakdown.slice(0, 6).map((c) => ({
      service: c.service,
      monthly: c.monthly,
      trend: c.trend,
      category: c.category,
    })),
  };
};

export const buildAdminOverviewData = (devops, cloud, backend, sre, pm) => ({
  platform: {
    totalUsers: 6,
    activeRoles: 6,
    clusterHealth: devops?.header?.clusterHealthBadge || 'Healthy',
    monthlyCost: pm?.summary?.monthlyCost || cloud?.kpis?.monthlySpend || 0,
  },
  sections: [
    { role: 'DevOps Engineer', metrics: ['Cluster health', 'Pod status', 'Deployments', 'Alerts'] },
    { role: 'Cloud Engineer', metrics: ['Resource utilization', 'Node capacity', 'Cost analysis'] },
    { role: 'Backend Engineer', metrics: ['API health', 'MySQL', 'Redis', 'Dependencies'] },
    { role: 'SRE', metrics: ['SLA', 'Error budget', 'Incidents', 'Alerts'] },
    { role: 'Project Manager', metrics: ['Projects', 'Deployments', 'Risk', 'Cost'] },
  ],
  devops,
  cloud,
  backend,
  sre,
  pm,
});
