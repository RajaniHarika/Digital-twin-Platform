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

@Component
public class ClusterSyncFallback implements ClusterSyncClient {

    private static final Logger log = LoggerFactory.getLogger(ClusterSyncFallback.class);

    @Override
    public List<NodeDto> getNodes() {
        log.warn("cluster-sync-service is down. Returning empty node list.");
        return Collections.emptyList();
    }

    @Override
    public List<PodDto> getPods() {
        log.warn("cluster-sync-service is down. Returning empty pod list.");
        return Collections.emptyList();
    }

    @Override
    public List<DeploymentDto> getDeployments() {
        log.warn("cluster-sync-service is down. Returning empty deployment list.");
        return Collections.emptyList();
    }

    @Override
    public List<ServiceDto> getServices() {
        log.warn("cluster-sync-service is down. Returning empty service list.");
        return Collections.emptyList();
    }
}
