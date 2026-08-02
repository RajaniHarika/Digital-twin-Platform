package com.digitaltwin.simulation_service.service;

import com.digitaltwin.simulation_service.dto.SimulationRequest;
import com.digitaltwin.simulation_service.dto.SimulationResponse;

import java.util.List;

public interface SimulationService {

    SimulationResponse createSimulation(SimulationRequest request);

    List<SimulationResponse> getAllSimulations();

    SimulationResponse getSimulationById(Long id);

    SimulationResponse updateSimulation(Long id, SimulationRequest request);

    void deleteSimulation(Long id);
}