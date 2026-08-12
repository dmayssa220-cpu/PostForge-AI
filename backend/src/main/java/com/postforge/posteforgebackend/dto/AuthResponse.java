package com.postforge.posteforgebackend.dto;

public record AuthResponse(
        String token,
        String email,
        String fullName
) {}
