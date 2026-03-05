package com.example.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.models.PerfilDeIngreso;

public interface PerfildeIngresoRepository extends JpaRepository<PerfilDeIngreso, Integer>{
    Optional<PerfilDeIngreso> findById(Long id); 
}
