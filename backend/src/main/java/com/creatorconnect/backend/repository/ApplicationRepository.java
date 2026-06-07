package com.creatorconnect.backend.repository;

import com.creatorconnect.backend.model.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByCreatorId(Long creatorId);
    List<Application> findByCampaignId(Long campaignId);
    List<Application> findByCampaignBrandId(Long brandId);
    Boolean existsByCampaignIdAndCreatorId(Long campaignId, Long creatorId);
}
