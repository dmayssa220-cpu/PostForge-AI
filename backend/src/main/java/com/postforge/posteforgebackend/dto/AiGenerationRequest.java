package com.postforge.posteforgebackend.dto;

public record AiGenerationRequest(
        String topic,
        String language,
        String tone
) {}