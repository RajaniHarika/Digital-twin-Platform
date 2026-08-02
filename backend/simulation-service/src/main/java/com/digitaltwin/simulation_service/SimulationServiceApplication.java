package com.digitaltwin.simulation_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class SimulationServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(SimulationServiceApplication.class, args);
	}

}
