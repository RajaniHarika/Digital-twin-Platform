package com.digitaltwin.cost_service.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CostResponse {

    private Long id;
    private String resourceType;
    private String resourceId;
    private String resourceName;
    private Double cost;
    private String currency;
    private LocalDate billingDate;
    private String region;
    private String tag;
    private String status;
}
