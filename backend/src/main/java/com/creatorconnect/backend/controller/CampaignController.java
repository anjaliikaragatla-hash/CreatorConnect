package com.creatorconnect.backend.controller;

import com.creatorconnect.backend.dto.CampaignRequest;
import com.creatorconnect.backend.model.*;
import com.creatorconnect.backend.repository.BrandProfileRepository;
import com.creatorconnect.backend.repository.CampaignRepository;
import com.creatorconnect.backend.repository.CategoryRepository;
import com.creatorconnect.backend.repository.UserRepository;
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
@RequestMapping("/api/campaigns")
public class CampaignController {

    @Autowired
    private CampaignRepository campaignRepository;

    @Autowired
    private BrandProfileRepository brandProfileRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private UserRepository userRepository;

    private User getAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Current authenticated user not found"));
    }

    private BrandProfile getAuthenticatedBrand() {
        User user = getAuthenticatedUser();
        return brandProfileRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Brand profile not found for the user"));
    }

    @PostMapping
    @PreAuthorize("hasRole('BRAND')")
    public ResponseEntity<?> createCampaign(@Valid @RequestBody CampaignRequest request) {
        BrandProfile brand = getAuthenticatedBrand();

        Category category = categoryRepository.findById(request.categoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        Campaign campaign = new Campaign();
        campaign.setBrand(brand);
        campaign.setTitle(request.title());
        campaign.setDescription(request.description());
        campaign.setCategory(category);
        campaign.setMinFollowers(request.minFollowers());
        campaign.setBudgetRange(request.budgetRange());
        campaign.setDeliverables(request.deliverables());
        campaign.setDeadline(request.deadline());
        if (request.status() != null) {
            campaign.setStatus(request.status().toUpperCase());
        }

        campaignRepository.save(campaign);
        return ResponseEntity.ok(campaign);
    }

    @GetMapping
    public ResponseEntity<List<Campaign>> getAllCampaigns() {
        return ResponseEntity.ok(campaignRepository.findAll());
    }

    @GetMapping("/open")
    public ResponseEntity<List<Campaign>> getOpenCampaigns() {
        return ResponseEntity.ok(campaignRepository.findByStatus("OPEN"));
    }

    @GetMapping("/brand")
    @PreAuthorize("hasRole('BRAND')")
    public ResponseEntity<List<Campaign>> getBrandCampaigns() {
        BrandProfile brand = getAuthenticatedBrand();
        return ResponseEntity.ok(campaignRepository.findByBrandId(brand.getId()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getCampaignById(@PathVariable Long id) {
        Campaign campaign = campaignRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Campaign not found with ID: " + id));
        return ResponseEntity.ok(campaign);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('BRAND')")
    public ResponseEntity<?> updateCampaign(@PathVariable Long id, @Valid @RequestBody CampaignRequest request) {
        Campaign campaign = campaignRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Campaign not found"));

        BrandProfile brand = getAuthenticatedBrand();
        if (!campaign.getBrand().getId().equals(brand.getId())) {
            return ResponseEntity.status(403).body("Error: You are not authorized to edit this campaign.");
        }

        Category category = categoryRepository.findById(request.categoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        campaign.setTitle(request.title());
        campaign.setDescription(request.description());
        campaign.setCategory(category);
        campaign.setMinFollowers(request.minFollowers());
        campaign.setBudgetRange(request.budgetRange());
        campaign.setDeliverables(request.deliverables());
        campaign.setDeadline(request.deadline());
        if (request.status() != null) {
            campaign.setStatus(request.status().toUpperCase());
        }

        campaignRepository.save(campaign);
        return ResponseEntity.ok(campaign);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('BRAND')")
    public ResponseEntity<?> deleteCampaign(@PathVariable Long id) {
        Campaign campaign = campaignRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Campaign not found"));

        BrandProfile brand = getAuthenticatedBrand();
        if (!campaign.getBrand().getId().equals(brand.getId())) {
            return ResponseEntity.status(403).body("Error: You are not authorized to delete this campaign.");
        }

        campaignRepository.delete(campaign);
        return ResponseEntity.ok("Campaign deleted successfully!");
    }
}
