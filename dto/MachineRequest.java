package com.tu.vendingmanagement.dto;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
public record MachineRequest(@NotBlank String code, @NotBlank String name, @NotBlank String address,
 @NotNull @DecimalMin("-90.0") @DecimalMax("90.0") BigDecimal latitude,
 @NotNull @DecimalMin("-180.0") @DecimalMax("180.0") BigDecimal longitude) {}
