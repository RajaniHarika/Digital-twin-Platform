export async function getJenkinsPipelines() {
  const jenkinsUrl = 'http://65.0.186.162:8080/job/digital-twin-pipeline/api/json?tree=builds[number,result,building,duration,timestamp]';
  const token = 'admin:11eac8bbb1450829e11d7939260d6e6d3e';
  
  try {
    const response = await fetch(jenkinsUrl, {
      headers: {
        'Authorization': 'Basic ' + Buffer.from(token).toString('base64'),
      }
    });

    if (!response.ok) {
      throw new Error(`Jenkins API error: ${response.status}`);
    }

    const data = await response.json();
    const builds = data.builds || [];
    
    let successful = 0;
    let failed = 0;
    let inProgress = 0;
    
    builds.forEach(build => {
      if (build.building) {
        inProgress++;
      } else if (build.result === 'SUCCESS') {
        successful++;
      } else if (build.result === 'FAILURE') {
        failed++;
      }
    });

    const cards = builds.slice(0, 4).map((build, index) => {
      const minutes = Math.floor(build.duration / 60000) || 0;
      const seconds = Math.floor((build.duration % 60000) / 1000) || 0;
      let status = 'Running';
      if (!build.building) {
        status = build.result === 'SUCCESS' ? 'Success' : 'Failed';
      }
      return {
        id: build.number || index,
        name: `digital-twin-build-${build.number}`,
        stage: build.building ? 'Building' : 'Completed',
        duration: build.duration ? `${minutes}m ${seconds}s` : '-',
        lastBuild: `#${build.number}`,
        successRate: build.result === 'SUCCESS' ? 100 : 0,
        status: status
      };
    });

    return {
      total: builds.length,
      failed,
      inProgress,
      successful,
      cards
    };
  } catch (error) {
    console.error('Failed to fetch Jenkins pipelines:', error);
    return null;
  }
}
