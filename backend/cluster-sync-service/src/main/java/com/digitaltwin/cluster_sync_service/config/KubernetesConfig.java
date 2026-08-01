package com.digitaltwin.cluster_sync_service.config;

import io.kubernetes.client.openapi.ApiClient;
import io.kubernetes.client.util.Config;
import jakarta.annotation.PostConstruct;
import org.springframework.context.annotation.Bean;

@org.springframework.context.annotation.Configuration
public class KubernetesConfig {

    @Bean
    public ApiClient apiClient() throws Exception {

        ApiClient client = Config.defaultClient();

        io.kubernetes.client.openapi.Configuration.setDefaultApiClient(client);

        return client;
    }

    @PostConstruct
    public void verifyConnection() {
        System.out.println("=========================================");
        System.out.println(" Kubernetes Client Initialized");
        System.out.println(" Using kubeconfig from default location");
        System.out.println("=========================================");
    }
}