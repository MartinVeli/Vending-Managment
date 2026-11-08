package com.tu.vendingmanagement.mapper;

import com.tu.vendingmanagement.dto.InventoryResponse;
import com.tu.vendingmanagement.model.InventoryItem;

import org.springframework.stereotype.Component;

@Component
public class InventoryMapper {

    public InventoryResponse toResponse(InventoryItem item) {
        int days = item.getQuantity()
                / Math.max(1, item.getAverageDailySales());

        return new InventoryResponse(
                item.getId(),
                item.getMachine().getId(),
                item.getMachine().getCode(),
                item.getProduct().getId(),
                item.getProduct().getSku(),
                item.getProduct().getName(),
                item.getQuantity(),
                item.getCapacity(),
                item.getLowStockThreshold(),
                days,
                item.getUpdatedAt(),
                item.getQuantity() <= item.getLowStockThreshold()
        );
    }
}