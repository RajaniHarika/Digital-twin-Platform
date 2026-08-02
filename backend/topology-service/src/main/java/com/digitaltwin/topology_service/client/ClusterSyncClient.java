package com.digitaltwin.topology_service.client;

import com.digitaltwin.topology_service.dto.DeploymentDto;
import com.digitaltwin.topology_service.dto.NodeDto;
import com.digitaltwin.topology_service.dto.PodDto;
import com.digitaltwin.topology_service.dto.ServiceDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

@FeignClient(name = "cluster-sync-service", url = "${cluster.sync.base-url}", fallback = ClusterSyncFallback.class)
public interface ClusterSyncClient {

    @GetMapping("/api/kubernetes/nodes")
    List<NodeDto> getNodes();

    @GetMapping("/api/kubernetes/pods")
    List<PodDto> getPods();

    @GetMapping("/api/kubernetes/deployments")
    List<DeploymentDto> getDeployments();

    @GetMapping("/api/kubernetes/services")
    List<ServiceDto> getServices();
}
