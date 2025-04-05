package org.example.financeappbackend.controller;

import org.example.financeappbackend.entity.Budget;
import org.example.financeappbackend.entity.Category;
import org.example.financeappbackend.service.BudgetService;
import org.example.financeappbackend.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/budgets")
public class BudgetController {

    @Autowired
    private BudgetService budgetService;

    @Autowired
    private CategoryService categoryService;

    // Get all budgets
    @GetMapping
    public List<Budget> getAllBudgets() {
        return budgetService.getAllBudgets();
    }

    // Get budget by ID
    @GetMapping("/{id}")
    public ResponseEntity<Budget> getBudgetById(@PathVariable Long id) {
        Optional<Budget> budget = budgetService.getBudgetById(id);
        return budget.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Create a new budget
    @PostMapping
    public ResponseEntity<Budget> createBudget(@Valid @RequestBody Budget budget) {
        if (isCategoryIdInvalid(budget)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }

        Optional<Category> categoryOpt = categoryService.getCategoryById(budget.getCategory().getId());
        if (categoryOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }

        Optional<Budget> existingBudget = budgetService.getBudgetByCategoryIdAndMonth(
                budget.getCategory().getId(), budget.getMonth());

        if (existingBudget.isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(null);
        }

        Budget createdBudget = budgetService.createBudget(budget);
        return ResponseEntity.ok(createdBudget);
    }

    // Update a budget
    @PutMapping("/{id}")
    public ResponseEntity<Budget> updateBudget(@PathVariable Long id, @Valid @RequestBody Budget budgetDetails) {
        Optional<Budget> updatedBudget = budgetService.updateBudget(id, budgetDetails);
        return updatedBudget.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Delete a budget
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBudget(@PathVariable Long id) {
        boolean deleted = budgetService.deleteBudget(id);
        return deleted ? ResponseEntity.ok().build() : ResponseEntity.notFound().build();
    }

    // Helper method for null checking category ID
    private boolean isCategoryIdInvalid(Budget budget) {
        return budget == null || budget.getCategory() == null || budget.getCategory().getId() == null;
    }
}
