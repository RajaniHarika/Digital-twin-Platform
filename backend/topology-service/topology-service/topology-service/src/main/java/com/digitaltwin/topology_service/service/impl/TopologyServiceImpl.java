package com.digitaltwin.topology_service.service.impl;

import com.digitaltwin.topology_service.dto.NodeDto;
import com.digitaltwin.topology_service.dto.PodDto;
import com.digitaltwin.topology_service.service.TopologyService;
import io.kubernetes.client.openapi.ApiClient;
import io.kubernetes.client.openapi.ApiException;
import io.kubernetes.client.openapi.apis.CoreV1Api;
import io.kubernetes.client.openapi.models.V1Node;
import io.kubernetes.client.openapi.models.V1NodeList;
import io.kubernetes.client.openapi.models.V1Pod;
import io.kubernetes.client.openapi.models.V1PodList;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class TopologyServiceImpl implements TopologyService {

    private final ApiClient apiClient;

    public TopologyServiceImpl(ApiClient apiClient) {
        this.apiClient = apiClient;
    }

    @Override
    public List<NodeDto> getAllNodes() {

        List<NodeDto> nodes = new ArrayList<>();

        try {

            CoreV1Api api = new CoreV1Api(apiClient);

            V1NodeList nodeList = api.listNode().execute();

            for (V1Node node : nodeList.getItems()) {

                String nodeName = node.getMetadata().getName();

                String status = "Unknown";

                if (node.getStatus() != null &&
                        node.getStatus().getConditions() != null) {

                    status = node.getStatus()
                            .getConditions()
                            .stream()
                            .filter(c -> "Ready".equals(c.getType()))
                            .findFirst()
                            .map(c -> c.getStatus())
                            .orElse("Unknown");
                }

                String role = "Worker";

                if (node.getMetadata().getLabels() != null &&
                        node.getMetadata().getLabels().containsKey("node-role.kubernetes.io/control-plane")) {

                    role = "Control Plane";
                }

                nodes.add(new NodeDto(nodeName, status, role));
            }

        } catch (ApiException e) {
            throw new RuntimeException("Failed to fetch Kubernetes nodes", e);
        }

        return nodes;
    }

    @Override
    public List<PodDto> getAllPods() {

        List<PodDto> pods = new ArrayList<>();

        try {

            CoreV1Api api = new CoreV1Api(apiClient);

            V1PodList podList = api.listPodForAllNamespaces().execute();

            for (V1Pod pod : podList.getItems()) {

                pods.add(
                        new PodDto(
                                pod.getMetadata().getName(),
                                pod.getMetadata().getNamespace(),
                                pod.getStatus().getPhase()
                        )
                );
            }

        } catch (ApiException e) {
            throw new RuntimeException("Failed to fetch Kubernetes pods", e);
        }

        return pods;
    }
}