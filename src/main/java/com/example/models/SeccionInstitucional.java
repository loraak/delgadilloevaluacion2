package com.example.models;


import java.util.ArrayList;
import java.util.List;

import com.example.service.StringListConverter;

import jakarta.persistence.Column;
import jakarta.persistence.Convert;
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

    @Convert(converter = StringListConverter.class)
    @Column(columnDefinition = "TEXT")
    private List<String> objetivos = new ArrayList<>();

    @Convert(converter = StringListConverter.class)
    @Column(columnDefinition = "TEXT")
    private List<String> valores = new ArrayList<>();

    private Boolean activa = false;
}