package com.digitaltwin.cluster_sync_service.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DeploymentInfo {

    private String name;
    private String namespace;
    private Integer desiredReplicas;
    private Integer availableReplicas;
    private String strategy;
    private String creationTimestamp;
}