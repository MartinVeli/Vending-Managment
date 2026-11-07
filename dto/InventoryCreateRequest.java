package com.tu.vendingmanagement.dto;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
public record InventoryCreateRequest(@NotNull Long machineId, @NotNull Long productId, @Min(0) int quantity,
 @Min(1) int capacity, @Min(0) int lowStockThreshold, @Min(1) int averageDailySales) {}
