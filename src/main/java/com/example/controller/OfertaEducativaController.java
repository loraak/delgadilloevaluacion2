package com.example.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.Errors;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;

import com.example.repository.DivisionRepository;
import com.example.repository.OfertaEducativaRepository;

import jakarta.validation.Valid;

import com.example.models.OfertaEducativa;

@Controller
public class OfertaEducativaController {
    @Autowired
    private OfertaEducativaRepository repositorio; 

    @Autowired
    private DivisionRepository divisionRepositorio; 

    //  Obtener la plantilla de ofertas educativas. 
    //  Se obtiene un string porque obtenemos el nombre de la plantilla
    //  Model se usa para enviar datos a la plantilla. 
    //  Plantilla para un usuario normal. 
    @GetMapping("/ofertas-educativas")
    public String ofertasEducativas (Model model) {
        model.addAttribute("title", "Ofertas Educativas"); 
        List<OfertaEducativa> ofertas = repositorio.findAll(); 
        model.addAttribute("ofertas", ofertas); 
        model.addAttribute("divisiones", divisionRepositorio.findAll()); 
        return "ofertasEducativas";    
    }

    //  Plantilla para un administrador. 
    @GetMapping("/admin/ofertas-educativas")
    public String ofertasEducativasAdmin (Model model) { 
        model.addAttribute("title", "Ofertas Educativas"); 
        List<OfertaEducativa> ofertas = repositorio.findAll();
        model.addAttribute("ofertas", ofertas); 
        model.addAttribute("divisiones", divisionRepositorio.findAll()); 
        return "ofertasEducativasAdmin";  
    }

    //  Encontrar por ID. 
    @GetMapping("/api/ofertas/{id}")
    @ResponseBody 
    public OfertaEducativa getOferta(@PathVariable Long id) { 
        return repositorio.findById(id).orElse(null); 
    }

    // Añadir o editar una oferta educativa. 
    @PostMapping(value = "/api/oferta/save", consumes = "application/json", produces = "application/json") 
    public ResponseEntity<?> saveOfertaAsync(@Valid @RequestBody OfertaEducativa ofertaEducativa, Errors errores) { 
        if (errores.hasErrors()) { 
            return ResponseEntity.badRequest()
                .body(java.util.Map.of("success", false, "message", "Errores de validación")); 
        }
        try {
            OfertaEducativa savedOferta = repositorio.save(ofertaEducativa); 
            return ResponseEntity.ok(java.util.Map.of("success", true, "message", "Oferta guardada", "oferta", savedOferta));
        } catch (Exception e) { 
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(java.util.Map.of("success", false, "message", "Error en el servidor")); 
        }
    } 

    //  Eliminar una oferta educativa. 
    @DeleteMapping("/api/oferta/delete/{id}")
    @ResponseBody 
    public ResponseEntity<?> deleteOferta(@PathVariable Long id) { 
        repositorio.findById(id).ifPresent(repositorio::delete);
        return ResponseEntity.ok().build(); 
    }

}
