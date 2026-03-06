package com.example.controller;

import java.util.List;
import java.util.Map;
import java.util.Optional;

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

import com.example.models.PerfilProfesional;
import com.example.repository.OfertaEducativaRepository;
import com.example.repository.PerfilProfesionalRepository;

import jakarta.validation.Valid;

@Controller
public class PerfilProfesionalController {
    @Autowired
    private PerfilProfesionalRepository repositorio; 

    @Autowired
    private OfertaEducativaRepository ofertasRepositorio; 

    @GetMapping("/perfiles-profesionales")
    public String perfilesProfesionales (Model model) { 
        model.addAttribute("title", "Perfiles Profesionales"); 
        List<PerfilProfesional> perfiles = repositorio.findAll(); 
        model.addAttribute("perfiles", perfiles); 
        model.addAttribute("ofertas", ofertasRepositorio.findAll());
        return "perfilesProfesionales"; 
    }

    @GetMapping("/admin/perfiles-profesionales")
    public String perfilesProfesionalesAdmin (Model model) { 
        model.addAttribute("title", "Perfiles Profesionales"); 
        List<PerfilProfesional> perfiles = repositorio.findAll(); 
        model.addAttribute("perfiles", perfiles); 
        model.addAttribute("ofertas", ofertasRepositorio.findAll());
        return "perfilesProfesionalesAdmin"; 
    }

    @GetMapping("/api/perfilesprofesionales/{id}")
    @ResponseBody
    public PerfilProfesional getPerfilProfesional(@PathVariable Long id) { 
        return repositorio.findById(id).orElse(null); 
    }

    @PostMapping(value = "/api/perfilprofesional/save", consumes = "application/json", produces ="application/json")
    public ResponseEntity<?> savePerfilProfesionalAsync(@Valid @RequestBody PerfilProfesional perfilProfesional, Errors errores) {
        if (errores.hasErrors()) {
            return ResponseEntity.badRequest()
                .body(java.util.Map.of("success", false, "message", "Errores de validación en los campos del perfil")); 
        }
        try {
            if (perfilProfesional.getOfertaEducativa() != null) { 
                Integer ofertaId = perfilProfesional.getOfertaEducativa().getId(); 

                repositorio.findByOfertaEducativaId(ofertaId).ifPresent(existente -> { 
                    if (!existente.getId().equals(perfilProfesional.getId())) {
                        throw new IllegalArgumentException("Esta oferta ya tiene un perfil profesional asignado");
                    }
                });
            }

            PerfilProfesional savedPerfil = repositorio.save(perfilProfesional);
            return ResponseEntity.ok(java.util.Map.of("success", true, "message", "Perfil profesional guardado", "perfil", savedPerfil)); 
        } catch (IllegalArgumentException e ) { 
            return ResponseEntity.badRequest()
                .body(Map.of("success", false, "message", e.getMessage()));
        } catch (Exception e) { 
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(java.util.Map.of("success", false, "message", "Error en el servidor")); 
        }
    }

    @DeleteMapping("/api/perfilprofesional/delete/{id}")
    @ResponseBody
    public ResponseEntity<?> deletePerfil(@PathVariable Integer id) { 
        Optional<PerfilProfesional> perfilOpt = repositorio.findById(id);
        
        if (perfilOpt.isPresent()) {
            PerfilProfesional perfil = perfilOpt.get();
            
            if (perfil.getOfertaEducativa() != null) {
                perfil.getOfertaEducativa().setPerfilProfesional(null);
            }
            
            repositorio.delete(perfil);
            return ResponseEntity.ok().build(); 
        }
        
        return ResponseEntity.notFound().build(); 
    }


}
