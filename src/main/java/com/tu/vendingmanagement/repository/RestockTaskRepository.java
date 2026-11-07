package com.tu.vendingmanagement.repository;
import com.tu.vendingmanagement.model.RestockTask;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface RestockTaskRepository extends JpaRepository<RestockTask, Long> {
    List<RestockTask> findByStatusOrderByRecommendedByAsc(RestockTask.Status status);
    boolean existsByInventoryItemIdAndStatus(Long inventoryItemId, RestockTask.Status status);
}
