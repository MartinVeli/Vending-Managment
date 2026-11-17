package com.tu.vendingmanagement.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

@Entity
@Table(name = "vending_machines")
public class VendingMachine {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @NotBlank @Column(nullable=false, unique=true) private String code;
    @NotBlank @Column(nullable=false) private String name;
    @NotBlank @Column(nullable=false) private String address;
    @NotNull @Column(nullable=false, precision=10, scale=7) private BigDecimal latitude;
    @NotNull @Column(nullable=false, precision=10, scale=7) private BigDecimal longitude;
    @Column(nullable=false) private boolean active = true;

    @Enumerated(EnumType.STRING)
    @Column(nullable=false, length=20)
    private MachineStatus status = MachineStatus.ACTIVE;

    protected VendingMachine() {}
    public VendingMachine(String code, String name, String address, BigDecimal latitude, BigDecimal longitude) {
        this.code=code; this.name=name; this.address=address; this.latitude=latitude; this.longitude=longitude;
        this.status=MachineStatus.ACTIVE;
    }
    @PrePersist
    private void ensureStatus() {
        if (status == null) status = MachineStatus.ACTIVE;
    }

    public Long getId(){return id;} public String getCode(){return code;} public String getName(){return name;}
    public String getAddress(){return address;} public BigDecimal getLatitude(){return latitude;}
    public BigDecimal getLongitude(){return longitude;} public boolean isActive(){return active;}
    public MachineStatus getStatus(){return status;}
    public void setCode(String v){code=v;} public void setName(String v){name=v;} public void setAddress(String v){address=v;}
    public void setLatitude(BigDecimal v){latitude=v;} public void setLongitude(BigDecimal v){longitude=v;}
    public void setActive(boolean v){active=v;} public void setStatus(MachineStatus v){status=v;}
}
