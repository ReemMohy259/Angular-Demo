package com.shopapp.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

@Entity
@Table(name = "products")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Name is required")
    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @NotNull
    @DecimalMin(value = "0.0", inclusive = false)
    @Column(nullable = false)
    private Double price;

    @NotNull
    @Column(name = "original_price", nullable = false)
    private Double originalPrice;

    @Min(0) @Max(100)
    private Integer discount;

    private String image;

    private String category;

    @DecimalMin("0.0") @DecimalMax("5.0")
    private Double rating;

    @Min(0)
    private Integer stock;
}
