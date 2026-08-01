package com.digitaltwin.cluster_sync_service.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PersistentVolumeClaimInfo {

    private String name;
    private String namespace;
    private String status;
    private String volume;
    private String storageClass;
    private String requestedStorage;
    private String accessMode;
}