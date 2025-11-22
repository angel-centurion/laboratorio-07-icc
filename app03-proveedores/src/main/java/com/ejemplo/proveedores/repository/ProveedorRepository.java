package com.ejemplo.proveedores.repository;

import com.ejemplo.proveedores.model.Proveedor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProveedorRepository extends JpaRepository<Proveedor, Long> {
    boolean existsByEmail(String email);
    boolean existsByNombre(String nombre);
}