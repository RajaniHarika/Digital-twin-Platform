package com.digitaltwin.cost_service.controller;

import com.digitaltwin.cost_service.dto.CostRequest;
import com.digitaltwin.cost_service.dto.CostResponse;
import com.digitaltwin.cost_service.dto.CostSummaryResponse;
import com.digitaltwin.cost_service.service.CostService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/costs")
@RequiredArgsConstructor
@Tag(name = "Cost Service", description = "APIs for managing AWS infrastructure cost records")
public class CostController {

    private final CostService costService;

    // ─── CRUD ─────────────────────────────────────────────────────────────

    @PostMapping
    @Operation(summary = "Create a cost record")
    public ResponseEntity<CostResponse> create(@Valid @RequestBody CostRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(costService.createCostRecord(request));
    }

    @GetMapping
    @Operation(summary = "Get all cost records")
    public ResponseEntity<List<CostResponse>> getAll() {
        return ResponseEntity.ok(costService.getAllCosts());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get cost record by ID")
    public ResponseEntity<CostResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(costService.getCostById(id));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a cost record")
    public ResponseEntity<CostResponse> update(@PathVariable Long id,
                                               @Valid @RequestBody CostRequest request) {
        return ResponseEntity.ok(costService.updateCostRecord(id, request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a cost record")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        costService.deleteCostRecord(id);
        return ResponseEntity.noContent().build();
    }

    // ─── Filters ──────────────────────────────────────────────────────────

    @GetMapping("/by-type/{resourceType}")
    @Operation(summary = "Get costs by resource type (EC2, RDS, S3, EKS, etc.)")
    public ResponseEntity<List<CostResponse>> getByResourceType(@PathVariable String resourceType) {
        return ResponseEntity.ok(costService.getCostsByResourceType(resourceType));
    }

    @GetMapping("/by-status/{status}")
    @Operation(summary = "Get costs by status (NORMAL, WARNING, CRITICAL)")
    public ResponseEntity<List<CostResponse>> getByStatus(@PathVariable String status) {
        return ResponseEntity.ok(costService.getCostsByStatus(status));
    }

    @GetMapping("/by-region/{region}")
    @Operation(summary = "Get costs by AWS region")
    public ResponseEntity<List<CostResponse>> getByRegion(@PathVariable String region) {
        return ResponseEntity.ok(costService.getCostsByRegion(region));
    }

    @GetMapping("/by-tag/{tag}")
    @Operation(summary = "Get costs by tag/environment label")
    public ResponseEntity<List<CostResponse>> getByTag(@PathVariable String tag) {
        return ResponseEntity.ok(costService.getCostsByTag(tag));
    }

    @GetMapping("/by-date-range")
    @Operation(summary = "Get costs within a date range (yyyy-MM-dd)")
    public ResponseEntity<List<CostResponse>> getByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        return ResponseEntity.ok(costService.getCostsByDateRange(from, to));
    }

    // ─── Analytics ────────────────────────────────────────────────────────

    @GetMapping("/summary")
    @Operation(summary = "Get cost summary grouped by resource type")
    public ResponseEntity<List<CostSummaryResponse>> getSummary() {
        return ResponseEntity.ok(costService.getCostSummary());
    }

    @GetMapping("/total")
    @Operation(summary = "Get total cost for a date range")
    public ResponseEntity<Double> getTotalCost(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        return ResponseEntity.ok(costService.getTotalCostBetweenDates(from, to));
    }
}
