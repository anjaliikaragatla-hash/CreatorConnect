package com.creatorconnect.backend.dto;

import jakarta.validation.constraints.NotBlank;

public record BrandProfileUpdateRequest(
    @NotBlank String companyName,
    String logo,
    String description,
    String industry,
    String website
) {}
