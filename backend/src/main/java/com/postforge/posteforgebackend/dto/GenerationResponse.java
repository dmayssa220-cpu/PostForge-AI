package com.postforge.posteforgebackend.dto;

import com.postforge.posteforgebackend.entity.Generation;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

public record GenerationResponse(
        UUID id,
        String topic,
        String contentType,
        String language,
        String tone,
        String status,
        LocalDateTime scheduledDate,
        LocalDateTime publishedDate,
        Map<String, Object> rawOutput,
        Map<String, Object> editedOutput,
        LocalDateTime createdAt
) {
    public static GenerationResponse from(Generation generation) {
        return new GenerationResponse(
                generation.getId(),
                generation.getTopic(),
                generation.getContentType().name(),
                generation.getLanguage(),
                generation.getTone(),
                generation.getStatus().name(),
                generation.getScheduledDate(),
                generation.getPublishedDate(),
                generation.getRawOutput(),
                generation.getEditedOutput(),
                generation.getCreatedAt()
        );
    }
}