package com.digitaltwin.risk_service.controller;

import com.digitaltwin.risk_service.dto.RiskRequest;
import com.digitaltwin.risk_service.dto.RiskResponse;
import com.digitaltwin.risk_service.service.RiskService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/risks")
@CrossOrigin("*")
public class RiskController {

    private final RiskService riskService;

    public RiskController(RiskService riskService) {
        this.riskService = riskService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public RiskResponse createRisk(@Valid @RequestBody RiskRequest request) {
        return riskService.createRisk(request);
    }

    @GetMapping
    public List<RiskResponse> getAllRisks() {
        return riskService.getAllRisks();
    }

    @GetMapping("/{id}")
    public RiskResponse getRiskById(@PathVariable Long id) {
        return riskService.getRiskById(id);
    }

    @PutMapping("/{id}")
    public RiskResponse updateRisk(@PathVariable Long id,
                                   @Valid @RequestBody RiskRequest request) {
        return riskService.updateRisk(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteRisk(@PathVariable Long id) {
        riskService.deleteRisk(id);
    }

    @GetMapping("/health")
    public String health() {
        return "Risk Service is Running!";
    }
}