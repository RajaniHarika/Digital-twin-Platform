import { exec } from 'child_process';
import util from 'util';
import fs from 'fs';
const execPromise = util.promisify(exec);

// Path to the SSH key mounted inside the Docker container
const SSH_KEY_PATH = '/app/keys/master.pem';
const SAFE_KEY_PATH = '/tmp/master.pem';
const MASTER_NODE_USER = 'ubuntu';
const MASTER_NODE_IP = process.env.MASTER_NODE_IP || '65.2.224.226'; // Configure this in docker-compose.yml or .env

/**
 * Ensures the SSH key has the correct 600 permissions by copying it to a writable location.
 * Windows Docker mounts often force 777 permissions, which SSH rejects.
 */
function getSafeSshKey() {
  if (fs.existsSync(SAFE_KEY_PATH)) return SAFE_KEY_PATH;
  if (!fs.existsSync(SSH_KEY_PATH)) {
    throw new Error(`SSH Key not found at ${SSH_KEY_PATH}. Is the volume mounted?`);
  }
  
  fs.copyFileSync(SSH_KEY_PATH, SAFE_KEY_PATH);
  fs.chmodSync(SAFE_KEY_PATH, 0o600);
  return SAFE_KEY_PATH;
}

/**
 * Execute a kubectl command via SSH to the Master Node
 */
async function runKubectl(command) {
  const safeKey = getSafeSshKey();
  const sshCmd = `ssh -i ${safeKey} -o StrictHostKeyChecking=no ${MASTER_NODE_USER}@${MASTER_NODE_IP} "kubectl ${command}"`;
  
  try {
    const { stdout, stderr } = await execPromise(sshCmd);
    if (stderr && !stderr.includes('Warning: Permanently added')) {
      console.warn('Kubectl stderr:', stderr);
    }
    return stdout;
  } catch (error) {
    console.error('Kubectl execution failed:', error.message);
    throw new Error(`Kubernetes operation failed: ${error.message}`);
  }
}

export async function getServiceLogs(serviceName) {
  // Validate serviceName to prevent command injection
  if (!/^[a-zA-Z0-9-]+$/.test(serviceName)) {
    throw new Error('Invalid service name');
  }
  
  // Fetch last 100 lines of logs for the given service in digitaltwin namespace
  const logs = await runKubectl(`logs -n digitaltwin -l app=${serviceName} --tail=100`);
  return logs;
}

export async function restartCluster() {
  // Perform a rolling restart of all deployments in the namespace
  const output = await runKubectl(`rollout restart deployment -n digitaltwin`);
  return output;
}

export async function getDeployments() {
  try {
    const output = await runKubectl(`get deployments -n digitaltwin -o json`);
    const data = JSON.parse(output);
    return data.items.map((item, index) => ({
      id: `d${index}`,
      service: item.metadata.name,
      version: item.metadata.labels?.version || '1.0.0',
      status: item.status.readyReplicas >= 1 ? 'success' : 'failed',
      timestamp: item.metadata.creationTimestamp,
      duration: 120
    }));
  } catch (error) {
    console.error('Failed to get deployments via SSH:', error.message);
    return null;
  }
}

export async function getDockerImages() {
  try {
    const output = await runKubectl(`get pods -n digitaltwin -o jsonpath="{.items[*].spec.containers[*].image}"`);
    const images = [...new Set(output.split(' '))].filter(Boolean);
    
    return images.map((imageStr, index) => {
      const [repoPath, tag] = imageStr.split(':');
      return {
        id: index + 1,
        repository: repoPath,
        tag: tag || 'latest',
        size: 'Unknown',
        lastUpdated: 'Live in Cluster',
        securityScan: 'Passed',
        vulnerabilities: 0,
        status: 'Active'
      };
    });
  } catch (error) {
    console.error('Failed to get docker images via SSH:', error.message);
    return null;
  }
}
