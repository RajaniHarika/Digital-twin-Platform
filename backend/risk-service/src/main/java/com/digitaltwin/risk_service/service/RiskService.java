package com.digitaltwin.risk_service.service;

import com.digitaltwin.risk_service.dto.RiskRequest;
import com.digitaltwin.risk_service.dto.RiskResponse;

import java.util.List;

public interface RiskService {

    RiskResponse createRisk(RiskRequest request);

    List<RiskResponse> getAllRisks();

    RiskResponse getRiskById(Long id);

    RiskResponse updateRisk(Long id, RiskRequest request);

    void deleteRisk(Long id);
}