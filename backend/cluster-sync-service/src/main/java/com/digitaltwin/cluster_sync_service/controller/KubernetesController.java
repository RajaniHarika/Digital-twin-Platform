package com.digitaltwin.cluster_sync_service.controller;

import com.digitaltwin.cluster_sync_service.dto.ConfigMapInfo;
import com.digitaltwin.cluster_sync_service.dto.DeploymentInfo;
import com.digitaltwin.cluster_sync_service.dto.NamespaceInfo;
import com.digitaltwin.cluster_sync_service.dto.NodeInfo;
import com.digitaltwin.cluster_sync_service.dto.PodInfo;
import com.digitaltwin.cluster_sync_service.dto.ServiceInfo;
import com.digitaltwin.cluster_sync_service.kubernetes.KubernetesDiscoveryService;
import io.kubernetes.client.openapi.ApiException;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/kubernetes")
@RequiredArgsConstructor
public class KubernetesController {

    private final KubernetesDiscoveryService kubernetesDiscoveryService;

    // ==========================
    // Get All Nodes
    // ==========================
    @GetMapping("/nodes")
    public List<NodeInfo> getAllNodes() throws ApiException {
        return kubernetesDiscoveryService.getAllNodes();
    }

    // ==========================
    // Get All Pods
    // ==========================
    @GetMapping("/pods")
    public List<PodInfo> getAllPods() throws ApiException {
        return kubernetesDiscoveryService.getAllPods();
    }

    // ==========================
    // Get All Namespaces
    // ==========================
    @GetMapping("/namespaces")
    public List<NamespaceInfo> getAllNamespaces() throws ApiException {
        return kubernetesDiscoveryService.getAllNamespaces();
    }

    // ==========================
    // Get All Deployments
    // ==========================
    @GetMapping("/deployments")
    public List<DeploymentInfo> getAllDeployments() throws ApiException {
        return kubernetesDiscoveryService.getAllDeployments();
    }

    // ==========================
    // Get All Services
    // ==========================
    @GetMapping("/services")
    public List<ServiceInfo> getAllServices() throws ApiException {
        return kubernetesDiscoveryService.getAllServices();
    }

    // ==========================
    // Get All ConfigMaps
    // ==========================
    @GetMapping("/configmaps")
    public List<ConfigMapInfo> getAllConfigMaps() throws ApiException {
        return kubernetesDiscoveryService.getAllConfigMaps();
    }
}