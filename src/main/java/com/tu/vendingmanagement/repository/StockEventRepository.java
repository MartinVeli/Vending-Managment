package com.tu.vendingmanagement.repository;
import com.tu.vendingmanagement.model.StockEvent;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface StockEventRepository extends JpaRepository<StockEvent, Long> {

@Query("""
    SELECT e
    FROM StockEvent e
    JOIN FETCH e.inventoryItem i
    JOIN FETCH i.product
    WHERE i.machine.id = :machineId
    ORDER BY e.createdAt DESC, e.id DESC
    """)
List<StockEvent> findByMachineId(
        @Param("machineId") Long machineId
);
}
