package com.tu.vendingmanagement.repository;
import com.tu.vendingmanagement.model.VendingMachine;
import org.springframework.data.jpa.repository.JpaRepository;
public interface MachineRepository extends JpaRepository<VendingMachine, Long> { boolean existsByCode(String code); }
