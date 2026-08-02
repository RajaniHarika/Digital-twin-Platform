package com.digitaltwin.cluster_sync_service.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NodeInfo {

    private String name;
    private String status;
    private String version;
    private String os;
    private String architecture;
}