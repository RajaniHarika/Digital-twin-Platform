package com.digitaltwin.simulation_service.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "simulations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Simulation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String simulationName;

    @Column(nullable = false)
    private String environment;

    @Column(nullable = false)
    private String status;

    @Column(columnDefinition = "TEXT")
    private String description;

    private LocalDateTime createdAt;

    @PrePersist
    public void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}