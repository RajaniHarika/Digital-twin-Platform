package com.digitaltwin.auth_service.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RoleTestController {

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public String admin() {
        return "Admin Access Granted";
    }

    @GetMapping("/devops")
    @PreAuthorize("hasRole('DEVOPS_ENGINEER')")
    public String devops() {
        return "DevOps Engineer Access Granted";
    }

    @GetMapping("/cloud")
    @PreAuthorize("hasRole('CLOUD_ENGINEER')")
    public String cloud() {
        return "Cloud Engineer Access Granted";
    }

    @GetMapping("/backend")
    @PreAuthorize("hasRole('BACKEND_ENGINEER')")
    public String backend() {
        return "Backend Engineer Access Granted";
    }

    @GetMapping("/manager")
    @PreAuthorize("hasRole('PROJECT_MANAGER')")
    public String manager() {
        return "Project Manager Access Granted";
    }

    @GetMapping("/sre")
    @PreAuthorize("hasRole('SRE_ENGINEER')")
    public String sre() {
        return "SRE Engineer Access Granted";
    }
}