package com.digitaltwin.topology_service.dto;

public class DeploymentDto {

    private String name;
    private String namespace;
    private Integer replicas;
    private Integer availableReplicas;

    public DeploymentDto() {
    }

    public DeploymentDto(String name, String namespace, Integer replicas, Integer availableReplicas) {
        this.name = name;
        this.namespace = namespace;
        this.replicas = replicas;
        this.availableReplicas = availableReplicas;
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

    public Integer getReplicas() {
        return replicas;
    }

    public void setReplicas(Integer replicas) {
        this.replicas = replicas;
    }

    public Integer getAvailableReplicas() {
        return availableReplicas;
    }

    public void setAvailableReplicas(Integer availableReplicas) {
        this.availableReplicas = availableReplicas;
    }
}