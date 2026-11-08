package com.tu.vendingmanagement.controller;
import com.tu.vendingmanagement.dto.MachineRequest;
import com.tu.vendingmanagement.model.VendingMachine;
import com.tu.vendingmanagement.service.MachineService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController @RequestMapping("/api/machines")
public class MachineController {

 private final MachineService machineService;

 public MachineController(MachineService service){
    this.machineService=service;

}
 @GetMapping 
 public List<VendingMachine> all(){
    return machineService.all();
}
 @GetMapping("/{id}")
public VendingMachine get(@PathVariable Long id){
    return machineService.get(id);
}

@PostMapping
public VendingMachine create(@Valid @RequestBody MachineRequest r)
{
    return machineService.create(r);
}

@PutMapping("/{id}")
public VendingMachine updateMachine(
        @PathVariable Long id,
        @RequestBody MachineRequest updatedMachine) {

    return machineService.updateMachine(id, updatedMachine);
}
}

