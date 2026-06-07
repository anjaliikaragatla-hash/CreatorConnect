package com.creatorconnect.backend.repository;

import com.creatorconnect.backend.model.BrandProfile;
import com.creatorconnect.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BrandProfileRepository extends JpaRepository<BrandProfile, Long> {
    Optional<BrandProfile> findByUser(User user);
    Optional<BrandProfile> findByUserId(Long userId);
}
