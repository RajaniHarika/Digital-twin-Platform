package com.digitaltwin.cost_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CostSummaryResponse {

    private String resourceType;
    private Double totalCost;
    private String currency;
    private Long recordCount;
}
