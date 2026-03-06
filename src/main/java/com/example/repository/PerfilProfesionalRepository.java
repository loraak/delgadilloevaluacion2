package com.example.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.models.PerfilProfesional;

public interface PerfilProfesionalRepository extends JpaRepository<PerfilProfesional, Integer> {
    Optional <PerfilProfesional> findById(Long id); 

    Optional<PerfilProfesional> findByOfertaEducativaId(Integer id); 
}
