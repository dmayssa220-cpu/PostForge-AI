package com.postforge.posteforgebackend.controller;

import com.postforge.posteforgebackend.service.AudioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/audio")
@RequiredArgsConstructor
public class AudioController {

    private final AudioService audioService;

    @PostMapping(value = "/transcribe", consumes = "multipart/form-data")
    public ResponseEntity<Map<String, String>> transcribe(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "language", defaultValue = "fr") String language) {
        return ResponseEntity.ok(audioService.transcribe(file, language));
    }
}