package com.postforge.posteforgebackend.dto;

import jakarta.validation.constraints.NotBlank;

public record GenerationRequest(
        @NotBlank String topic,
        String language,
        String tone
) {}