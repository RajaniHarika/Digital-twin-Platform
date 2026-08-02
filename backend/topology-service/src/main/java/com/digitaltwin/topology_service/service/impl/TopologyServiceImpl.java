package com.digitaltwin.topology_service.service.impl;

import com.digitaltwin.topology_service.client.ClusterSyncClient;
import com.digitaltwin.topology_service.dto.*;
import com.digitaltwin.topology_service.service.TopologyService;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TopologyServiceImpl implements TopologyService {

    private final ClusterSyncClient clusterSyncClient;

    @Override
    @Cacheable(value = "topology-nodes", key = "'all'")
    public List<NodeDto> getAllNodes() {
        return clusterSyncClient.getNodes();
    }

    @Override
    @Cacheable(value = "topology-pods", key = "'all'")
    public List<PodDto> getAllPods() {
        return clusterSyncClient.getPods();
    }

    @Override
    @Cacheable(value = "topology-deployments", key = "'all'")
    public List<DeploymentDto> getAllDeployments() {
        return clusterSyncClient.getDeployments();
    }

    @Override
    @Cacheable(value = "topology-services", key = "'all'")
    public List<ServiceDto> getAllServices() {
        return clusterSyncClient.getServices();
    }

    @Override
    public TopologyGraphDto getTopologyGraph() {

        List<NodeDto> nodes = getAllNodes();
        List<PodDto> pods = getAllPods();
        List<DeploymentDto> deployments = getAllDeployments();
        List<ServiceDto> services = getAllServices();

        List<GraphNode> graphNodes = new ArrayList<>();
        List<GraphEdge> graphEdges = new ArrayList<>();

        if (nodes != null) {
            for (NodeDto node : nodes) {
                graphNodes.add(new GraphNode(node.getName(), node.getName(), "NODE"));
            }
        }

        if (pods != null) {
            for (PodDto pod : pods) {
                graphNodes.add(new GraphNode(pod.getName(), pod.getName(), "POD"));
                if (nodes != null && !nodes.isEmpty()) {
                    graphEdges.add(new GraphEdge(nodes.get(0).getName(), pod.getName(), "HOSTS"));
                }
            }
        }

        if (deployments != null) {
            for (DeploymentDto deployment : deployments) {
                graphNodes.add(new GraphNode(deployment.getName(), deployment.getName(), "DEPLOYMENT"));
                if (pods != null) {
                    for (PodDto pod : pods) {
                        graphEdges.add(new GraphEdge(deployment.getName(), pod.getName(), "MANAGES"));
                    }
                }
            }
        }

        if (services != null) {
            for (ServiceDto service : services) {
                graphNodes.add(new GraphNode(service.getName(), service.getName(), "SERVICE"));
                if (pods != null) {
                    for (PodDto pod : pods) {
                        graphEdges.add(new GraphEdge(service.getName(), pod.getName(), "EXPOSES"));
                    }
                }
            }
        }

        return new TopologyGraphDto(graphNodes, graphEdges);
    }
}