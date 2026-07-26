package com.digitaltwin.cluster_sync_service.service;

import com.digitaltwin.cluster_sync_service.dto.ClusterRegistrationRequest;
import com.digitaltwin.cluster_sync_service.dto.ClusterResponse;
import com.digitaltwin.cluster_sync_service.entity.Cluster;
import com.digitaltwin.cluster_sync_service.repository.ClusterRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ClusterServiceImpl implements ClusterService {

    private final ClusterRepository clusterRepository;

    @Override
    public ClusterResponse registerCluster(ClusterRegistrationRequest request) {

        if (clusterRepository.existsByClusterName(request.getClusterName())) {
            throw new RuntimeException("Cluster already exists");
        }

        Cluster cluster = Cluster.builder()
                .clusterName(request.getClusterName())
                .apiServerUrl(request.getApiServerUrl())
                .clusterType(request.getClusterType())
                .provider(request.getProvider())
                .region(request.getRegion())
                .status("ACTIVE")
                .build();

        Cluster saved = clusterRepository.save(cluster);

        return mapToResponse(saved);
    }

    @Override
    public List<ClusterResponse> getAllClusters() {
        return clusterRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public ClusterResponse getClusterById(Long id) {

        Cluster cluster = clusterRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cluster not found"));

        return mapToResponse(cluster);
    }

    @Override
    public void deleteCluster(Long id) {
        clusterRepository.deleteById(id);
    }

    private ClusterResponse mapToResponse(Cluster cluster) {
        return ClusterResponse.builder()
                .id(cluster.getId())
                .clusterName(cluster.getClusterName())
                .apiServerUrl(cluster.getApiServerUrl())
                .clusterType(cluster.getClusterType())
                .provider(cluster.getProvider())
                .region(cluster.getRegion())
                .version(cluster.getVersion())
                .status(cluster.getStatus())
                .build();
    }
}