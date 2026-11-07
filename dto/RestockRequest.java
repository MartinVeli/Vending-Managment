package com.tu.vendingmanagement.dto;
import jakarta.validation.constraints.Min;
public record RestockRequest(@Min(1) int quantity, String note) {}
