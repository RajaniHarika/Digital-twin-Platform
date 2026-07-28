package com.digitaltwin.topology_service.service;

import com.digitaltwin.topology_service.dto.DeploymentDto;
import com.digitaltwin.topology_service.dto.NodeDto;
import com.digitaltwin.topology_service.dto.PodDto;
import com.digitaltwin.topology_service.dto.ServiceDto;

import java.util.List;

public interface TopologyService {

    List<NodeDto> getAllNodes();

    List<PodDto> getAllPods();

    List<DeploymentDto> getAllDeployments();

    List<ServiceDto> getAllServices();

}