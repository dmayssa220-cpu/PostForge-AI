package com.postforge.posteforgebackend.controller;

import com.postforge.posteforgebackend.dto.GenerationRequest;
import com.postforge.posteforgebackend.dto.GenerationResponse;
import com.postforge.posteforgebackend.service.GenerationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
}