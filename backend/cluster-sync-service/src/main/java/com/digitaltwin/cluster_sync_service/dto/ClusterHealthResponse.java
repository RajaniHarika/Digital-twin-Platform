package com.digitaltwin.cluster_sync_service.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ClusterHealthResponse {

    private String clusterName;

    private String status;

    private int totalNodes;

    private int readyNodes;

    private int totalNamespaces;

    private String kubernetesVersion;
}