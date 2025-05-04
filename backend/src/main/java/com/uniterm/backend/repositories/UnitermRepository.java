package com.uniterm.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.uniterm.backend.model.Uniterm;

@Repository
public interface UnitermRepository extends JpaRepository<Uniterm, Long> {
}