package com.tu.vendingmanagement.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;
import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "products")
public class Product {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @NotBlank @Column(nullable = false, unique = true) private String sku;
    @NotBlank @Column(nullable = false) private String name;
    @PositiveOrZero @Column(nullable = false, precision = 10, scale = 2) private BigDecimal price;
    @ManyToMany
    @JoinTable(name = "product_categories", joinColumns = @JoinColumn(name = "product_id"), inverseJoinColumns = @JoinColumn(name = "category_id"))
    private Set<Category> categories = new HashSet<>();
    protected Product() {}
    public Product(String sku, String name, BigDecimal price) { this.sku=sku; this.name=name; this.price=price; }
    public Long getId(){return id;} public String getSku(){return sku;} public String getName(){return name;}
    public BigDecimal getPrice(){return price;} public Set<Category> getCategories(){return categories;}
    public void setSku(String sku){this.sku=sku;} public void setName(String name){this.name=name;}
    public void setPrice(BigDecimal price){this.price=price;} public void setCategories(Set<Category> categories){this.categories=categories;}
}
