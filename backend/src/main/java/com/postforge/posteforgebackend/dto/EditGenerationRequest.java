package com.postforge.posteforgebackend.dto;

import java.util.Map;

public record EditGenerationRequest(
        Map<String, Object> editedOutput
) {}