package com.ejemplo.proveedores.service;

import com.ejemplo.proveedores.model.Proveedor;
import com.ejemplo.proveedores.repository.ProveedorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProveedorService {

    @Autowired
    private ProveedorRepository proveedorRepository;

    public List<Proveedor> findAll() {
        return proveedorRepository.findAll();
    }

    public Optional<Proveedor> findById(Long id) {
        return proveedorRepository.findById(id);
    }

    public Proveedor save(Proveedor proveedor) {
        return proveedorRepository.save(proveedor);
    }

    public Proveedor update(Long id, Proveedor proveedorDetails) {
        Proveedor proveedor = proveedorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Proveedor no encontrado con id: " + id));

        proveedor.setNombre(proveedorDetails.getNombre());
        proveedor.setContacto(proveedorDetails.getContacto());
        proveedor.setTelefono(proveedorDetails.getTelefono());
        proveedor.setEmail(proveedorDetails.getEmail());
        proveedor.setDireccion(proveedorDetails.getDireccion());

        return proveedorRepository.save(proveedor);
    }

    public void deleteById(Long id) {
        Proveedor proveedor = proveedorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Proveedor no encontrado con id: " + id));
        proveedorRepository.delete(proveedor);
    }

    public boolean existsByEmail(String email) {
        return proveedorRepository.existsByEmail(email);
    }

    public boolean existsByNombre(String nombre) {
        return proveedorRepository.existsByNombre(nombre);
    }
}