package com.example.controller;

import java.util.List;
import java.util.Map;

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

import com.example.models.SeccionInstitucional;
import com.example.repository.SeccionInstitucionalRepository;

import jakarta.validation.Valid;

@Controller
public class SeccionInstitucionalController {

    @Autowired
    private SeccionInstitucionalRepository repositorio;

    @GetMapping("/seccion-institucional")
    public String seccionInstitucional(Model model) {
        model.addAttribute("title", "Sección Institucional");
        List<SeccionInstitucional> secciones = repositorio.findAll();
        model.addAttribute("secciones", secciones);
        return "seccionInstitucional";
    }
    
    @GetMapping("/api/seccion-institucional/{id}")
    @ResponseBody
    public SeccionInstitucional getSeccion(@PathVariable Integer id) {
        return repositorio.findById(id).orElse(null);
    }

    @PostMapping(value = "/api/seccion-institucional/save", consumes = "application/json", produces = "application/json")
    public ResponseEntity<?> saveSeccionAsync(@Valid @RequestBody SeccionInstitucional seccion, Errors errores) {
        if (errores.hasErrors()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", "Errores de validación"));
        }
        try {
            if (Boolean.TRUE.equals(seccion.getActiva())) {
                repositorio.findByActiva(true).stream()
                        .filter(s -> !s.getId().equals(seccion.getId()))
                        .forEach(activeSeccion -> {
                            activeSeccion.setActiva(false);
                            repositorio.save(activeSeccion);
                        });
            }

            SeccionInstitucional savedSeccion = repositorio.save(seccion);
            return ResponseEntity.ok(Map.of("success", true, "message", "Sección guardada", "seccion", savedSeccion));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("success", false, "message", "Error en el servidor"));
        }
    }

    @DeleteMapping("/api/seccion-institucional/delete/{id}")
    @ResponseBody
    public ResponseEntity<?> deleteSeccion(@PathVariable Integer id) {
        repositorio.findById(id).ifPresent(repositorio::delete);
        return ResponseEntity.ok().build();
    }
}