package com.example.models;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Entity
public class SeccionInstitucional {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @NotBlank(message = "La misión es obligatoria")
    @Column(columnDefinition = "TEXT")
    private String mision;

    @NotBlank(message = "La visión es obligatoria")
    @Column(columnDefinition = "TEXT")
    private String vision;

    @NotBlank(message = "La política es obligatoria")
    @Column(columnDefinition = "TEXT")
    private String politica;

    @NotBlank(message = "Los objetivos son obligatorios")
    @Column(columnDefinition = "TEXT")
    private String objetivos;

    @NotBlank(message = "Los valores son obligatorios")
    @Column(columnDefinition = "TEXT")
    private String valores;
}