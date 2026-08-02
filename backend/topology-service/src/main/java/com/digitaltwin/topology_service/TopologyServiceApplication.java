package com.digitaltwin.topology_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class TopologyServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(TopologyServiceApplication.class, args);
	}

}
