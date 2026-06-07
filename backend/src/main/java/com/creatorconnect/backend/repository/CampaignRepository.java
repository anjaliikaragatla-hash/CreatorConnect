package com.creatorconnect.backend.repository;

import com.creatorconnect.backend.model.Campaign;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CampaignRepository extends JpaRepository<Campaign, Long> {
    List<Campaign> findByBrandId(Long brandId);
    List<Campaign> findByCategoryId(Long categoryId);
    List<Campaign> findByStatus(String status);
}
