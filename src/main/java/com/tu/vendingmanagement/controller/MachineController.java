package com.tu.vendingmanagement.controller;
import com.tu.vendingmanagement.dto.MachineRequest;
import com.tu.vendingmanagement.model.VendingMachine;
import com.tu.vendingmanagement.service.MachineService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController @RequestMapping("/api/machines")
public class MachineController {
 private final MachineService service;
 public MachineController(MachineService service){this.service=service;}
 @GetMapping public List<VendingMachine> all(){return service.all();}
 @GetMapping("/{id}") public VendingMachine get(@PathVariable Long id){return service.get(id);}
 @PostMapping public VendingMachine create(@Valid @RequestBody MachineRequest r){return service.create(r);}
}
