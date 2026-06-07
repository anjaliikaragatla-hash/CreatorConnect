package com.creatorconnect.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ApplicationRequest(
    @NotNull Long campaignId,
    @NotBlank String proposalMessage
) {}
