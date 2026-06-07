package com.creatorconnect.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public record CampaignRequest(
    @NotBlank String title,
    @NotBlank String description,
    @NotNull Long categoryId,
    @NotNull Long minFollowers,
    @NotBlank String budgetRange,
    @NotBlank String deliverables,
    @NotNull LocalDate deadline,
    String status
) {}
