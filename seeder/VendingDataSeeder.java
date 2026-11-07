package com.tu.vendingmanagement.seeder;

import com.tu.vendingmanagement.model.Category;
import com.tu.vendingmanagement.model.Product;
import com.tu.vendingmanagement.model.VendingMachine;
import com.tu.vendingmanagement.repository.CategoryRepository;
import com.tu.vendingmanagement.repository.MachineRepository;
import com.tu.vendingmanagement.repository.ProductRepository;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import java.math.BigDecimal;
import java.util.Set;

@Configuration
public class VendingDataSeeder {
    @Bean
    ApplicationRunner seedInitialData(CategoryRepository categories, ProductRepository products, MachineRepository machines) {
        return args -> {
            Category drinks = categories.findAll().stream().filter(c -> c.getName().equals("Напитки")).findFirst().orElseGet(() -> categories.save(new Category("Напитки")));
            Category snacks = categories.findAll().stream().filter(c -> c.getName().equals("Снаксове")).findFirst().orElseGet(() -> categories.save(new Category("Снаксове")));
            if (products.findAll().stream().noneMatch(p -> p.getSku().equals("WATER-500"))) {
                Product water = new Product("WATER-500", "Минерална вода 500 мл", new BigDecimal("1.50"));
                water.setCategories(Set.of(drinks));
                products.save(water);
            }
            if (products.findAll().stream().noneMatch(p -> p.getSku().equals("SNACK-001"))) {
                Product snack = new Product("SNACK-001", "Шоколадов десерт", new BigDecimal("2.20"));
                snack.setCategories(Set.of(snacks));
                products.save(snack);
            }
            if (machines.findAll().stream().noneMatch(m -> m.getCode().equals("VM-001"))) {
                machines.save(new VendingMachine("VM-001", "Вендинг машина 1", "София, примерен адрес", new BigDecimal("42.6977"), new BigDecimal("23.3219")));
            }
        };
    }
}
