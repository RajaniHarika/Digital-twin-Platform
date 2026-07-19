package com.digitaltwin.topology_service.service.impl;

import com.digitaltwin.topology_service.dto.NodeDto;
import com.digitaltwin.topology_service.service.TopologyService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TopologyServiceImpl implements TopologyService {

    @Override
    public List<NodeDto> getAllNodes() {

        return List.of(
                new NodeDto("minikube", "Ready", "Control Plane"),
                new NodeDto("worker-1", "Ready", "Worker"),
                new NodeDto("worker-2", "Ready", "Worker")
        );
    }
}