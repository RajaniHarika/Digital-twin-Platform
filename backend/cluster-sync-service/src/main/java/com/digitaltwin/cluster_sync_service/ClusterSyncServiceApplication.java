package com.digitaltwin.cluster_sync_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class ClusterSyncServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(ClusterSyncServiceApplication.class, args);
	}

}
