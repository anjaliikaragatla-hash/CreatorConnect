package com.creatorconnect.backend.controller;

import com.creatorconnect.backend.dto.AuthResponse;
import com.creatorconnect.backend.dto.LoginRequest;
import com.creatorconnect.backend.dto.RegisterRequest;
import com.creatorconnect.backend.model.*;
import com.creatorconnect.backend.repository.BrandProfileRepository;
import com.creatorconnect.backend.repository.CreatorProfileRepository;
import com.creatorconnect.backend.repository.UserRepository;
import com.creatorconnect.backend.security.JwtUtils;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CreatorProfileRepository creatorProfileRepository;

    @Autowired
    private BrandProfileRepository brandProfileRepository;

    @Autowired
    private PasswordEncoder encoder;

    @Autowired
    private JwtUtils jwtUtils;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.username(), loginRequest.password()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        User userDetails = (User) authentication.getPrincipal();

        return ResponseEntity.ok(new AuthResponse(
                jwt,
                userDetails.getId(),
                userDetails.getUsername(),
                userDetails.getEmail(),
                userDetails.getRole().name()
        ));
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest signUpRequest) {
        if (userRepository.existsByUsername(signUpRequest.username())) {
            return ResponseEntity.badRequest().body("Error: Username is already taken!");
        }

        if (userRepository.existsByEmail(signUpRequest.email())) {
            return ResponseEntity.badRequest().body("Error: Email is already in use!");
        }

        Role role;
        try {
            role = Role.valueOf(signUpRequest.role().toUpperCase());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Error: Invalid role. Must be CREATOR or BRAND.");
        }

        // Create new user's account
        User user = new User(
                signUpRequest.username(),
                signUpRequest.email(),
                encoder.encode(signUpRequest.password()),
                role
        );

        userRepository.save(user);

        // Auto-create profile based on role
        if (role == Role.CREATOR) {
            CreatorProfile creatorProfile = new CreatorProfile(user);
            creatorProfileRepository.save(creatorProfile);
        } else if (role == Role.BRAND) {
            BrandProfile brandProfile = new BrandProfile(user);
            brandProfileRepository.save(brandProfile);
        }

        return ResponseEntity.ok("User registered successfully!");
    }
}
