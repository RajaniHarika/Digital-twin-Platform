package com.digitaltwin.cost_service.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.time.LocalDate;

@Data
public class CostRequest {

    @NotBlank(message = "Resource type is required")
    private String resourceType;

    @NotBlank(message = "Resource ID is required")
    private String resourceId;

    private String resourceName;

    @NotNull(message = "Cost is required")
    @Positive(message = "Cost must be positive")
    private Double cost;

    private String currency = "USD";

    @NotNull(message = "Billing date is required")
    private LocalDate billingDate;

    private String region;

    private String tag;

    // NORMAL | WARNING | CRITICAL
    private String status = "NORMAL";
}
