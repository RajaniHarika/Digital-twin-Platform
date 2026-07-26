package com.digitaltwin.cluster_sync_service.dto;

import lombok.Data;

@Data
public class ClusterRegistrationRequest {

    private String clusterName;

    private String apiServerUrl;

    private String clusterType;

    private String provider;

    private String region;
}