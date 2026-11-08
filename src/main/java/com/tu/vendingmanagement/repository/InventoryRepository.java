package com.tu.vendingmanagement.repository;

import com.tu.vendingmanagement.model.InventoryItem;

import jakarta.persistence.LockModeType;

import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface InventoryRepository extends JpaRepository<InventoryItem, Long> {

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("""
            select i
            from InventoryItem i
            join fetch i.product
            join fetch i.machine
            where i.id = :id
            """)
    Optional<InventoryItem> findByIdForUpdate(@Param("id") Long id);

    @Query("""
            select i
            from InventoryItem i
            join fetch i.machine m
            join fetch i.product p
            where i.quantity <= i.lowStockThreshold
              and m.status = com.tu.vendingmanagement.model.MachineStatus.ACTIVE
            order by i.quantity asc
            """)
    List<InventoryItem> findLowStock();

    @Query("""
            select i
            from InventoryItem i
            join fetch i.machine m
            join fetch i.product p
            where m.id = :machineId
            order by p.name
            """)
    List<InventoryItem> findByMachine(@Param("machineId") Long machineId);

    boolean existsByMachineIdAndProductId(Long machineId, Long productId);
}