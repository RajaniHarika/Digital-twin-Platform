package com.digitaltwin.risk_service.service.impl;

import com.digitaltwin.risk_service.dto.RiskRequest;
import com.digitaltwin.risk_service.dto.RiskResponse;
import com.digitaltwin.risk_service.entity.Risk;
import com.digitaltwin.risk_service.exception.ResourceNotFoundException;
import com.digitaltwin.risk_service.repository.RiskRepository;
import com.digitaltwin.risk_service.service.RiskService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
public class RiskServiceImpl implements RiskService {

    private final RiskRepository riskRepository;

    public RiskServiceImpl(RiskRepository riskRepository) {
        this.riskRepository = riskRepository;
    }

    @Override
    public RiskResponse createRisk(RiskRequest request) {

        log.info("Creating new risk for application: {}", request.getApplicationName());

        Risk risk = Risk.builder()
                .simulationId(request.getSimulationId())
                .applicationName(request.getApplicationName())
                .riskScore(request.getRiskScore())
                .riskLevel(request.getRiskLevel())
                .impact(request.getImpact())
                .recommendation(request.getRecommendation())
                .analyzedAt(LocalDateTime.now())
                .build();

        Risk savedRisk = riskRepository.save(risk);

        log.info("Risk created successfully with ID: {}", savedRisk.getId());

        return mapToResponse(savedRisk);
    }

    @Override
    public List<RiskResponse> getAllRisks() {

        log.info("Fetching all risks");

        return riskRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Cacheable(value = "risks", key = "#id")
    public RiskResponse getRiskById(Long id) {

        log.info("Fetching risk with ID: {}", id);

        Risk risk = riskRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Risk not found with ID: " + id));

        return mapToResponse(risk);
    }

    @Override
    @CacheEvict(value = "risks", key = "#id")
    public RiskResponse updateRisk(Long id, RiskRequest request) {

        log.info("Updating risk with ID: {}", id);

        Risk risk = riskRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Risk not found with ID: " + id));

        risk.setSimulationId(request.getSimulationId());
        risk.setApplicationName(request.getApplicationName());
        risk.setRiskScore(request.getRiskScore());
        risk.setRiskLevel(request.getRiskLevel());
        risk.setImpact(request.getImpact());
        risk.setRecommendation(request.getRecommendation());

        Risk updatedRisk = riskRepository.save(risk);

        log.info("Risk updated successfully with ID: {}", updatedRisk.getId());

        return mapToResponse(updatedRisk);
    }

    @Override
    @CacheEvict(value = "risks", key = "#id")
    public void deleteRisk(Long id) {

        log.info("Deleting risk with ID: {}", id);

        Risk risk = riskRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Risk not found with ID: " + id));

        riskRepository.delete(risk);

        log.info("Risk deleted successfully with ID: {}", id);
    }

    private RiskResponse mapToResponse(Risk risk) {

        return RiskResponse.builder()
                .id(risk.getId())
                .simulationId(risk.getSimulationId())
                .applicationName(risk.getApplicationName())
                .riskScore(risk.getRiskScore())
                .riskLevel(risk.getRiskLevel())
                .impact(risk.getImpact())
                .recommendation(risk.getRecommendation())
                .analyzedAt(risk.getAnalyzedAt())
                .build();
    }
}