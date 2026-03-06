package com.example.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class PlanEstudios {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id; 

    @Size(min = 10, message = "La URL de la imagen es demasiado corta")
    private String imagen;

    @OneToOne() 
    @JoinColumn(name = "oferta_id", unique = true) 
    @JsonIgnoreProperties("planEstudios")
    private OfertaEducativa ofertaEducativa; 
}