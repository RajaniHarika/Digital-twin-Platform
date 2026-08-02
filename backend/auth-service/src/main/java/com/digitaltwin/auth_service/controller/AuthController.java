package com.digitaltwin.auth_service.controller;

import com.digitaltwin.auth_service.dto.AuthResponse;
import com.digitaltwin.auth_service.dto.LoginRequest;
import com.digitaltwin.auth_service.dto.RegisterUserRequest;
import com.digitaltwin.auth_service.entity.User;
import com.digitaltwin.auth_service.service.UserService;
import com.digitaltwin.auth_service.repository.UserRepository;
import com.digitaltwin.auth_service.security.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtService jwtService;

    @PostMapping("/register")
    public User registerUser(@RequestBody RegisterUserRequest request) {
        return userService.registerUser(request);
    }

    @PostMapping("/login")
    public AuthResponse loginUser(
            @RequestBody LoginRequest request) {

        return userService.loginUser(request);
    }

    @GetMapping("/me")
    public User getCurrentUser(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "").trim();
        String email = jwtService.extractEmail(token);
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}