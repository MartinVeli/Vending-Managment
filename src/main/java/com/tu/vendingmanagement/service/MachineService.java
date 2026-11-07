package com.tu.vendingmanagement.service;
import com.tu.vendingmanagement.dto.MachineRequest;
import com.tu.vendingmanagement.model.VendingMachine;
import com.tu.vendingmanagement.exception.*;
import com.tu.vendingmanagement.repository.MachineRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class MachineService {
 private final MachineRepository repo;
 public MachineService(MachineRepository repo){this.repo=repo;}
 @Transactional(readOnly=true) public List<VendingMachine> all(){return repo.findAll();}
 @Transactional public VendingMachine create(MachineRequest r){
  if(repo.existsByCode(r.code())) throw new BadRequestException("Machine code already exists");
  return repo.save(new VendingMachine(r.code(),r.name(),r.address(),r.latitude(),r.longitude()));
 }
 @Transactional(readOnly=true) public VendingMachine get(Long id){return repo.findById(id).orElseThrow(()->new NotFoundException("Machine not found"));}
}
