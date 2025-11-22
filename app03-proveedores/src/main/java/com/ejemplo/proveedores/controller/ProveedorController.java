package com.ejemplo.proveedores.controller;

import com.ejemplo.proveedores.model.Proveedor;
import com.ejemplo.proveedores.service.ProveedorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
public class ProveedorController {

    @Autowired
    private ProveedorService proveedorService;

    // Servir el frontend
    @GetMapping("/")
    public String index() {
        return "index.html";
    }

    // API endpoints
    @GetMapping("/api/proveedores")
    @ResponseBody
    public ResponseEntity<List<Proveedor>> getAllProveedores() {
        List<Proveedor> proveedores = proveedorService.findAll();
        return ResponseEntity.ok(proveedores);
    }

    @GetMapping("/api/proveedores/{id}")
    @ResponseBody
    public ResponseEntity<Proveedor> getProveedorById(@PathVariable Long id) {
        return proveedorService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/api/proveedores")
    @ResponseBody
    public ResponseEntity<?> createProveedor(@RequestBody Proveedor proveedor) {
        if (proveedorService.existsByEmail(proveedor.getEmail())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Ya existe un proveedor con ese email");
        }

        if (proveedorService.existsByNombre(proveedor.getNombre())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Ya existe un proveedor con ese nombre");
        }

        Proveedor nuevoProveedor = proveedorService.save(proveedor);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevoProveedor);
    }

    @PutMapping("/api/proveedores/{id}")
    @ResponseBody
    public ResponseEntity<?> updateProveedor(@PathVariable Long id, @RequestBody Proveedor proveedorDetails) {
        try {
            Proveedor proveedorActualizado = proveedorService.update(id, proveedorDetails);
            return ResponseEntity.ok(proveedorActualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/api/proveedores/{id}")
    @ResponseBody
    public ResponseEntity<?> deleteProveedor(@PathVariable Long id) {
        try {
            proveedorService.deleteById(id);
            return ResponseEntity.ok().body("Proveedor eliminado correctamente");
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}