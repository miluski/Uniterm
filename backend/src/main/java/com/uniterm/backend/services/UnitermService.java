package com.uniterm.backend.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.uniterm.backend.model.Uniterm;
import com.uniterm.backend.repositories.UnitermRepository;

import java.util.List;
import java.util.Optional;

@Service
public class UnitermService {

    @Autowired
    private UnitermRepository unitermRepository;

    public List<Uniterm> findAll() {
        return unitermRepository.findAll();
    }

    public Optional<Uniterm> findById(Long id) {
        return unitermRepository.findById(id);
    }

    public Uniterm save(Uniterm uniterm) {
        return unitermRepository.save(uniterm);
    }

    public boolean existsById(Long id) {
        return unitermRepository.existsById(id);
    }
}