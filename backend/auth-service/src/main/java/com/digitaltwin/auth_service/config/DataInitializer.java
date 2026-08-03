package com.digitaltwin.auth_service.config;

import com.digitaltwin.auth_service.entity.Role;
import com.digitaltwin.auth_service.entity.User;
import com.digitaltwin.auth_service.repository.UserRepository;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.event.EventListener;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Configuration
public class DataInitializer {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @EventListener(ApplicationReadyEvent.class)
    @Transactional
    public void initUsers() {
        List<UserSeed> seeds = Arrays.asList(
                new UserSeed("admin@digitaltwin.com", "admin123", "Admin User", Role.ADMIN),
                new UserSeed("devops@digitaltwin.com", "devops123", "DevOps Engineer User", Role.DEVOPS_ENGINEER),
                new UserSeed("cloud@digitaltwin.com", "cloud123", "Cloud Engineer User", Role.CLOUD_ENGINEER),
                new UserSeed("backend@digitaltwin.com", "backend123", "Backend Engineer User", Role.BACKEND_ENGINEER),
                new UserSeed("pm@digitaltwin.com", "manager123", "Project Manager User", Role.PROJECT_MANAGER),
                new UserSeed("sre@digitaltwin.com", "sre123", "SRE Engineer User", Role.SRE_ENGINEER)
        );

        for (UserSeed seed : seeds) {
            User user = userRepository.findByEmail(seed.email).orElse(new User());
            user.setEmail(seed.email);
            user.setPassword(passwordEncoder.encode(seed.password));
            if (user.getId() == null) {
                user.setName(seed.name);
                user.setRole(seed.role);
                user.setCreatedAt(LocalDateTime.now());
            }
            userRepository.save(user);
        }
    }

    private static class UserSeed {
        String email;
        String password;
        String name;
        Role role;

        UserSeed(String email, String password, String name, Role role) {
            this.email = email;
            this.password = password;
            this.name = name;
            this.role = role;
        }
    }
}
