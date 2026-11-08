package com.tu.vendingmanagement.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "restock_tasks")
public class RestockTask {

    public enum Status {
        OPEN,
        IN_PROGRESS,
        COMPLETED,
        CANCELLED
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    private InventoryItem inventoryItem;

    @Column(nullable = false)
    private int recommendedQuantity;

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime recommendedBy;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status = Status.OPEN;

    protected RestockTask() {
    }

    public RestockTask(
            InventoryItem item,
            int qty,
            LocalDateTime by
    ) {
        inventoryItem = item;
        recommendedQuantity = qty;
        recommendedBy = by;
    }

    public Long getId() {
        return id;
    }

    public InventoryItem getInventoryItem() {
        return inventoryItem;
    }

    public int getRecommendedQuantity() {
        return recommendedQuantity;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getRecommendedBy() {
        return recommendedBy;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }
}