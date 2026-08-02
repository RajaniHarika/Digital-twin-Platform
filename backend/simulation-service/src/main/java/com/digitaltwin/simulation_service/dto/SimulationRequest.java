package com.digitaltwin.simulation_service.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class SimulationRequest {

    @NotBlank(message = "Simulation name is required")
    private String simulationName;

    @NotBlank(message = "Environment is required")
    private String environment;

    @NotBlank(message = "Status is required")
    private String status;

    private String description;
}