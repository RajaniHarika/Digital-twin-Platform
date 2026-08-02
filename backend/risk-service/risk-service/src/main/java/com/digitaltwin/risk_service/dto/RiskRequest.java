package com.digitaltwin.risk_service.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RiskRequest {

    @NotNull(message = "Simulation ID is required")
    private Long simulationId;

    @NotBlank(message = "Application name is required")
    private String applicationName;

    @NotNull(message = "Risk score is required")
    private Double riskScore;

    @NotBlank(message = "Risk level is required")
    private String riskLevel;

    @NotBlank(message = "Impact is required")
    private String impact;

    private String recommendation;
}