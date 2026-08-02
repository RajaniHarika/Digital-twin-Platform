package com.digitaltwin.cost_service.service;

import com.digitaltwin.cost_service.dto.CostRequest;
import com.digitaltwin.cost_service.dto.CostResponse;
import com.digitaltwin.cost_service.dto.CostSummaryResponse;

import java.time.LocalDate;
import java.util.List;

public interface CostService {

    CostResponse createCostRecord(CostRequest request);

    List<CostResponse> getAllCosts();

    CostResponse getCostById(Long id);

    List<CostResponse> getCostsByResourceType(String resourceType);

    List<CostResponse> getCostsByStatus(String status);

    List<CostResponse> getCostsByDateRange(LocalDate from, LocalDate to);

    List<CostResponse> getCostsByRegion(String region);

    List<CostResponse> getCostsByTag(String tag);

    List<CostSummaryResponse> getCostSummary();

    Double getTotalCostBetweenDates(LocalDate from, LocalDate to);

    CostResponse updateCostRecord(Long id, CostRequest request);

    void deleteCostRecord(Long id);
}
