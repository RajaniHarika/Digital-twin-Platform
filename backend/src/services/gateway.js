export async function getGatewayData() {
  const gatewayUrl = 'http://13.207.71.68:30080/api';
  
  try {
    const [simulationsRes, riskRes, costRes] = await Promise.allSettled([
      fetch(`${gatewayUrl}/simulations`),
      fetch(`${gatewayUrl}/risk/score`),
      fetch(`${gatewayUrl}/cost/monthly`)
    ]);

    let activeSimulations = null;
    if (simulationsRes.status === 'fulfilled' && simulationsRes.value.ok) {
      const data = await simulationsRes.value.json();
      activeSimulations = Array.isArray(data) ? data.filter(s => s.status === 'running').length : null;
    }

    let riskScore = null;
    if (riskRes.status === 'fulfilled' && riskRes.value.ok) {
      const data = await riskRes.value.json();
      riskScore = data.score;
    }

    let monthlyCost = null;
    if (costRes.status === 'fulfilled' && costRes.value.ok) {
      const data = await costRes.value.json();
      monthlyCost = data.total;
    }

    return { activeSimulations, riskScore, monthlyCost };
  } catch (error) {
    console.error('Failed to fetch from API gateway:', error);
    return { activeSimulations: null, riskScore: null, monthlyCost: null };
  }
}
