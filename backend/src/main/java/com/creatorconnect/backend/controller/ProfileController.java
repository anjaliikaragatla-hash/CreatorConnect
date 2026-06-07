package com.creatorconnect.backend.controller;

import com.creatorconnect.backend.dto.BrandProfileUpdateRequest;
import com.creatorconnect.backend.dto.CreatorProfileUpdateRequest;
import com.creatorconnect.backend.model.*;
import com.creatorconnect.backend.repository.BrandProfileRepository;
import com.creatorconnect.backend.repository.CategoryRepository;
import com.creatorconnect.backend.repository.CreatorProfileRepository;
import com.creatorconnect.backend.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/profiles")
public class ProfileController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CreatorProfileRepository creatorProfileRepository;

    @Autowired
    private BrandProfileRepository brandProfileRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    private User getAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Current authenticated user not found"));
    }

    @GetMapping("/creator")
    public ResponseEntity<?> getCreatorProfile() {
        User user = getAuthenticatedUser();
        CreatorProfile profile = creatorProfileRepository.findByUser(user)
                .orElseGet(() -> {
                    CreatorProfile newProfile = new CreatorProfile(user);
                    return creatorProfileRepository.save(newProfile);
                });
        return ResponseEntity.ok(profile);
    }

    @PutMapping("/creator")
    public ResponseEntity<?> updateCreatorProfile(@Valid @RequestBody CreatorProfileUpdateRequest request) {
        User user = getAuthenticatedUser();
        CreatorProfile profile = creatorProfileRepository.findByUser(user)
                .orElseGet(() -> new CreatorProfile(user));

        profile.setBio(request.bio());
        profile.setProfilePicture(request.profilePicture());
        profile.setInstagramLink(request.instagramLink());
        profile.setYoutubeLink(request.youtubeLink());
        profile.setPinterestLink(request.pinterestLink());
        profile.setLinkedinLink(request.linkedinLink());
        profile.setFollowerCount(request.followerCount());
        profile.setEngagementRate(request.engagementRate());
        profile.setCollaborations(request.collaborations());

        if (request.categoryId() != null) {
            Category category = categoryRepository.findById(request.categoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found"));
            profile.setCategory(category);
        } else {
            profile.setCategory(null);
        }

        creatorProfileRepository.save(profile);
        return ResponseEntity.ok(profile);
    }

    @GetMapping("/brand")
    public ResponseEntity<?> getBrandProfile() {
        User user = getAuthenticatedUser();
        BrandProfile profile = brandProfileRepository.findByUser(user)
                .orElseGet(() -> {
                    BrandProfile newProfile = new BrandProfile(user);
                    return brandProfileRepository.save(newProfile);
                });
        return ResponseEntity.ok(profile);
    }

    @PutMapping("/brand")
    public ResponseEntity<?> updateBrandProfile(@Valid @RequestBody BrandProfileUpdateRequest request) {
        User user = getAuthenticatedUser();
        BrandProfile profile = brandProfileRepository.findByUser(user)
                .orElseGet(() -> new BrandProfile(user));

        profile.setCompanyName(request.companyName());
        profile.setLogo(request.logo());
        profile.setDescription(request.description());
        profile.setIndustry(request.industry());
        profile.setWebsite(request.website());

        brandProfileRepository.save(profile);
        return ResponseEntity.ok(profile);
    }

    @GetMapping("/creators")
    public ResponseEntity<List<CreatorProfile>> getAllCreatorProfiles() {
        return ResponseEntity.ok(creatorProfileRepository.findAll());
    }

    @GetMapping("/creator/{id}")
    public ResponseEntity<?> getCreatorProfileById(@PathVariable Long id) {
        CreatorProfile profile = creatorProfileRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Creator profile not found"));
        return ResponseEntity.ok(profile);
    }

    @GetMapping("/brand/{id}")
    public ResponseEntity<?> getBrandProfileById(@PathVariable Long id) {
        BrandProfile profile = brandProfileRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Brand profile not found"));
        return ResponseEntity.ok(profile);
    }
}
