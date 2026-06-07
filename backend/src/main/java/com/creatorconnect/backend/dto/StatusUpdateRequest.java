package com.creatorconnect.backend.dto;

import jakarta.validation.constraints.NotBlank;

public record StatusUpdateRequest(
    @NotBlank String status // PENDING, SHORTLISTED, ACCEPTED, REJECTED
) {}
