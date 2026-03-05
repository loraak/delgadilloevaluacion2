package com.example.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.Errors;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;

import com.example.models.PerfilDeIngreso;
import com.example.repository.OfertaEducativaRepository;
import com.example.repository.PerfildeIngresoRepository;

import jakarta.validation.Valid;

@Controller
public class PerfilDeIngresoController {
    @Autowired
    private PerfildeIngresoRepository repositorio; 

    @Autowired
    private OfertaEducativaRepository ofertasRepositorio; 

    @GetMapping("/perfiles-ingreso")
    public String perfilesIngreso (Model model) { 
        model.addAttribute("title", "Perfiles de Ingreso"); 
        List<PerfilDeIngreso> perfiles = repositorio.findAll(); 
        model.addAttribute("perfiles", perfiles);
        return "perfilesIngreso"; 
    }

    @GetMapping("/admin/perfiles-ingreso")
    public String perfilesIngresoAdmin (Model model) { 
        model.addAttribute("title", "Perfiles de Ingreso"); 
        List<PerfilDeIngreso> perfiles = repositorio.findAll(); 
        model.addAttribute("perfiles", perfiles);
        model.addAttribute("ofertas", ofertasRepositorio.findAll()); 
        return "perfilesIngresoAdmin";
    }
    
    @GetMapping("/api/perfiles/{id}")
    @ResponseBody
    public PerfilDeIngreso getPerfil(@PathVariable Long id) { 
        return repositorio.findById(id).orElse(null); 
    }

    @PostMapping(value = "/api/peril/save", consumes = "application/json", produces = "application/json")
    public ResponseEntity<?> savePerfilAsync(@Valid @RequestBody PerfilDeIngreso perfilDeIngreso, Errors errores) { 
        if (errores.hasErrors()) { 
            return ResponseEntity.badRequest()
                .body(java.util.Map.of("success", false, "message", "Errores de validación en los campos del perfil")); 
        }

        try { 
            PerfilDeIngreso savedPerfil = repositorio.save(perfilDeIngreso);

            return ResponseEntity.ok(java.util.Map.of("success", true, "message", "Perfil de ingreso guardado", "perfil", savedPerfil)); 
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(java.util.Map.of("success", false, "message", "Error en el servidor")); 
        }
    }
}
