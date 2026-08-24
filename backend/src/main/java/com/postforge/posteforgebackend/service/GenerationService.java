package com.postforge.posteforgebackend.service;

//import com.fasterxml.jackson.databind.ObjectMapper;
import com.postforge.posteforgebackend.dto.CarouselResponse;
import com.postforge.posteforgebackend.dto.GenerationRequest;
import com.postforge.posteforgebackend.entity.Generation;
import com.postforge.posteforgebackend.entity.User;
import com.postforge.posteforgebackend.repository.GenerationRepository;
import com.postforge.posteforgebackend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import tools.jackson.databind.ObjectMapper;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class GenerationService {

    private final RestClient aiServiceRestClient;
    private final GenerationRepository generationRepository;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;

    public Generation generateCarousel(GenerationRequest request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        Map<String, String> aiPayload = Map.of(
                "topic", request.topic(),
                "language", request.language() != null ? request.language() : "fr",
                "tone", request.tone() != null ? request.tone() : "expert"
        );

        CarouselResponse aiResponse = aiServiceRestClient.post()
                .uri("/internal/v1/generate/carousel")
                .body(aiPayload)
                .retrieve()
                .body(CarouselResponse.class);

        Map<String, Object> rawOutput = objectMapper.convertValue(aiResponse, Map.class);

        Generation generation = Generation.builder()
                .user(user)
                .topic(request.topic())
                .contentType(Generation.ContentType.carousel)
                .language(request.language() != null ? request.language() : "fr")
                .tone(request.tone() != null ? request.tone() : "expert")
                .rawOutput(rawOutput)
                .build();

        return generationRepository.save(generation);
    }

    public List<Generation> getUserGenerations() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        return generationRepository.findByUserOrderByCreatedAtDesc(user);
    }
}