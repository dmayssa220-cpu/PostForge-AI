package com.postforge.posteforgebackend.dto;

import tools.jackson.databind.PropertyNamingStrategies;
import tools.jackson.databind.annotation.JsonNaming;

import java.util.List;

@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public record AiTranslateRequest(
        List<AiSlide> slides,
        String ctaSlide,
        List<String> suggestedHashtags,
        String targetLanguage
) {
    @JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
    public record AiSlide(int slideNumber, String title, String content) {}
}