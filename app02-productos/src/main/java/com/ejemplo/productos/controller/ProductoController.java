package com.ejemplo.productos.controller;

import com.ejemplo.productos.model.Producto;
import com.ejemplo.productos.service.ProductoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
public class ProductoController {

    @Autowired
    private ProductoService productoService;

    // Servir el frontend
    @GetMapping("/")
    public String index() {
        return "index.html";
    }

    // API endpoints
    @GetMapping("/api/productos")
    @ResponseBody
    public ResponseEntity<List<Producto>> getAllProductos() {
        List<Producto> productos = productoService.findAll();
        return ResponseEntity.ok(productos);
    }

    @GetMapping("/api/productos/{id}")
    @ResponseBody
    public ResponseEntity<Producto> getProductoById(@PathVariable Long id) {
        return productoService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/api/productos")
    @ResponseBody
    public ResponseEntity<?> createProducto(@RequestBody Producto producto) {
        if (productoService.existsByNombre(producto.getNombre())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Ya existe un producto con ese nombre");
        }

        Producto nuevoProducto = productoService.save(producto);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevoProducto);
    }

    @PutMapping("/api/productos/{id}")
    @ResponseBody
    public ResponseEntity<?> updateProducto(@PathVariable Long id, @RequestBody Producto productoDetails) {
        try {
            Producto productoActualizado = productoService.update(id, productoDetails);
            return ResponseEntity.ok(productoActualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/api/productos/{id}")
    @ResponseBody
    public ResponseEntity<?> deleteProducto(@PathVariable Long id) {
        try {
            productoService.deleteById(id);
            return ResponseEntity.ok().body("Producto eliminado correctamente");
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}