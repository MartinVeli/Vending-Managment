package com.tu.vendingmanagement.service;

import com.tu.vendingmanagement.exception.ConflictException;
import com.tu.vendingmanagement.exception.NotFoundException;
import com.tu.vendingmanagement.model.MachineStatus;
import com.tu.vendingmanagement.model.VendingMachine;
import com.tu.vendingmanagement.repository.MachineRepository;
import org.junit.jupiter.api.BeforeEach;
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
class MachineServiceTest {
    @Mock
    private MachineRepository repository;

    @InjectMocks
    private MachineService service;

    private VendingMachine machine;

    @BeforeEach
    void setUp() {
        machine = new VendingMachine("VM-001", "Main machine", "Main street",
                BigDecimal.ZERO, BigDecimal.ZERO);
    }

    @Test
    void deprecateChangesStatusAndKeepsMachineInRepository() {
        when(repository.findById(1L)).thenReturn(Optional.of(machine));

        service.deprecate(1L);

        assertEquals(MachineStatus.DEPRECATED, machine.getStatus());
        verify(repository).save(machine);
        verify(repository, never()).delete(any());
    }

    @Test
    void deprecateMissingMachineThrowsNotFound() {
        when(repository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(NotFoundException.class, () -> service.deprecate(99L));

        verify(repository, never()).save(any());
        verify(repository, never()).delete(any());
    }

    @Test
    void deprecateAlreadyDeprecatedMachineReturnsConflict() {
        machine.setStatus(MachineStatus.DEPRECATED);
        when(repository.findById(1L)).thenReturn(Optional.of(machine));

        assertThrows(ConflictException.class, () -> service.deprecate(1L));

        verify(repository, never()).save(any());
        verify(repository, never()).delete(any());
    }
}
