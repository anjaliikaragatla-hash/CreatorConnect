package com.creatorconnect.backend.controller;

import com.creatorconnect.backend.dto.ApplicationRequest;
import com.creatorconnect.backend.dto.StatusUpdateRequest;
import com.creatorconnect.backend.model.*;
import com.creatorconnect.backend.repository.*;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private CampaignRepository campaignRepository;

    @Autowired
    private CreatorProfileRepository creatorProfileRepository;

    @Autowired
    private BrandProfileRepository brandProfileRepository;

    @Autowired
    private UserRepository userRepository;

    private User getAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Current authenticated user not found"));
    }

    private CreatorProfile getAuthenticatedCreator() {
        User user = getAuthenticatedUser();
        return creatorProfileRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Creator profile not found for the user"));
    }

    private BrandProfile getAuthenticatedBrand() {
        User user = getAuthenticatedUser();
        return brandProfileRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Brand profile not found for the user"));
    }

    @PostMapping
    @PreAuthorize("hasRole('CREATOR')")
    public ResponseEntity<?> applyToCampaign(@Valid @RequestBody ApplicationRequest request) {
        CreatorProfile creator = getAuthenticatedCreator();

        Campaign campaign = campaignRepository.findById(request.campaignId())
                .orElseThrow(() -> new RuntimeException("Campaign not found with ID: " + request.campaignId()));

        if (!campaign.getStatus().equals("OPEN")) {
            return ResponseEntity.badRequest().body("Error: This campaign is closed for applications.");
        }

        if (applicationRepository.existsByCampaignIdAndCreatorId(campaign.getId(), creator.getId())) {
            return ResponseEntity.badRequest().body("Error: You have already applied for this campaign.");
        }

        // Validate follower count requirement
        if (creator.getFollowerCount() < campaign.getMinFollowers()) {
            return ResponseEntity.badRequest().body("Error: You do not meet the minimum follower requirement of " + campaign.getMinFollowers() + " for this campaign.");
        }

        Application application = new Application();
        application.setCampaign(campaign);
        application.setCreator(creator);
        application.setProposalMessage(request.proposalMessage());

        applicationRepository.save(application);
        return ResponseEntity.ok(application);
    }

    @GetMapping("/creator")
    @PreAuthorize("hasRole('CREATOR')")
    public ResponseEntity<List<Application>> getCreatorApplications() {
        CreatorProfile creator = getAuthenticatedCreator();
        return ResponseEntity.ok(applicationRepository.findByCreatorId(creator.getId()));
    }

    @GetMapping("/brand")
    @PreAuthorize("hasRole('BRAND')")
    public ResponseEntity<List<Application>> getBrandApplications() {
        BrandProfile brand = getAuthenticatedBrand();
        return ResponseEntity.ok(applicationRepository.findByCampaignBrandId(brand.getId()));
    }

    @GetMapping("/campaign/{campaignId}")
    @PreAuthorize("hasRole('BRAND')")
    public ResponseEntity<?> getApplicationsByCampaign(@PathVariable Long campaignId) {
        Campaign campaign = campaignRepository.findById(campaignId)
                .orElseThrow(() -> new RuntimeException("Campaign not found"));

        BrandProfile brand = getAuthenticatedBrand();
        if (!campaign.getBrand().getId().equals(brand.getId())) {
            return ResponseEntity.status(403).body("Error: You are not authorized to view applications for this campaign.");
        }

        return ResponseEntity.ok(applicationRepository.findByCampaignId(campaignId));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('BRAND')")
    public ResponseEntity<?> updateApplicationStatus(@PathVariable Long id, @Valid @RequestBody StatusUpdateRequest request) {
        Application application = applicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        BrandProfile brand = getAuthenticatedBrand();
        if (!application.getCampaign().getBrand().getId().equals(brand.getId())) {
            return ResponseEntity.status(403).body("Error: You are not authorized to update applications for this campaign.");
        }

        String status = request.status().toUpperCase();
        if (!status.equals("PENDING") && !status.equals("SHORTLISTED") && !status.equals("ACCEPTED") && !status.equals("REJECTED")) {
            return ResponseEntity.badRequest().body("Error: Invalid application status. Use PENDING, SHORTLISTED, ACCEPTED, or REJECTED.");
        }

        application.setStatus(status);
        applicationRepository.save(application);

        return ResponseEntity.ok(application);
    }
}
