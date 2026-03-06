package com.example.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.Errors;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;

import com.example.models.PlanEstudios;
import com.example.repository.OfertaEducativaRepository;
import com.example.repository.PlanEstudiosRepository;

import jakarta.validation.Valid;

@Controller
public class PlanEstudiosController {
    @Autowired
    private PlanEstudiosRepository repositorio; 

    @Autowired
    private OfertaEducativaRepository ofertasRepositorio; 

    @GetMapping("/plan-estudios")
    public String planEstudios (Model model) { 
        model.addAttribute("title", "Plan de Estudios"); 
        List<PlanEstudios> planes = repositorio.findAll(); 
        model.addAttribute("planes", planes); 
        model.addAttribute("ofertas", ofertasRepositorio.findAll()); 
        return "planesEstudios"; 
    }

    @GetMapping("/admin/plan-estudios")
    public String planEstudiosAdmin (Model model) { 
        model.addAttribute("title", "Plan de Estudios"); 
        List<PlanEstudios> planes = repositorio.findAll(); 
        model.addAttribute("planes", planes); 
        model.addAttribute("ofertas", ofertasRepositorio.findAll()); 
        return "planesEstudiosAdmin"; 
    }

    @GetMapping("/api/planestudios/{id}")
    @ResponseBody
    public PlanEstudios getPlanEstudios(@PathVariable Long id) { 
        return repositorio.findById(id).orElse(null); 
    }

    @PostMapping(value = "/api/planestudios/save", consumes = "application/json", produces = "application/json")
    public ResponseEntity<?> savePlanEstudiosAsync(@Valid @RequestBody PlanEstudios planEstudios, Errors errores) { 
        if (errores.hasErrors()) {
            return ResponseEntity.badRequest()
                .body(java.util.Map.of("success", false, "message", "Errores de validación en los campos")); 
        }
        try {
            if (planEstudios.getOfertaEducativa() != null) {
                Integer ofertaId = planEstudios.getOfertaEducativa().getId(); 

                repositorio.findByOfertaEducativaId(ofertaId).ifPresent(existente -> { 
                    if (!existente.getId().equals(planEstudios.getId())) {
                        throw new IllegalArgumentException("Esta oferta ya tiene un plan de estudios asignado"); 
                    }
                });
            }
            PlanEstudios savedPlanEstudios = repositorio.save(planEstudios);
            return ResponseEntity.ok(java.util.Map.of("success", true, "message", "Plan de estudios guardado", "plan", savedPlanEstudios)); 
        } catch (IllegalArgumentException e) { 
            return ResponseEntity.badRequest()
                .body(Map.of("success", false, "message", e.getMessage())); 
        } catch (Exception e) { 
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(java.util.Map.of("success", false, "message", "Error del servidor")); 
        }
    }
}
