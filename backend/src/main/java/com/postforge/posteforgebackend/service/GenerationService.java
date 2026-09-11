package com.postforge.posteforgebackend.service;

import com.postforge.posteforgebackend.dto.CarouselResponse;
import com.postforge.posteforgebackend.dto.EditGenerationRequest;
import com.postforge.posteforgebackend.dto.GenerationRequest;
import com.postforge.posteforgebackend.dto.ScheduleRequest;
import com.postforge.posteforgebackend.entity.Generation;
import com.postforge.posteforgebackend.entity.User;
import com.postforge.posteforgebackend.repository.GenerationRepository;
import com.postforge.posteforgebackend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import tools.jackson.databind.ObjectMapper;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Slf4j
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

        String jsonBody = objectMapper.writeValueAsString(aiPayload);
        log.info("Payload envoyé à ai-service: {}", jsonBody);

        CarouselResponse aiResponse = aiServiceRestClient.post()
                .uri("/internal/v1/generate/carousel")
                .contentType(MediaType.APPLICATION_JSON)
                .body(jsonBody)
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
    public Generation scheduleGeneration(UUID id, ScheduleRequest request) {
        Generation generation = getOwnedGeneration(id);
        generation.setScheduledDate(request.scheduledDate());
        generation.setStatus(Generation.Status.scheduled);
        return generationRepository.save(generation);
    }

    public Generation markAsPublished(UUID id) {
        Generation generation = getOwnedGeneration(id);
        generation.setStatus(Generation.Status.published);
        generation.setPublishedDate(java.time.LocalDateTime.now());
        return generationRepository.save(generation);
    }

    public List<Generation> getCalendar(LocalDateTime start, LocalDateTime end) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));
        return generationRepository.findByUserAndScheduledDateBetweenOrderByScheduledDateAsc(user, start, end);
    }

    private Generation getOwnedGeneration(UUID id) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Generation generation = generationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Génération introuvable"));
        if (!generation.getUser().getEmail().equals(email)) {
            throw new RuntimeException("Accès refusé.");
        }
        return generation;
    }
    public void deleteGeneration(UUID id) {
        Generation generation = getOwnedGeneration(id);
        generationRepository.delete(generation);
    }
    public Generation updateEditedOutput(UUID id, EditGenerationRequest request) {
        Generation generation = getOwnedGeneration(id);
        generation.setEditedOutput(request.editedOutput());
        return generationRepository.save(generation);
    }
    public List<Generation> searchGenerations(String topic, String status) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        Generation.Status statusEnum = (status != null && !status.isBlank())
                ? Generation.Status.valueOf(status) : null;

        return generationRepository.searchByUser(user, (topic != null && !topic.isBlank()) ? topic : null, statusEnum);
    }
}