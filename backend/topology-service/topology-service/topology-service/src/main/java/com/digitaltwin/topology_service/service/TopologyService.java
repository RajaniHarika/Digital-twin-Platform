package com.digitaltwin.topology_service.service;

import com.digitaltwin.topology_service.dto.NodeDto;

import java.util.List;

public interface TopologyService {

    List<NodeDto> getAllNodes();

}