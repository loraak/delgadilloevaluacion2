package com.example.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.models.SeccionInstitucional;

@Repository
public interface SeccionInstitucionalRepository extends JpaRepository<SeccionInstitucional, Integer> {
    List<SeccionInstitucional> findByActiva(boolean activa);
}