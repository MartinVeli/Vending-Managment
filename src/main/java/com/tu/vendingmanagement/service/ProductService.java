
package com.tu.vendingmanagement.service;

import com.tu.vendingmanagement.dto.ProductRequest;
import com.tu.vendingmanagement.model.Product;
import com.tu.vendingmanagement.exception.BadRequestException;
import com.tu.vendingmanagement.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ProductService {

    private final ProductRepository repo;

    public ProductService(ProductRepository repo) {
        this.repo = repo;
    }

    @Transactional(readOnly = true)
    public List<Product> all() {
        return repo.findAllWithCategories();
    }

    @Transactional
    public Product create(ProductRequest r) {
        if (repo.existsBySku(r.sku())) {
            throw new BadRequestException("SKU already exists");
        }
        return repo.save(new Product(r.sku(), r.name(), r.price()));
    }
}
