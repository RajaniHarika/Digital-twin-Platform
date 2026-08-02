package com.digitaltwin.cluster_sync_service.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SecretInfo {

    private String name;
    private String namespace;
    private String type;
    private Integer dataCount;
    private String creationTimestamp;
}