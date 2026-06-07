package com.creatorconnect.backend.dto;

public record CreatorProfileUpdateRequest(
    String bio,
    String profilePicture,
    String instagramLink,
    String youtubeLink,
    String pinterestLink,
    String linkedinLink,
    Long categoryId,
    Long followerCount,
    Double engagementRate,
    String collaborations
) {}
