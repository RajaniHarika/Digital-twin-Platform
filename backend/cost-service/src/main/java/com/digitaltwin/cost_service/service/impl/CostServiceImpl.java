package com.digitaltwin.cost_service.service.impl;

import com.digitaltwin.cost_service.dto.CostRequest;
import com.digitaltwin.cost_service.dto.CostResponse;
import com.digitaltwin.cost_service.dto.CostSummaryResponse;
import com.digitaltwin.cost_service.entity.ResourceCost;
import com.digitaltwin.cost_service.exception.ResourceNotFoundException;
import com.digitaltwin.cost_service.repository.CostRepository;
import com.digitaltwin.cost_service.service.CostService;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CostServiceImpl implements CostService {

    private final CostRepository costRepository;

    // ─── Helpers ──────────────────────────────────────────────────────────

    private ResourceCost toEntity(CostRequest request) {
        return ResourceCost.builder()
                .resourceType(request.getResourceType())
                .resourceId(request.getResourceId())
                .resourceName(request.getResourceName())
                .cost(request.getCost())
                .currency(request.getCurrency() != null ? request.getCurrency() : "USD")
                .billingDate(request.getBillingDate())
                .region(request.getRegion())
                .tag(request.getTag())
                .status(request.getStatus() != null ? request.getStatus() : "NORMAL")
                .build();
    }

    private CostResponse toResponse(ResourceCost entity) {
        return CostResponse.builder()
                .id(entity.getId())
                .resourceType(entity.getResourceType())
                .resourceId(entity.getResourceId())
                .resourceName(entity.getResourceName())
                .cost(entity.getCost())
                .currency(entity.getCurrency())
                .billingDate(entity.getBillingDate())
                .region(entity.getRegion())
                .tag(entity.getTag())
                .status(entity.getStatus())
                .build();
    }

    // ─── CRUD ─────────────────────────────────────────────────────────────

    @Override
    public CostResponse createCostRecord(CostRequest request) {
        ResourceCost saved = costRepository.save(toEntity(request));
        return toResponse(saved);
    }

    @Override
    public List<CostResponse> getAllCosts() {
        return costRepository.findAll()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Cacheable(value = "costs", key = "#id")
    public CostResponse getCostById(Long id) {
        ResourceCost entity = costRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cost record not found with id: " + id));
        return toResponse(entity);
    }

    @Override
    @CacheEvict(value = "costs", key = "#id")
    public CostResponse updateCostRecord(Long id, CostRequest request) {
        ResourceCost existing = costRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cost record not found with id: " + id));

        existing.setResourceType(request.getResourceType());
        existing.setResourceId(request.getResourceId());
        existing.setResourceName(request.getResourceName());
        existing.setCost(request.getCost());
        existing.setCurrency(request.getCurrency() != null ? request.getCurrency() : "USD");
        existing.setBillingDate(request.getBillingDate());
        existing.setRegion(request.getRegion());
        existing.setTag(request.getTag());
        existing.setStatus(request.getStatus() != null ? request.getStatus() : "NORMAL");

        return toResponse(costRepository.save(existing));
    }

    @Override
    @CacheEvict(value = "costs", key = "#id")
    public void deleteCostRecord(Long id) {
        if (!costRepository.existsById(id)) {
            throw new ResourceNotFoundException("Cost record not found with id: " + id);
        }
        costRepository.deleteById(id);
    }

    // ─── Filters ──────────────────────────────────────────────────────────

    @Override
    public List<CostResponse> getCostsByResourceType(String resourceType) {
        return costRepository.findByResourceType(resourceType)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Override
    public List<CostResponse> getCostsByStatus(String status) {
        return costRepository.findByStatus(status)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Override
    public List<CostResponse> getCostsByDateRange(LocalDate from, LocalDate to) {
        return costRepository.findByBillingDateBetween(from, to)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Override
    public List<CostResponse> getCostsByRegion(String region) {
        return costRepository.findByRegion(region)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Override
    public List<CostResponse> getCostsByTag(String tag) {
        return costRepository.findByTag(tag)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    // ─── Analytics ────────────────────────────────────────────────────────

    @Override
    public List<CostSummaryResponse> getCostSummary() {
        return costRepository.findCostSummaryByResourceType()
                .stream()
                .map(row -> new CostSummaryResponse(
                        (String) row[0],
                        (Double) row[1],
                        (String) row[2],
                        (Long) row[3]
                ))
                .collect(Collectors.toList());
    }

    @Override
    public Double getTotalCostBetweenDates(LocalDate from, LocalDate to) {
        Double total = costRepository.findTotalCostBetweenDates(from, to);
        return total != null ? total : 0.0;
    }
}
