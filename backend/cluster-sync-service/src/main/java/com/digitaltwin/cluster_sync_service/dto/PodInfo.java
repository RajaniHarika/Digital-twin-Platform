package com.digitaltwin.cluster_sync_service.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PodInfo {

    private String name;
    private String namespace;
    private String status;
    private String nodeName;
    private String podIP;
    private String image;
}