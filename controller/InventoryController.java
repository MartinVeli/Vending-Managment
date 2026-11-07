package com.tu.vendingmanagement.controller;
import com.tu.vendingmanagement.dto.*;
import com.tu.vendingmanagement.service.InventoryService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController @RequestMapping("/api/inventory") @Validated
public class InventoryController {
 private final InventoryService service;
 public InventoryController(InventoryService service){this.service=service;}
 @PostMapping public InventoryResponse create(@Valid @RequestBody InventoryCreateRequest r){return service.create(r);}
 @GetMapping("/machine/{machineId}") public List<InventoryResponse> byMachine(@PathVariable Long machineId){return service.byMachine(machineId);}
 @GetMapping("/low-stock") public List<InventoryResponse> lowStock(){return service.lowStock();}
 @PostMapping("/{id}/sales") public InventoryResponse sell(@PathVariable Long id,@Valid @RequestBody QuantityRequest r){return service.sell(id,r.quantity());}
 @PostMapping("/{id}/restock") public InventoryResponse restock(@PathVariable Long id,@Valid @RequestBody RestockRequest r){return service.restock(id,r);}
}
