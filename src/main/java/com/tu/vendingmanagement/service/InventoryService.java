package com.tu.vendingmanagement.service;

import com.tu.vendingmanagement.dto.*;
import com.tu.vendingmanagement.exception.*;
import com.tu.vendingmanagement.mapper.InventoryMapper;
import com.tu.vendingmanagement.model.*;
import com.tu.vendingmanagement.repository.*;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class InventoryService {

    private final InventoryRepository inventoryRepo;
    private final MachineRepository machineRepo;
    private final ProductRepository productRepo;
    private final RestockTaskRepository taskRepo;
    private final StockEventRepository eventRepo;
    private final InventoryMapper mapper;

    public InventoryService(
            InventoryRepository i,
            MachineRepository m,
            ProductRepository p,
            RestockTaskRepository t,
            StockEventRepository e,
            InventoryMapper mapper
    ) {
        this.inventoryRepo = i;
        this.machineRepo = m;
        this.productRepo = p;
        this.taskRepo = t;
        this.eventRepo = e;
        this.mapper = mapper;
    }

    @Transactional
    public InventoryResponse create(InventoryCreateRequest r) {
        if (r.quantity() > r.capacity()) {
            throw new BadRequestException("Quantity cannot exceed capacity");
        }

        VendingMachine machine = machineRepo.findById(r.machineId())
                .orElseThrow(() -> new NotFoundException("Machine not found"));

        Product product = productRepo.findById(r.productId())
                .orElseThrow(() -> new NotFoundException("Product not found"));

        if (inventoryRepo.existsByMachineIdAndProductId(
                r.machineId(),
                r.productId()
        )) {
            throw new BadRequestException(
                    "Product already has an inventory slot in this machine"
            );
        }

        InventoryItem item = new InventoryItem(
                machine,
                product,
                r.quantity(),
                r.capacity(),
                r.lowStockThreshold(),
                r.averageDailySales()
        );

        return mapper.toResponse(inventoryRepo.save(item));
    }

    @Transactional(readOnly = true)
    public List<InventoryResponse> byMachine(Long machineId) {
        if (!machineRepo.existsById(machineId)) {
            throw new NotFoundException("Machine not found");
        }

        return inventoryRepo.findByMachine(machineId)
                .stream()
                .map(mapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<InventoryResponse> lowStock() {
        return inventoryRepo.findLowStock()
                .stream()
                .map(mapper::toResponse)
                .toList();
    }

    @Transactional
    public InventoryResponse sell(Long inventoryId, int quantity) {
        InventoryItem item = inventoryRepo.findByIdForUpdate(inventoryId)
                .orElseThrow(() ->
                        new NotFoundException("Inventory item not found")
                );

        if (quantity < 1) {
            throw new BadRequestException("Quantity must be at least 1");
        }

        if (item.getQuantity() < quantity) {
            throw new BadRequestException(
                    "Insufficient stock; available: " + item.getQuantity()
            );
        }

        item.setQuantity(item.getQuantity() - quantity);

        inventoryRepo.save(item);

        eventRepo.save(new StockEvent(
                item,
                StockEvent.Type.SALE,
                -quantity,
                "Sale recorded"
        ));

        createRestockTaskIfNeeded(item);

        return mapper.toResponse(item);
    }

    @Transactional
    public InventoryResponse restock(
            Long inventoryId,
            RestockRequest request
    ) {
        InventoryItem item = inventoryRepo.findByIdForUpdate(inventoryId)
                .orElseThrow(() ->
                        new NotFoundException("Inventory item not found")
                );

        if (request.quantity() < 1) {
            throw new BadRequestException(
                    "Restock quantity must be at least 1"
            );
        }

        if (item.getQuantity() + request.quantity() > item.getCapacity()) {
            throw new BadRequestException(
                    "Restock exceeds slot capacity"
            );
        }

        item.setQuantity(item.getQuantity() + request.quantity());

        inventoryRepo.save(item);

        eventRepo.save(new StockEvent(
                item,
                StockEvent.Type.RESTOCK,
                request.quantity(),
                request.note()
        ));

        taskRepo.findByStatusOrderByRecommendedByAsc(
                RestockTask.Status.OPEN
        )
                .stream()
                .filter(task ->
                        task.getInventoryItem().getId().equals(item.getId())
                )
                .forEach(task ->
                        task.setStatus(RestockTask.Status.COMPLETED)
                );

        return mapper.toResponse(item);
    }

    @Transactional(readOnly = true)
public List<StockEventResponse> stockEventsByMachine(Long machineId) {

    if (!machineRepo.existsById(machineId)) {
        throw new NotFoundException("Machine not found");
    }

    return eventRepo.findByMachineId(machineId)
            .stream()
            .map(event -> new StockEventResponse(
                    event.getId(),
                    event.getInventoryItem().getId(),
                    event.getInventoryItem().getProduct().getName(),
                    event.getType().name(),
                    event.getQuantityChange(),
                    event.getNote(),
                    event.getCreatedAt()
            ))
            .toList();
}

    private void createRestockTaskIfNeeded(InventoryItem item) {
        if (item.getQuantity() <= item.getLowStockThreshold()
                && !taskRepo.existsByInventoryItemIdAndStatus(
                        item.getId(),
                        RestockTask.Status.OPEN
                )) {

            int recommended = Math.max(
                    0,
                    item.getCapacity() - item.getQuantity()
            );

            int days = item.getQuantity()
                    / Math.max(1, item.getAverageDailySales());

            taskRepo.save(new RestockTask(
                    item,
                    recommended,
                    LocalDateTime.now().plusDays(days)
            ));
        }
    }
}