package com.digitaltwin.cluster_sync_service.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ClusterResponse {

    private Long id;

    private String clusterName;

    private String apiServerUrl;

    private String clusterType;

    private String provider;

    private String region;

    private String version;

    private String status;
}