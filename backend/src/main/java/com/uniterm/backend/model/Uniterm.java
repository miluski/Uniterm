package com.uniterm.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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

    @Column(nullable = false)
    private String secondExpression;

    @Column
    private String separator;

    @Column
    private String sequentialSeparator;

    @PrePersist
    @PreUpdate
    private void ensureNameIsSet() {
        if (name == null || name.isEmpty()) {
            name = expression + (secondExpression != null ? " + " + secondExpression : "");
        }
    }
}