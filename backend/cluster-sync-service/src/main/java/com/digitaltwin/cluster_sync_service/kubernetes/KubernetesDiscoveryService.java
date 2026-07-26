package com.digitaltwin.cluster_sync_service.kubernetes;

import com.digitaltwin.cluster_sync_service.dto.DeploymentInfo;
import com.digitaltwin.cluster_sync_service.dto.NamespaceInfo;
import com.digitaltwin.cluster_sync_service.dto.NodeInfo;
import com.digitaltwin.cluster_sync_service.dto.PodInfo;
import com.digitaltwin.cluster_sync_service.dto.ServiceInfo;
import io.kubernetes.client.openapi.ApiClient;
import io.kubernetes.client.openapi.ApiException;
import io.kubernetes.client.openapi.apis.AppsV1Api;
import io.kubernetes.client.openapi.apis.CoreV1Api;
import io.kubernetes.client.openapi.models.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.digitaltwin.cluster_sync_service.dto.ConfigMapInfo;


import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class KubernetesDiscoveryService {

    private final ApiClient apiClient;

    // ==========================
    // Get All Kubernetes Nodes
    // ==========================
    public List<NodeInfo> getAllNodes() throws ApiException {

        CoreV1Api api = new CoreV1Api(apiClient);

        V1NodeList nodeList = api.listNode().execute();

        List<NodeInfo> nodes = new ArrayList<>();

        for (V1Node node : nodeList.getItems()) {

            String status = "Unknown";

            if (node.getStatus() != null &&
                    node.getStatus().getConditions() != null) {

                status = node.getStatus().getConditions()
                        .stream()
                        .filter(c -> "Ready".equals(c.getType()))
                        .findFirst()
                        .map(c -> c.getStatus())
                        .orElse("Unknown");
            }

            String version = "";
            String os = "";
            String architecture = "";

            if (node.getStatus() != null &&
                    node.getStatus().getNodeInfo() != null) {

                version = node.getStatus().getNodeInfo().getKubeletVersion();
                os = node.getStatus().getNodeInfo().getOperatingSystem();
                architecture = node.getStatus().getNodeInfo().getArchitecture();
            }

            nodes.add(NodeInfo.builder()
                    .name(node.getMetadata().getName())
                    .status(status)
                    .version(version)
                    .os(os)
                    .architecture(architecture)
                    .build());
        }

        return nodes;
    }

    // ==========================
    // Get All Kubernetes Pods
    // ==========================
    public List<PodInfo> getAllPods() throws ApiException {

        CoreV1Api api = new CoreV1Api(apiClient);

        V1PodList podList = api.listPodForAllNamespaces().execute();

        List<PodInfo> pods = new ArrayList<>();

        for (V1Pod pod : podList.getItems()) {

            String image = "";

            if (pod.getSpec() != null &&
                    pod.getSpec().getContainers() != null &&
                    !pod.getSpec().getContainers().isEmpty()) {

                image = pod.getSpec()
                        .getContainers()
                        .get(0)
                        .getImage();
            }

            pods.add(PodInfo.builder()
                    .name(pod.getMetadata().getName())
                    .namespace(pod.getMetadata().getNamespace())
                    .status(pod.getStatus() != null ? pod.getStatus().getPhase() : "")
                    .nodeName(pod.getSpec() != null ? pod.getSpec().getNodeName() : "")
                    .podIP(pod.getStatus() != null ? pod.getStatus().getPodIP() : "")
                    .image(image)
                    .build());
        }

        return pods;
    }

    // ==========================
    // Get All Kubernetes Namespaces
    // ==========================
    public List<NamespaceInfo> getAllNamespaces() throws ApiException {

        CoreV1Api api = new CoreV1Api(apiClient);

        V1NamespaceList namespaceList = api.listNamespace().execute();

        List<NamespaceInfo> namespaces = new ArrayList<>();

        for (V1Namespace namespace : namespaceList.getItems()) {

            String status = "";
            String creationTimestamp = "";

            if (namespace.getStatus() != null) {
                status = namespace.getStatus().getPhase();
            }

            if (namespace.getMetadata() != null &&
                    namespace.getMetadata().getCreationTimestamp() != null) {

                creationTimestamp = namespace.getMetadata()
                        .getCreationTimestamp()
                        .toString();
            }

            namespaces.add(NamespaceInfo.builder()
                    .name(namespace.getMetadata().getName())
                    .status(status)
                    .creationTimestamp(creationTimestamp)
                    .build());
        }

        return namespaces;
    }

    // ==========================
    // Get All Kubernetes Deployments
    // ==========================
    public List<DeploymentInfo> getAllDeployments() throws ApiException {

        AppsV1Api api = new AppsV1Api(apiClient);

        V1DeploymentList deploymentList =
                api.listDeploymentForAllNamespaces().execute();

        List<DeploymentInfo> deployments = new ArrayList<>();

        for (V1Deployment deployment : deploymentList.getItems()) {

            Integer desiredReplicas = 0;
            Integer availableReplicas = 0;
            String strategy = "";
            String creationTimestamp = "";

            if (deployment.getSpec() != null) {

                desiredReplicas = deployment.getSpec().getReplicas();

                if (deployment.getSpec().getStrategy() != null) {
                    strategy = deployment.getSpec()
                            .getStrategy()
                            .getType();
                }
            }

            if (deployment.getStatus() != null &&
                    deployment.getStatus().getAvailableReplicas() != null) {

                availableReplicas =
                        deployment.getStatus().getAvailableReplicas();
            }

            if (deployment.getMetadata() != null &&
                    deployment.getMetadata().getCreationTimestamp() != null) {

                creationTimestamp =
                        deployment.getMetadata()
                                .getCreationTimestamp()
                                .toString();
            }

            deployments.add(DeploymentInfo.builder()
                    .name(deployment.getMetadata().getName())
                    .namespace(deployment.getMetadata().getNamespace())
                    .desiredReplicas(desiredReplicas)
                    .availableReplicas(availableReplicas)
                    .strategy(strategy)
                    .creationTimestamp(creationTimestamp)
                    .build());
        }

        return deployments;
    }

    // ==========================
    // Get All Kubernetes Services
    // ==========================
    public List<ServiceInfo> getAllServices() throws ApiException {

        CoreV1Api api = new CoreV1Api(apiClient);

        V1ServiceList serviceList =
                api.listServiceForAllNamespaces().execute();

        List<ServiceInfo> services = new ArrayList<>();

        for (V1Service service : serviceList.getItems()) {

            String clusterIP = "";
            String externalIP = "None";
            String ports = "";

            if (service.getSpec() != null) {

                if (service.getSpec().getClusterIP() != null) {
                    clusterIP = service.getSpec().getClusterIP();
                }

                if (service.getSpec().getExternalIPs() != null &&
                        !service.getSpec().getExternalIPs().isEmpty()) {

                    externalIP = String.join(",",
                            service.getSpec().getExternalIPs());
                }

                if (service.getSpec().getPorts() != null) {

                    StringBuilder sb = new StringBuilder();

                    service.getSpec().getPorts().forEach(port -> {

                        sb.append(port.getPort());

                        if (port.getTargetPort() != null) {
                            sb.append(":")
                              .append(port.getTargetPort());
                        }

                        if (port.getProtocol() != null) {
                            sb.append("/")
                              .append(port.getProtocol());
                        }

                        sb.append(" ");
                    });

                    ports = sb.toString().trim();
                }
            }

            services.add(ServiceInfo.builder()
                    .name(service.getMetadata().getName())
                    .namespace(service.getMetadata().getNamespace())
                    .type(service.getSpec() != null ? service.getSpec().getType() : "")
                    .clusterIP(clusterIP)
                    .externalIP(externalIP)
                    .ports(ports)
                    .build());
        }

        return services;
    }
// ==========================
// Get All Kubernetes ConfigMaps
// ==========================
public List<ConfigMapInfo> getAllConfigMaps() throws ApiException {

    CoreV1Api api = new CoreV1Api(apiClient);

    V1ConfigMapList configMapList = api
            .listConfigMapForAllNamespaces()
            .execute();

    List<ConfigMapInfo> configMaps = new ArrayList<>();

    for (V1ConfigMap configMap : configMapList.getItems()) {

        Integer dataCount = 0;
        String creationTimestamp = "";

        if (configMap.getData() != null) {
            dataCount = configMap.getData().size();
        }

        if (configMap.getMetadata() != null &&
                configMap.getMetadata().getCreationTimestamp() != null) {

            creationTimestamp = configMap.getMetadata()
                    .getCreationTimestamp()
                    .toString();
        }

        configMaps.add(
                ConfigMapInfo.builder()
                        .name(configMap.getMetadata().getName())
                        .namespace(configMap.getMetadata().getNamespace())
                        .dataCount(dataCount)
                        .creationTimestamp(creationTimestamp)
                        .build()
        );
    }

    return configMaps;
}
}