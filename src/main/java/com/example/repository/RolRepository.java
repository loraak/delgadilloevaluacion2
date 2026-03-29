package com.example.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.models.Rol;

public interface RolRepository extends JpaRepository<Rol, Integer> {
    Rol findByNombre(String nombre);
}