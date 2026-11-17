package com.tu.vendingmanagement.repository;

import com.tu.vendingmanagement.model.MachineStatus;
import com.tu.vendingmanagement.model.VendingMachine;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MachineRepository extends JpaRepository<VendingMachine, Long> {
    boolean existsByCode(String code);

    List<VendingMachine> findByStatusIsNullOrStatusNot(MachineStatus status);
}
