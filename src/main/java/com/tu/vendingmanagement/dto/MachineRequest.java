package com.tu.vendingmanagement.dto;

import com.tu.vendingmanagement.model.MachineStatus;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;

public record MachineRequest(

    @NotBlank(message = "Machine code is required")
    String code,

    @NotBlank(message = "Machine name is required")
    String name,

    @NotBlank(message = "Machine address is required")
    String address,

    @NotNull(message = "Latitude is required")
    @DecimalMin(value = "-90.0", message = "Latitude must be at least -90")
    @DecimalMax(value = "90.0", message = "Latitude must not exceed 90")
    BigDecimal latitude,

    @NotNull(message = "Longitude is required")
    @DecimalMin(value = "-180.0", message = "Longitude must be at least -180")
    @DecimalMax(value = "180.0", message = "Longitude must not exceed 180")
    BigDecimal longitude,

    @NotNull(message = "Machine status is required")
    MachineStatus status

) {}