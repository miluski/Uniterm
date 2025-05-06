package com.uniterm.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter 
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "uniterms")
public class Uniterm {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    private String name;
    
    @Column(nullable = false)
    private String expression;
    
    private String description;
    
    @PrePersist
    @PreUpdate
    private void ensureNameIsSet() {
        if (name == null || name.isEmpty()) {
            name = expression;
        }
    }
}