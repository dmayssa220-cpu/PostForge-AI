package com.postforge.posteforgebackend.dto;

import java.time.LocalDateTime;

public record ScheduleRequest(
        LocalDateTime scheduledDate
) {}