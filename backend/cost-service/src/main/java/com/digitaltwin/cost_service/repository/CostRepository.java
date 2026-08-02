package com.digitaltwin.cost_service.repository;

import com.digitaltwin.cost_service.entity.ResourceCost;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface CostRepository extends JpaRepository<ResourceCost, Long> {

    List<ResourceCost> findByResourceType(String resourceType);

    List<ResourceCost> findByResourceId(String resourceId);

    List<ResourceCost> findByStatus(String status);

    List<ResourceCost> findByBillingDateBetween(LocalDate from, LocalDate to);

    List<ResourceCost> findByRegion(String region);

    List<ResourceCost> findByTag(String tag);

    // Aggregated total cost per resource type
    @Query("SELECT r.resourceType, SUM(r.cost), r.currency, COUNT(r) " +
           "FROM ResourceCost r GROUP BY r.resourceType, r.currency")
    List<Object[]> findCostSummaryByResourceType();

    // Total cost for a given date range
    @Query("SELECT SUM(r.cost) FROM ResourceCost r WHERE r.billingDate BETWEEN :from AND :to")
    Double findTotalCostBetweenDates(@Param("from") LocalDate from, @Param("to") LocalDate to);
}
