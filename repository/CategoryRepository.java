package com.tu.vendingmanagement.repository;
import com.tu.vendingmanagement.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
public interface CategoryRepository extends JpaRepository<Category, Long> {}
