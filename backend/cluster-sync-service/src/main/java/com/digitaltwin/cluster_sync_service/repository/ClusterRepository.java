package com.digitaltwin.cluster_sync_service.repository;

import com.digitaltwin.cluster_sync_service.entity.Cluster;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ClusterRepository extends JpaRepository<Cluster, Long> {

    Optional<Cluster> findByClusterName(String clusterName);

    Optional<Cluster> findByApiServerUrl(String apiServerUrl);

    boolean existsByClusterName(String clusterName);

    boolean existsByApiServerUrl(String apiServerUrl);
}