package com.digitaltwin.cluster_sync_service.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EventInfo {

    private String namespace;
    private String objectName;
    private String objectKind;
    private String reason;
    private String type;
    private String message;
    private String eventTime;
}