package com.example.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.Data; 

@Data
@Entity
public class OfertaEducativa {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @NotEmpty(message = "El nombre de la oferta es obligatorio")
    private String nombreOferta; 
    private String modalidad; 

    
    @Size(min = 10, message = "La URL de la imagen es demasiado corta")
    
    private String imagen;

    @ManyToOne
    @JoinColumn(name = "id_division")
    @JsonIgnoreProperties("programasEducativos")
    private Division division;

    @OneToOne(mappedBy = "ofertaEducativa", cascade = CascadeType.ALL)
    @JsonIgnoreProperties("ofertaEducativa")
    private PerfilDeIngreso perfilDeIngreso; 

    @OneToOne(mappedBy = "ofertaEducativa", cascade = CascadeType.ALL)
    @JsonIgnoreProperties("ofertaEducativa")
    private PerfilProfesional perfilProfesional;
    
    @OneToOne(mappedBy = "ofertaEducativa", cascade = CascadeType.ALL)
    @JsonIgnoreProperties("ofertaEducativa")
    private PlanEstudios planEstudios;
}
