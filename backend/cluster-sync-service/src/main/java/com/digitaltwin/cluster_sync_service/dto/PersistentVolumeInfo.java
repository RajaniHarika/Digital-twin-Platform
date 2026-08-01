package com.digitaltwin.cluster_sync_service.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PersistentVolumeInfo {

    private String name;
    private String capacity;
    private String accessMode;
    private String reclaimPolicy;
    private String status;
    private String storageClass;
    private String claim;
}