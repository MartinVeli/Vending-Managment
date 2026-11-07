package com.tu.vendingmanagement.dto;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
public record ProductRequest(@NotBlank String sku, @NotBlank String name, @NotNull @PositiveOrZero BigDecimal price) {}
