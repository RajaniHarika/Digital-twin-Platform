package com.digitaltwin.topology_service.client;

import com.digitaltwin.topology_service.dto.DeploymentDto;
import com.digitaltwin.topology_service.dto.NodeDto;
import com.digitaltwin.topology_service.dto.PodDto;
import com.digitaltwin.topology_service.dto.ServiceDto;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;

import java.util.Arrays;

@Component
public class ClusterSyncFallback implements ClusterSyncClient {

    private static final Logger log = LoggerFactory.getLogger(ClusterSyncFallback.class);

    @Override
    public List<NodeDto> getNodes() {
        log.warn("cluster-sync-service is down. Returning mock node list.");
        return Arrays.asList(
                new NodeDto("k8s-node-1", "Ready", "Master"),
                new NodeDto("k8s-node-2", "Ready", "Worker")
        );
    }

    @Override
    public List<PodDto> getPods() {
        log.warn("cluster-sync-service is down. Returning mock pod list.");
        return Arrays.asList(
                new PodDto("auth-service-pod-1", "digital-twin", "Running"),
                new PodDto("simulation-service-pod-1", "digital-twin", "Running"),
                new PodDto("risk-service-pod-1", "digital-twin", "Running"),
                new PodDto("cost-service-pod-1", "digital-twin", "Running")
        );
    }

    @Override
    public List<DeploymentDto> getDeployments() {
        log.warn("cluster-sync-service is down. Returning mock deployment list.");
        return Arrays.asList(
                new DeploymentDto("auth-service", "digital-twin", 2, 2),
                new DeploymentDto("simulation-service", "digital-twin", 1, 1),
                new DeploymentDto("risk-service", "digital-twin", 1, 1),
                new DeploymentDto("cost-service", "digital-twin", 1, 1)
        );
    }

    @Override
    public List<ServiceDto> getServices() {
        log.warn("cluster-sync-service is down. Returning mock service list.");
        return Arrays.asList(
                new ServiceDto("auth-service", "digital-twin", "ClusterIP", "10.0.0.1"),
                new ServiceDto("api-gateway", "digital-twin", "LoadBalancer", "10.0.0.100")
        );
    }
}
