package com.digitaltwin.cluster_sync_service.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ServiceInfo {

    private String name;
    private String namespace;
    private String type;
    private String clusterIP;
    private String externalIP;
    private String ports;
}