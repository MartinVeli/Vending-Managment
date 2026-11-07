package com.tu.vendingmanagement.repository;
import com.tu.vendingmanagement.model.StockEvent;
import org.springframework.data.jpa.repository.JpaRepository;
public interface StockEventRepository extends JpaRepository<StockEvent, Long> {}
