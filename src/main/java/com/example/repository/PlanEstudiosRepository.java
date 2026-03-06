package com.example.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.models.PlanEstudios;

public interface PlanEstudiosRepository extends JpaRepository<PlanEstudios, Integer>{
    Optional<PlanEstudios> findById(Long id); 

    Optional<PlanEstudios> findByOfertaEducativaId(Integer id); 
    
}
