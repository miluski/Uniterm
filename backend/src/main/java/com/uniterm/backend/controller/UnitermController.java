package com.uniterm.backend.controller;

import com.uniterm.backend.model.Uniterm;
import com.uniterm.backend.services.UnitermService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/uniterms")
public class UnitermController {

    @Autowired
    private UnitermService unitermService;

    @GetMapping
    public List<Uniterm> getAllUniterms() {
        return unitermService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Uniterm> getUnitermById(@PathVariable Long id) {
        return unitermService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Uniterm createUniterm(@RequestBody Uniterm uniterm) {
        return unitermService.save(uniterm);
    }
}