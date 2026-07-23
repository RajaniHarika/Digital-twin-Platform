package com.digitaltwin.topology_service.service.impl;

import com.digitaltwin.topology_service.dto.DeploymentDto;
import com.digitaltwin.topology_service.dto.NodeDto;
import com.digitaltwin.topology_service.dto.PodDto;
import com.digitaltwin.topology_service.service.TopologyService;
import io.kubernetes.client.openapi.ApiClient;
import io.kubernetes.client.openapi.ApiException;
import io.kubernetes.client.openapi.apis.AppsV1Api;
import io.kubernetes.client.openapi.apis.CoreV1Api;
import io.kubernetes.client.openapi.models.V1Deployment;
import io.kubernetes.client.openapi.models.V1Node;
import io.kubernetes.client.openapi.models.V1Pod;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class TopologyServiceImpl implements TopologyService {

    private final CoreV1Api coreV1Api;
    private final AppsV1Api appsV1Api;

    public TopologyServiceImpl(ApiClient apiClient) {
        this.coreV1Api = new CoreV1Api(apiClient);
        this.appsV1Api = new AppsV1Api(apiClient);
    }

    @Override
    public List<NodeDto> getAllNodes() {
        try {
            List<NodeDto> nodes = new ArrayList<>();

            List<V1Node> nodeList = coreV1Api
                    .listNode()
                    .execute()
                    .getItems();

            for (V1Node node : nodeList) {

                String name = node.getMetadata().getName();

                String status = "Unknown";
                if (node.getStatus() != null && node.getStatus().getConditions() != null) {
                    status = node.getStatus().getConditions().stream()
                            .filter(condition -> "Ready".equals(condition.getType()))
                            .findFirst()
                            .map(condition -> condition.getStatus())
                            .orElse("Unknown");
                }

                String role = "Worker";
                if (node.getMetadata().getLabels() != null &&
                        node.getMetadata().getLabels().containsKey("node-role.kubernetes.io/control-plane")) {
                    role = "Control Plane";
                }

                nodes.add(new NodeDto(name, status, role));
            }

            return nodes;

        } catch (ApiException e) {
            throw new RuntimeException("Failed to fetch Kubernetes nodes", e);
        }
    }

    @Override
    public List<PodDto> getAllPods() {
        try {
            List<PodDto> pods = new ArrayList<>();

            List<V1Pod> podList = coreV1Api
                    .listPodForAllNamespaces()
                    .execute()
                    .getItems();

            for (V1Pod pod : podList) {
                pods.add(new PodDto(
                        pod.getMetadata().getName(),
                        pod.getMetadata().getNamespace(),
                        pod.getStatus().getPhase()
                ));
            }

            return pods;

        } catch (ApiException e) {
            throw new RuntimeException("Failed to fetch Kubernetes pods", e);
        }
    }

    @Override
    public List<DeploymentDto> getAllDeployments() {

        List<DeploymentDto> deployments = new ArrayList<>();

        try {

            List<V1Deployment> deploymentList = appsV1Api
                    .listDeploymentForAllNamespaces()
                    .execute()
                    .getItems();

            for (V1Deployment deployment : deploymentList) {

                Integer replicas = 0;
                Integer availableReplicas = 0;

                if (deployment.getSpec() != null && deployment.getSpec().getReplicas() != null) {
                    replicas = deployment.getSpec().getReplicas();
                }

                if (deployment.getStatus() != null && deployment.getStatus().getAvailableReplicas() != null) {
                    availableReplicas = deployment.getStatus().getAvailableReplicas();
                }

                deployments.add(new DeploymentDto(
                        deployment.getMetadata().getName(),
                        deployment.getMetadata().getNamespace(),
                        replicas,
                        availableReplicas
                ));
            }

            return deployments;

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to fetch Kubernetes deployments", e);
        }
    }
}