package com.digitaltwin.auth_service.controller;

import com.digitaltwin.auth_service.dto.AuthResponse;
import com.digitaltwin.auth_service.dto.LoginRequest;
import com.digitaltwin.auth_service.dto.RegisterUserRequest;
import com.digitaltwin.auth_service.entity.User;
import com.digitaltwin.auth_service.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public User registerUser(@RequestBody RegisterUserRequest request) {
        return userService.registerUser(request);
    }

    @PostMapping("/login")
    public AuthResponse loginUser(
            @RequestBody LoginRequest request) {

        return userService.loginUser(request);
    }
}