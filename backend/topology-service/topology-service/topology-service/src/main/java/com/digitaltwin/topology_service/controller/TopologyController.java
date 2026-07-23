package com.digitaltwin.topology_service.controller;

import com.digitaltwin.topology_service.dto.DeploymentDto;
import com.digitaltwin.topology_service.dto.NodeDto;
import com.digitaltwin.topology_service.dto.PodDto;
import com.digitaltwin.topology_service.service.TopologyService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class TopologyController {

    private final TopologyService topologyService;

    public TopologyController(TopologyService topologyService) {
        this.topologyService = topologyService;
    }

    @GetMapping("/api/v1/topology/health")
    public String health() {
        return "Topology Service is running!";
    }

    @GetMapping("/api/v1/topology/nodes")
    public List<NodeDto> getNodes() {
        return topologyService.getAllNodes();
    }

    @GetMapping("/api/v1/topology/pods")
    public List<PodDto> getPods() {
        return topologyService.getAllPods();
    }

    @GetMapping("/api/v1/topology/deployments")
    public List<DeploymentDto> getDeployments() {
        return topologyService.getAllDeployments();
    }
}