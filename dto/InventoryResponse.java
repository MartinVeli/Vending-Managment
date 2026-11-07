package com.tu.vendingmanagement.dto;
import java.time.LocalDateTime;
public record InventoryResponse(Long id, Long machineId, String machineCode, Long productId, String sku, String productName,
 int quantity, int capacity, int lowStockThreshold, int estimatedDaysRemaining, LocalDateTime updatedAt, boolean lowStock) {}
