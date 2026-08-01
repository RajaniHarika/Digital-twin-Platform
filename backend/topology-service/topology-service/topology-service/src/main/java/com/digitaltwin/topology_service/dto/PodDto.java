package com.digitaltwin.topology_service.dto;

public class PodDto {

    private String name;
    private String namespace;
    private String status;

    public PodDto(String name, String namespace, String status) {
        this.name = name;
        this.namespace = namespace;
        this.status = status;
    }

    public String getName() {
        return name;
    }

    public String getNamespace() {
        return namespace;
    }

    public String getStatus() {
        return status;
    }
}