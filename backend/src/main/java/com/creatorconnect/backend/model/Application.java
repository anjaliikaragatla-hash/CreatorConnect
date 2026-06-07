package com.creatorconnect.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

@Entity
@Table(name = "applications")
public class Application {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "campaign_id", nullable = false)
    private Campaign campaign;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "creator_id", nullable = false)
    private CreatorProfile creator;

    @NotBlank
    @Column(name = "proposal_message", columnDefinition = "TEXT", nullable = false)
    private String proposalMessage;

    @NotNull
    @Column(name = "application_date", nullable = false)
    private LocalDate applicationDate = LocalDate.now();

    @NotBlank
    @Column(nullable = false)
    private String status = "PENDING"; // PENDING, SHORTLISTED, ACCEPTED, REJECTED

    public Application() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Campaign getCampaign() {
        return campaign;
    }

    public void setCampaign(Campaign campaign) {
        this.campaign = campaign;
    }

    public CreatorProfile getCreator() {
        return creator;
    }

    public void setCreator(CreatorProfile creator) {
        this.creator = creator;
    }

    public String getProposalMessage() {
        return proposalMessage;
    }

    public void setProposalMessage(String proposalMessage) {
        this.proposalMessage = proposalMessage;
    }

    public LocalDate getApplicationDate() {
        return applicationDate;
    }

    public void setApplicationDate(LocalDate applicationDate) {
        this.applicationDate = applicationDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
