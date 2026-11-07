package com.tu.vendingmanagement;

import com.tu.vendingmanagement.dto.*;
import com.tu.vendingmanagement.model.*;
import com.tu.vendingmanagement.repository.*;
import com.tu.vendingmanagement.service.InventoryService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import static org.assertj.core.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
class InventoryBusinessFlowIT {
 @Autowired InventoryService inventoryService;
 @Autowired MachineRepository machineRepository;
 @Autowired ProductRepository productRepository;
 @Autowired InventoryRepository inventoryRepository;
 @Autowired RestockTaskRepository restockTaskRepository;

 @Test @Transactional
 void saleThatCrossesThresholdCreatesRestockTaskAndRestockClosesIt() {
  VendingMachine machine=machineRepository.save(new VendingMachine("VM-TEST","Test machine","Sofia",new BigDecimal("42.6977"),new BigDecimal("23.3219")));
  Product product=productRepository.save(new Product("SKU-TEST","Water",new BigDecimal("1.50")));
  InventoryResponse created=inventoryService.create(new InventoryCreateRequest(machine.getId(),product.getId(),5,10,3,2));
  InventoryResponse afterSale=inventoryService.sell(created.id(),2);
  assertThat(afterSale.quantity()).isEqualTo(3);
  assertThat(afterSale.lowStock()).isTrue();
  assertThat(restockTaskRepository.findAll()).hasSize(1);
  InventoryResponse afterRestock=inventoryService.restock(created.id(),new RestockRequest(4,"Scheduled refill"));
  assertThat(afterRestock.quantity()).isEqualTo(7);
  assertThat(restockTaskRepository.findAll().get(0).getStatus()).isEqualTo(RestockTask.Status.COMPLETED);
 }
}
