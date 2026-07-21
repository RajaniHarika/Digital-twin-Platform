package com.digitaltwin.topology_service.dto;

public class PodDto {

    private String name;
    private String namespace;
    private String status;

    public PodDto() {
    }

    public PodDto(String name, String namespace, String status) {
        this.name = name;
        this.namespace = namespace;
        this.status = status;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getNamespace() {
        return namespace;
    }

    public void setNamespace(String namespace) {
        this.namespace = namespace;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}