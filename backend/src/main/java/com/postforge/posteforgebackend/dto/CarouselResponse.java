package com.postforge.posteforgebackend.dto;

import tools.jackson.databind.PropertyNamingStrategies;
import tools.jackson.databind.annotation.JsonNaming;

import java.util.List;

@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public record CarouselResponse(
        List<Slide> slides,
        String ctaSlide,
        List<String> suggestedHashtags
) {
    public record Slide(int slideNumber, String title, String content) {}
}