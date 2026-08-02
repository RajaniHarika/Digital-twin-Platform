package com.digitaltwin.cost_service.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "resource_costs")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResourceCost {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // AWS resource type: EC2, RDS, S3, EKS, etc.
    @Column(nullable = false)
    private String resourceType;

    // AWS resource identifier (e.g., instance-id, bucket-name)
    @Column(nullable = false)
    private String resourceId;

    // Human-friendly label
    private String resourceName;

    // Cost in USD for the billing period
    @Column(nullable = false)
    private Double cost;

    // Currency (default: USD)
    @Column(nullable = false)
    private String currency;

    // Billing date (daily cost record)
    @Column(nullable = false)
    private LocalDate billingDate;

    // AWS region (e.g., ap-south-1)
    private String region;

    // Service tag / team / environment label for grouping
    private String tag;

    // Status: NORMAL | WARNING | CRITICAL
    @Column(nullable = false)
    private String status;
}
