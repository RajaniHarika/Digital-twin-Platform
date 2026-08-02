package com.digitaltwin.risk_service.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RiskResponse {

    private Long id;
    private Long simulationId;
    private String applicationName;
    private Double riskScore;
    private String riskLevel;
    private String impact;
    private String recommendation;
    private LocalDateTime analyzedAt;
}