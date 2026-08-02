package com.digitaltwin.risk_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class RiskServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(RiskServiceApplication.class, args);
	}

}
