package com.tu.vendingmanagement.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "stock_events")
public class StockEvent {

    public enum Type {
        SALE,
        RESTOCK,
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    private InventoryItem inventoryItem;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Type type;

    @Column(nullable = false)
    private int quantityChange;

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    private String note;

    protected StockEvent() {
    }

    public StockEvent(
            InventoryItem item,
            Type type,
            int change,
            String note
    ) {
        this.inventoryItem = item;
        this.type = type;
        this.quantityChange = change;
        this.note = note;
    }

    public Long getId() {
        return id;
    }

    public InventoryItem getInventoryItem() {
        return inventoryItem;
    }

    public Type getType() {
        return type;
    }

    public int getQuantityChange() {
        return quantityChange;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public String getNote() {
        return note;
    }
}