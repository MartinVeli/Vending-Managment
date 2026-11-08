package com.tu.vendingmanagement.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "inventory_items",
        uniqueConstraints = @UniqueConstraint(
                columnNames = {"machine_id", "product_id"}
        )
)
public class InventoryItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "machine_id")
    private VendingMachine machine;

    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    @JoinColumn(name = "product_id")
    private Product product;

    @Min(0)
    @Column(nullable = false)
    private int quantity;

    @Min(0)
    @Column(nullable = false)
    private int capacity;

    @Min(0)
    @Column(nullable = false)
    private int lowStockThreshold;

    @Column(nullable = false)
    private int averageDailySales = 1;

    private LocalDateTime updatedAt = LocalDateTime.now();

    @Version
    private Long version;

    protected InventoryItem() {
    }

    public InventoryItem(
            VendingMachine machine,
            Product product,
            int quantity,
            int capacity,
            int lowStockThreshold,
            int averageDailySales
    ) {
        this.machine = machine;
        this.product = product;
        this.quantity = quantity;
        this.capacity = capacity;
        this.lowStockThreshold = lowStockThreshold;
        this.averageDailySales = Math.max(1, averageDailySales);
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    void touch() {
        updatedAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public VendingMachine getMachine() {
        return machine;
    }

    public Product getProduct() {
        return product;
    }

    public int getQuantity() {
        return quantity;
    }

    public int getCapacity() {
        return capacity;
    }

    public int getLowStockThreshold() {
        return lowStockThreshold;
    }

    public int getAverageDailySales() {
        return averageDailySales;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public void setCapacity(int capacity) {
        this.capacity = capacity;
    }

    public void setLowStockThreshold(int lowStockThreshold) {
        this.lowStockThreshold = lowStockThreshold;
    }

    public void setAverageDailySales(int averageDailySales) {
        this.averageDailySales = Math.max(1, averageDailySales);
    }
}