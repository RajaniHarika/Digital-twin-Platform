package com.digitaltwin.topology_service.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class TopologyHealthController {

    @GetMapping("/api/v1/topology/health")
    public Map<String, String> health() {
        return Map.of(
                "service", "Topology Service",
                "status", "UP",
                "version", "1.0.0"
        );
    }
}