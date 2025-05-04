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

    @PutMapping("/{id}")
    public ResponseEntity<Uniterm> updateUniterm(@PathVariable Long id, @RequestBody Uniterm uniterm) {
        if (!unitermService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        uniterm.setId(id);
        return ResponseEntity.ok(unitermService.save(uniterm));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUniterm(@PathVariable Long id) {
        if (!unitermService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        unitermService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}