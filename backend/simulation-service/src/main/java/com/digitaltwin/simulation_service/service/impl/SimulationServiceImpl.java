package com.digitaltwin.simulation_service.service.impl;

import com.digitaltwin.simulation_service.dto.SimulationRequest;
import com.digitaltwin.simulation_service.dto.SimulationResponse;
import com.digitaltwin.simulation_service.entity.Simulation;
import com.digitaltwin.simulation_service.exception.ResourceNotFoundException;
import com.digitaltwin.simulation_service.repository.SimulationRepository;
import com.digitaltwin.simulation_service.service.SimulationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class SimulationServiceImpl implements SimulationService {

    private final SimulationRepository repository;

    @Override
    public SimulationResponse createSimulation(SimulationRequest request) {

        log.info("Creating simulation: {}", request.getSimulationName());

        Simulation simulation = Simulation.builder()
                .simulationName(request.getSimulationName())
                .environment(request.getEnvironment())
                .status(request.getStatus())
                .description(request.getDescription())
                .build();

        Simulation saved = repository.save(simulation);

        log.info("Simulation created successfully with ID: {}", saved.getId());

        return mapToResponse(saved);
    }

    @Override
    public List<SimulationResponse> getAllSimulations() {

        log.info("Fetching all simulations");

        return repository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Cacheable(value = "simulations", key = "#id")
    public SimulationResponse getSimulationById(Long id) {

        log.info("Fetching simulation with ID: {}", id);

        Simulation simulation = repository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Simulation not found with ID: " + id));

        return mapToResponse(simulation);
    }

    @Override
    @CacheEvict(value = "simulations", key = "#id")
    public SimulationResponse updateSimulation(Long id, SimulationRequest request) {

        log.info("Updating simulation with ID: {}", id);

        Simulation simulation = repository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Simulation not found with ID: " + id));

        simulation.setSimulationName(request.getSimulationName());
        simulation.setEnvironment(request.getEnvironment());
        simulation.setStatus(request.getStatus());
        simulation.setDescription(request.getDescription());

        Simulation updatedSimulation = repository.save(simulation);

        log.info("Simulation updated successfully with ID: {}", updatedSimulation.getId());

        return mapToResponse(updatedSimulation);
    }

    @Override
    @CacheEvict(value = "simulations", key = "#id")
    public void deleteSimulation(Long id) {

        log.info("Deleting simulation with ID: {}", id);

        Simulation simulation = repository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Simulation not found with ID: " + id));

        repository.delete(simulation);

        log.info("Simulation deleted successfully with ID: {}", id);
    }

    private SimulationResponse mapToResponse(Simulation simulation) {

        return SimulationResponse.builder()
                .id(simulation.getId())
                .simulationName(simulation.getSimulationName())
                .environment(simulation.getEnvironment())
                .status(simulation.getStatus())
                .description(simulation.getDescription())
                .createdAt(simulation.getCreatedAt())
                .build();
    }
}