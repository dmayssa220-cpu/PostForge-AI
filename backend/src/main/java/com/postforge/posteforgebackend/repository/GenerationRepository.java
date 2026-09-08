package com.postforge.posteforgebackend.repository;

import com.postforge.posteforgebackend.entity.Generation;
import com.postforge.posteforgebackend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public interface GenerationRepository extends JpaRepository<Generation, UUID> {

    List<Generation> findByUserOrderByCreatedAtDesc(User user);
    List<Generation> findByUserAndScheduledDateBetweenOrderByScheduledDateAsc(
            User user, LocalDateTime start, LocalDateTime end
    );
}