package com.postforge.posteforgebackend.controller;

import com.postforge.posteforgebackend.dto.GenerationRequest;
import com.postforge.posteforgebackend.dto.GenerationResponse;
import com.postforge.posteforgebackend.dto.ScheduleRequest;
import com.postforge.posteforgebackend.service.GenerationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/generations")
@RequiredArgsConstructor
public class GenerationController {

    private final GenerationService generationService;

    @PostMapping
    public ResponseEntity<GenerationResponse> generate(@Valid @RequestBody GenerationRequest request) {
        return ResponseEntity.ok(GenerationResponse.from(generationService.generateCarousel(request)));
    }

    @GetMapping
    public ResponseEntity<List<GenerationResponse>> getHistory() {
        return ResponseEntity.ok(
                generationService.getUserGenerations().stream()
                        .map(GenerationResponse::from)
                        .toList()
        );
    }
    @PatchMapping("/{id}/schedule")
    public ResponseEntity<GenerationResponse> schedule(
            @PathVariable UUID id, @RequestBody ScheduleRequest request) {
        return ResponseEntity.ok(GenerationResponse.from(generationService.scheduleGeneration(id, request)));
    }

    @PatchMapping("/{id}/publish")
    public ResponseEntity<GenerationResponse> publish(@PathVariable UUID id) {
        return ResponseEntity.ok(GenerationResponse.from(generationService.markAsPublished(id)));
    }

    @GetMapping("/calendar")
    public ResponseEntity<List<GenerationResponse>> getCalendar(
            @RequestParam String start, @RequestParam String end) {
        LocalDateTime startDate = LocalDateTime.parse(start);
        LocalDateTime endDate = LocalDateTime.parse(end);
        return ResponseEntity.ok(
                generationService.getCalendar(startDate, endDate).stream()
                        .map(GenerationResponse::from)
                        .toList()
        );
    }
}