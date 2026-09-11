package com.postforge.posteforgebackend.repository;

import com.postforge.posteforgebackend.entity.Generation;
import com.postforge.posteforgebackend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public interface GenerationRepository extends JpaRepository<Generation, UUID> {

    List<Generation> findByUserOrderByCreatedAtDesc(User user);
    List<Generation> findByUserAndScheduledDateBetweenOrderByScheduledDateAsc(
            User user, LocalDateTime start, LocalDateTime end
    );
    @Query("SELECT g FROM Generation g WHERE g.user = :user " +
            "AND (:topic IS NULL OR LOWER(g.topic) LIKE LOWER(CONCAT('%', CAST(:topic AS string), '%'))) " +
            "AND (CAST(:status AS string) IS NULL OR g.status = :status) " +
            "ORDER BY g.createdAt DESC")
    List<Generation> searchByUser(
            @Param("user") User user,
            @Param("topic") String topic,
            @Param("status") Generation.Status status
    );
}