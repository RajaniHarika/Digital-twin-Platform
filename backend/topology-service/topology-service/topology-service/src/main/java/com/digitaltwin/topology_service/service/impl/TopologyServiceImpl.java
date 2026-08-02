package com.digitaltwin.topology_service.service.impl;

import com.digitaltwin.topology_service.dto.*;
import com.digitaltwin.topology_service.service.TopologyService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;

@Service
public class TopologyServiceImpl implements TopologyService {

    private final RestTemplate restTemplate;

    @Value("${cluster.sync.base-url}")
    private String clusterSyncBaseUrl;

    public TopologyServiceImpl(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    @Override
    public List<NodeDto> getAllNodes() {
        return restTemplate.exchange(
                clusterSyncBaseUrl + "/api/kubernetes/nodes",
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<List<NodeDto>>() {
                }
        ).getBody();
    }

    @Override
    public List<PodDto> getAllPods() {
        return restTemplate.exchange(
                clusterSyncBaseUrl + "/api/kubernetes/pods",
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<List<PodDto>>() {
                }
        ).getBody();
    }

    @Override
    public List<DeploymentDto> getAllDeployments() {
        return restTemplate.exchange(
                clusterSyncBaseUrl + "/api/kubernetes/deployments",
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<List<DeploymentDto>>() {
                }
        ).getBody();
    }

    @Override
    public List<ServiceDto> getAllServices() {
        return restTemplate.exchange(
                clusterSyncBaseUrl + "/api/kubernetes/services",
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<List<ServiceDto>>() {
                }
        ).getBody();
    }

    @Override
    public TopologyGraphDto getTopologyGraph() {

        List<NodeDto> nodes = getAllNodes();
        List<PodDto> pods = getAllPods();
        List<DeploymentDto> deployments = getAllDeployments();
        List<ServiceDto> services = getAllServices();

        List<GraphNode> graphNodes = new ArrayList<>();
        List<GraphEdge> graphEdges = new ArrayList<>();

        // Nodes
        if (nodes != null) {
            for (NodeDto node : nodes) {
                graphNodes.add(new GraphNode(
                        node.getName(),
                        node.getName(),
                        "NODE"
                ));
            }
        }

        // Pods
        if (pods != null) {
            for (PodDto pod : pods) {
                graphNodes.add(new GraphNode(
                        pod.getName(),
                        pod.getName(),
                        "POD"
                ));

                // Demo relationship: first node hosts every pod
                if (nodes != null && !nodes.isEmpty()) {
                    graphEdges.add(new GraphEdge(
                            nodes.get(0).getName(),
                            pod.getName(),
                            "HOSTS"
                    ));
                }
            }
        }

        // Deployments
        if (deployments != null) {
            for (DeploymentDto deployment : deployments) {
                graphNodes.add(new GraphNode(
                        deployment.getName(),
                        deployment.getName(),
                        "DEPLOYMENT"
                ));

                // Demo relationship: deployment manages every pod
                if (pods != null) {
                    for (PodDto pod : pods) {
                        graphEdges.add(new GraphEdge(
                                deployment.getName(),
                                pod.getName(),
                                "MANAGES"
                        ));
                    }
                }
            }
        }

        // Services
        if (services != null) {
            for (ServiceDto service : services) {
                graphNodes.add(new GraphNode(
                        service.getName(),
                        service.getName(),
                        "SERVICE"
                ));

                // Demo relationship: service exposes every pod
                if (pods != null) {
                    for (PodDto pod : pods) {
                        graphEdges.add(new GraphEdge(
                                service.getName(),
                                pod.getName(),
                                "EXPOSES"
                        ));
                    }
                }
            }
        }

        return new TopologyGraphDto(graphNodes, graphEdges);
    }
}