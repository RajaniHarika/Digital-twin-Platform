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

    @NotNull
    private Long simulationId;

    @NotBlank
    private String applicationName;

    @NotNull
    private Double riskScore;

    @NotBlank
    private String riskLevel;

    @NotBlank
    private String impact;

    private String recommendation;
}