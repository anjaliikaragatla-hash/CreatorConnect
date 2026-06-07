package com.creatorconnect.backend.repository;

import com.creatorconnect.backend.model.CreatorProfile;
import com.creatorconnect.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CreatorProfileRepository extends JpaRepository<CreatorProfile, Long> {
    Optional<CreatorProfile> findByUser(User user);
    Optional<CreatorProfile> findByUserId(Long userId);
    List<CreatorProfile> findByCategoryId(Long categoryId);
}
