package com.tu.vendingmanagement.service;

import com.tu.vendingmanagement.dto.MachineRequest;
import com.tu.vendingmanagement.exception.BadRequestException;
import com.tu.vendingmanagement.exception.NotFoundException;
import com.tu.vendingmanagement.model.VendingMachine;
import com.tu.vendingmanagement.repository.MachineRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class MachineService {

    private final MachineRepository machineRepository;

    public MachineService(MachineRepository machineRepository) {
        this.machineRepository = machineRepository;
    }

    @Transactional(readOnly = true)
    public List<VendingMachine> all() {
        return machineRepository.findAll();
    }

    @Transactional(readOnly = true)
    public VendingMachine get(Long id) {
        return machineRepository.findById(id)
                .orElseThrow(() ->
                        new NotFoundException("Machine not found"));
    }

    @Transactional
    public VendingMachine create(MachineRequest request) {
        validateUniqueCode(request.code());

        VendingMachine machine = new VendingMachine(
                request.code(),
                request.name(),
                request.address(),
                request.latitude(),
                request.longitude()
        );

        machine.setStatus(request.status());

        return machineRepository.save(machine);
    }

    @Transactional
    public VendingMachine updateMachine(Long id, MachineRequest request) {
        VendingMachine machine = get(id);

        if (!machine.getCode().equals(request.code())) {
            validateUniqueCode(request.code());
        }

        machine.setCode(request.code());
        machine.setName(request.name());
        machine.setAddress(request.address());
        machine.setLatitude(request.latitude());
        machine.setLongitude(request.longitude());
        machine.setStatus(request.status());

        return machineRepository.save(machine);
    }

    private void validateUniqueCode(String code) {
        if (machineRepository.existsByCode(code)) {
            throw new BadRequestException("Machine code already exists");
        }
    }
}