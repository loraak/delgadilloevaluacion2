package com.example.controller;

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
import com.example.models.Division;
import com.example.repository.DivisionRepository;
import com.example.repository.OfertaEducativaRepository;
import jakarta.validation.Valid;

@Controller
public class InicioController {
    @Autowired
    private OfertaEducativaRepository repo; 

    @Autowired
    private DivisionRepository divisionrepo; 

    @GetMapping("/")
    public String inicio (Model model) { 
        return "index"; 
    }

    @PostMapping("/consola/divisiones/save")
        public String postMethodName(@Valid Division division,
        Errors errors) {
        if (errors.hasErrors()) {
        return "divisionForm";
        }
        divisionrepo.save(division);
        return "redirect:/consola/divisiones";
        }

        @PostMapping(value = "/api/division/save",
        consumes = "application/json",
        produces = "application/json"
        )
        public ResponseEntity<?> saveDivisionAsync(@Valid @RequestBody Division division, Errors errores) {
            if (errores.hasErrors()) {
                return ResponseEntity.badRequest()
                .body(java.util.Map.of("success", false, "message", "Errores de validación"));
        }

        try {
            Division savedDivision = divisionrepo.save(division);
            return ResponseEntity.ok(java.util.Map.of(
            "success", true,
            "message", "División guardada correctamente",
            "division", savedDivision
            ));
            } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(java.util.Map.of("success", false, "message", "Error al guardar la división"));
        }
    }

    @GetMapping("/api/divisiones/{id}")
    @ResponseBody
    public Division getDivision(@PathVariable Integer id) {
        return divisionrepo.findById(id).orElse(null);
    }

    //PerfilDeIngresoController
    

} 