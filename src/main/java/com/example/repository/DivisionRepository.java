package com.example.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.models.Division;

public interface DivisionRepository extends JpaRepository<Division, Integer> {
    Optional<Division> findById(Long id); 
}
