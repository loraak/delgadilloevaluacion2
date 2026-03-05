package com.example.models;

import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

@Data
@Entity
public class PerfilEgreso {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id; 
    private String descripcion; 
    private List<String> habilidades;
    private List<String> habilidadesEspecificas; 

    public PerfilEgreso() {
    }

    public PerfilEgreso(int id, String descripcion, List<String> habilidades, List<String> habilidadesEspecificas) {
        this.id = id;
        this.descripcion = descripcion;
        this.habilidades = habilidades;
        this.habilidadesEspecificas = habilidadesEspecificas;
    }
}

