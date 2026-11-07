package com.tu.vendingmanagement.mapper;
import com.tu.vendingmanagement.dto.InventoryResponse;
import com.tu.vendingmanagement.model.InventoryItem;
import org.springframework.stereotype.Component;
@Component
public class InventoryMapper {
    public InventoryResponse toResponse(InventoryItem i) {
        int days = i.getQuantity() / Math.max(1, i.getAverageDailySales());
        return new InventoryResponse(i.getId(), i.getMachine().getId(), i.getMachine().getCode(),
          i.getProduct().getId(), i.getProduct().getSku(), i.getProduct().getName(), i.getQuantity(),
          i.getCapacity(), i.getLowStockThreshold(), days, i.getUpdatedAt(), i.getQuantity() <= i.getLowStockThreshold());
    }
}
