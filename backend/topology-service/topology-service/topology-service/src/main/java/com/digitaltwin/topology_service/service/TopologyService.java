package com.digitaltwin.topology_service.service;

import com.digitaltwin.topology_service.dto.*;

import java.util.List;

public interface TopologyService {

    List<NodeDto> getAllNodes();

    List<PodDto> getAllPods();

    List<DeploymentDto> getAllDeployments();

    List<ServiceDto> getAllServices();

    TopologyGraphDto getTopologyGraph();
}