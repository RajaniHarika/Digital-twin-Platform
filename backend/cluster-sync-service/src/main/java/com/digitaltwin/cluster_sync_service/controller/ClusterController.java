package com.digitaltwin.cluster_sync_service.controller;

import com.digitaltwin.cluster_sync_service.dto.ClusterRegistrationRequest;
import com.digitaltwin.cluster_sync_service.dto.ClusterResponse;
import com.digitaltwin.cluster_sync_service.service.ClusterService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clusters")
@RequiredArgsConstructor
@CrossOrigin("*")
public class ClusterController {

    private final ClusterService clusterService;

    @PostMapping("/register")
    public ClusterResponse registerCluster(@RequestBody ClusterRegistrationRequest request) {
        return clusterService.registerCluster(request);
    }

    @GetMapping
    public List<ClusterResponse> getAllClusters() {
        return clusterService.getAllClusters();
    }

    @GetMapping("/{id}")
    public ClusterResponse getClusterById(@PathVariable Long id) {
        return clusterService.getClusterById(id);
    }

    @DeleteMapping("/{id}")
    public String deleteCluster(@PathVariable Long id) {
        clusterService.deleteCluster(id);
        return "Cluster deleted successfully";
    }
}