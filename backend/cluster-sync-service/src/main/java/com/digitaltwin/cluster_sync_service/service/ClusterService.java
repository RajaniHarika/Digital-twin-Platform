package com.digitaltwin.cluster_sync_service.service;

import com.digitaltwin.cluster_sync_service.dto.ClusterRegistrationRequest;
import com.digitaltwin.cluster_sync_service.dto.ClusterResponse;

import java.util.List;

public interface ClusterService {

    ClusterResponse registerCluster(ClusterRegistrationRequest request);

    List<ClusterResponse> getAllClusters();

    ClusterResponse getClusterById(Long id);

    void deleteCluster(Long id);
}