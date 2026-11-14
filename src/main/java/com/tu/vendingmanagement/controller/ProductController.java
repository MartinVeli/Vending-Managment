package com.tu.vendingmanagement.controller;
import com.tu.vendingmanagement.dto.ProductRequest;
import com.tu.vendingmanagement.model.Product;
import com.tu.vendingmanagement.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController @RequestMapping("/api/products")
public class ProductController {

 private final ProductService service;

 public ProductController(ProductService service){
    this.service=service;
}
 @GetMapping public List<Product> all(){
    return service.all();
}

 @PostMapping public Product create(@Valid @RequestBody ProductRequest r){
    return service.create(r);
}
}
