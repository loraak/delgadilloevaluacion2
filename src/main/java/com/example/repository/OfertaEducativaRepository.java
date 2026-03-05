package com.example.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.models.OfertaEducativa;

public interface OfertaEducativaRepository extends JpaRepository<OfertaEducativa, Integer> {
    Optional<OfertaEducativa> findById(Long id);

}
