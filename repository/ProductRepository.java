
package com.tu.vendingmanagement.repository;

import com.tu.vendingmanagement.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long> {

    boolean existsBySku(String sku);

    @Query("SELECT DISTINCT p FROM Product p LEFT JOIN FETCH p.categories")
    List<Product> findAllWithCategories();

    @Query("SELECT DISTINCT p FROM Product p LEFT JOIN FETCH p.categories WHERE p.id = :id")
    Optional<Product> findByIdWithCategories(@Param("id") Long id);
}
