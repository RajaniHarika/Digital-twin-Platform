package com.digitaltwin.topology_service.controller;

import com.digitaltwin.topology_service.dto.NodeDto;
import com.digitaltwin.topology_service.dto.PodDto;
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

    @GetMapping("/nodes")
    public List<NodeDto> getNodes() {
        return topologyService.getAllNodes();
    }

    @GetMapping("/pods")
    public List<PodDto> getPods() {
        return topologyService.getAllPods();
    }
}