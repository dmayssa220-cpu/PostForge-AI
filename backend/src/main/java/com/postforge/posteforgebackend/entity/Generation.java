package com.postforge.posteforgebackend.entity;

import io.hypersistence.utils.hibernate.type.json.JsonType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Type;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

@Entity
@Table(name = "generations")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Generation {

    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 500)
    private String topic;

    @Enumerated(EnumType.STRING)
    @Column(name = "content_type", nullable = false)
    private ContentType contentType;

    @Column(nullable = false, length = 2)
    private String language;

    @Column(nullable = false, length = 50)
    private String tone;

    // NOTE: nécessite la dépendance hypersistence-utils pour mapper JSONB proprement.
    @Type(JsonType.class)
    @Column(name = "raw_output", columnDefinition = "jsonb")
    private Map<String, Object> rawOutput;

    @Type(JsonType.class)
    @Column(name = "edited_output", columnDefinition = "jsonb")
    private Map<String, Object> editedOutput;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    public enum ContentType {
        carousel, post, poll
    }
}
