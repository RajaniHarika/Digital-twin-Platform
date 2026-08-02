package com.digitaltwin.simulation_service.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class SimulationResponse {

    private Long id;
    private String simulationName;
    private String environment;
    private String status;
    private String description;
    private LocalDateTime createdAt;
}