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

    @NotBlank(message = "El tipo es obligatorio")
    @Column(length = 300)
    private String mision;

    @NotBlank(message = "El tipo es obligatorio")
    @Column(length = 300)
    private String vision;

    @NotBlank(message = "El tipo es obligatorio")
    @Column(length = 300)
    private String politica;

    @NotBlank(message = "El tipo es obligatorio")
    @Column(length = 300)
    private String objetivos;

    @NotBlank(message = "El tipo es obligatorio")
    @Column(length = 300)
    private String valores;
}