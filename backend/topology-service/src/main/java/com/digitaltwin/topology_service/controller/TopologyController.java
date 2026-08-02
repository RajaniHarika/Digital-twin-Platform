package com.digitaltwin.topology_service.controller;

import com.digitaltwin.topology_service.dto.DeploymentDto;
import com.digitaltwin.topology_service.dto.NodeDto;
import com.digitaltwin.topology_service.dto.PodDto;
import com.digitaltwin.topology_service.dto.ServiceDto;
import com.digitaltwin.topology_service.dto.TopologyGraphDto;
import com.digitaltwin.topology_service.service.TopologyService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/topology")
public class TopologyController {

    private final TopologyService topologyService;

    public TopologyController(TopologyService topologyService) {
        this.topologyService = topologyService;
    }

    @GetMapping("/health")
    public String health() {
        return "Topology Service is Running!";
    }

    @GetMapping("/nodes")
    public List<NodeDto> getAllNodes() {
        return topologyService.getAllNodes();
    }

    @GetMapping("/pods")
    public List<PodDto> getAllPods() {
        return topologyService.getAllPods();
    }

    @GetMapping("/deployments")
    public List<DeploymentDto> getAllDeployments() {
        return topologyService.getAllDeployments();
    }

    @GetMapping("/services")
    public List<ServiceDto> getAllServices() {
        return topologyService.getAllServices();
    }

    @GetMapping("/graph")
    public TopologyGraphDto getTopologyGraph() {
        return topologyService.getTopologyGraph();
    }
}