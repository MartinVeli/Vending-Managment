package com.tu.vendingmanagement.service;

import com.tu.vendingmanagement.exception.ConflictException;
import com.tu.vendingmanagement.exception.NotFoundException;
import com.tu.vendingmanagement.model.MachineStatus;
import com.tu.vendingmanagement.model.VendingMachine;
import com.tu.vendingmanagement.repository.MachineRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class MachineServiceSoftDeleteTest {

    @Mock
    private MachineRepository machineRepository;

    @InjectMocks
    private MachineService machineService;

    private VendingMachine machine() {
        return new VendingMachine(
                "VM-001",
                "Main machine",
                "Main street",
                BigDecimal.ZERO,
                BigDecimal.ZERO
        );
    }

    @Test
    void deprecateChangesStatusWithoutDeletingRecord() {
        VendingMachine machine = machine();
        when(machineRepository.findById(1L)).thenReturn(Optional.of(machine));

        machineService.deprecate(1L);

        assertEquals(MachineStatus.DEPRECATED, machine.getStatus());
        verify(machineRepository).save(machine);
        verify(machineRepository, never()).delete(any());
    }

    @Test
    void deprecateMissingMachineReturnsNotFound() {
        when(machineRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(NotFoundException.class, () -> machineService.deprecate(99L));

        verify(machineRepository, never()).save(any());
        verify(machineRepository, never()).delete(any());
    }

    @Test
    void deprecateAlreadyDeprecatedMachineReturnsConflict() {
        VendingMachine machine = machine();
        machine.setStatus(MachineStatus.DEPRECATED);
        when(machineRepository.findById(1L)).thenReturn(Optional.of(machine));

        assertThrows(ConflictException.class, () -> machineService.deprecate(1L));

        verify(machineRepository, never()).save(any());
        verify(machineRepository, never()).delete(any());
    }
}
