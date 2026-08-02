package com.digitaltwin.risk_service.repository;

import com.digitaltwin.risk_service.entity.Risk;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RiskRepository extends JpaRepository<Risk, Long> {

}