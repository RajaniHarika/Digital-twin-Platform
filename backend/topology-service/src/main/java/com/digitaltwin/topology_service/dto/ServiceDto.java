package com.digitaltwin.topology_service.dto;

public class ServiceDto {

    private String name;
    private String namespace;
    private String type;
    private String clusterIP;

    public ServiceDto() {
    }

    public ServiceDto(String name, String namespace, String type, String clusterIP) {
        this.name = name;
        this.namespace = namespace;
        this.type = type;
        this.clusterIP = clusterIP;
    }

    public String getName() {
        return name;
    }

    public String getNamespace() {
        return namespace;
    }

    public String getType() {
        return type;
    }

    public String getClusterIP() {
        return clusterIP;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setNamespace(String namespace) {
        this.namespace = namespace;
    }

    public void setType(String type) {
        this.type = type;
    }

    public void setClusterIP(String clusterIP) {
        this.clusterIP = clusterIP;
    }
}