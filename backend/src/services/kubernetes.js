import { exec } from 'child_process';
import util from 'util';
const execPromise = util.promisify(exec);

// Path to the SSH key mounted inside the Docker container
const SSH_KEY_PATH = '/app/keys/master.pem';
const MASTER_NODE_USER = 'ubuntu';
const MASTER_NODE_IP = '65.2.224.226'; // Real Master Node IP

/**
 * Execute a kubectl command via SSH to the Master Node
 */
async function runKubectl(command) {
  const sshCmd = `ssh -i ${SSH_KEY_PATH} -o StrictHostKeyChecking=no ${MASTER_NODE_USER}@${MASTER_NODE_IP} "kubectl ${command}"`;
  
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
