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

    return {
      total: builds.length,
      failed,
      inProgress,
      successful
    };
  } catch (error) {
    console.error('Failed to fetch Jenkins pipelines:', error);
    return null;
  }
}
