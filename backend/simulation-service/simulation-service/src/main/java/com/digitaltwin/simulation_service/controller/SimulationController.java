package com.digitaltwin.simulation_service.controller;

import com.digitaltwin.simulation_service.dto.SimulationRequest;
import com.digitaltwin.simulation_service.dto.SimulationResponse;
import com.digitaltwin.simulation_service.service.SimulationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/simulations")
@RequiredArgsConstructor
@CrossOrigin("*")
public class SimulationController {

    private final SimulationService simulationService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public SimulationResponse createSimulation(
            @Valid @RequestBody SimulationRequest request) {
        return simulationService.createSimulation(request);
    }

    @GetMapping
    public List<SimulationResponse> getAllSimulations() {
        return simulationService.getAllSimulations();
    }

    @GetMapping("/{id}")
    public SimulationResponse getSimulationById(@PathVariable Long id) {
        return simulationService.getSimulationById(id);
    }

    @PutMapping("/{id}")
    public SimulationResponse updateSimulation(
            @PathVariable Long id,
            @Valid @RequestBody SimulationRequest request) {
        return simulationService.updateSimulation(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteSimulation(@PathVariable Long id) {
        simulationService.deleteSimulation(id);
    }
}