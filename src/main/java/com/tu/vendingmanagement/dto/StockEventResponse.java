package com.tu.vendingmanagement.dto;

import java.time.LocalDateTime;

public record StockEventResponse(
        Long id,
        Long inventoryItemId,
        String productName,
        String type,
        int quantityChange,
        String note,
        LocalDateTime createdAt
) {
}