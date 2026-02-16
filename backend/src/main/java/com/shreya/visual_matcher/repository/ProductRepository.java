package com.shreya.visual_matcher.repository;

import com.shreya.visual_matcher.model.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long> {
}
