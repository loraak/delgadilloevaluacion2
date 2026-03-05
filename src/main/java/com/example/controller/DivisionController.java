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

import jakarta.validation.Valid;

@Controller
public class DivisionController {
    @Autowired
    private DivisionRepository repositorio; 

    @GetMapping("/admin/divisiones")
    public String divisionesAdmin (Model model) { 
        model.addAttribute("title", "Divisiones"); 
        model.addAttribute("divisiones", repositorio.findAll()); 
        return "divisionesAdmin"; 
    }

    @GetMapping("/divisiones")
    public String divisiones (Model model) { 
        model.addAttribute("title", "Divisiones"); 
        model.addAttribute("divisiones", repositorio.findAll()); 
        return "divisiones"; 
    }

    @GetMapping("/api/divisiones/{id}")
    @ResponseBody
    public Division getDivision(@PathVariable Integer id) { 
        return repositorio.findById(id).orElse(null); 
    }

    @PostMapping(value = "/api/division/save", consumes ="application/json", produces="application/json")
    public ResponseEntity<?> saveDivisionAsync(@Valid @RequestBody Division division, Errors errores) { 
        if (errores.hasErrors()) { 
            return ResponseEntity.badRequest()
            .body(java.util.Map.of("success", false, "message", "Errores de validación")); 
        }
        try { 
            Division savedDivision = repositorio.save(division); 
            return ResponseEntity.ok(java.util.Map.of ("success", true, "message", "División guardada correctamente", "division", savedDivision)); 
        } catch (Exception e) { 
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(java.util.Map.of("success", false, "message", "Error al guardar la división"));
        }
    }
}
