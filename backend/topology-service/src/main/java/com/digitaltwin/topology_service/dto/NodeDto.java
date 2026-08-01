package com.digitaltwin.topology_service.dto;

public class NodeDto {

    private String name;
    private String status;
    private String role;

    public NodeDto() {
    }

    public NodeDto(String name, String status, String role) {
        this.name = name;
        this.status = status;
        this.role = role;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}