package com.shreya.visual_matcher.model.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "products")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String category;

    @Column(name = "image_url", nullable = true)
    private String imageUrl;

    @Lob
    private String embedding;

    @Column(name = "image_data", columnDefinition = "BYTEA")
    private byte[] imageData;
}