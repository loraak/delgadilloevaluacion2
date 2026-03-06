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
        model.addAttribute("ofertas", ofertasRepositorio.findAll());
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

    @PostMapping(value = "/api/perfil/save", consumes = "application/json", produces = "application/json")
    public ResponseEntity<?> savePerfilAsync(@Valid @RequestBody PerfilDeIngreso perfilDeIngreso, Errors errores) { 
        if (errores.hasErrors()) { 
            return ResponseEntity.badRequest()
                .body(java.util.Map.of("success", false, "message", "Errores de validación en los campos del perfil")); 
        }

        try { 
            //  Validación de oferta educativa
            if (perfilDeIngreso.getOfertaEducativa() != null) { 
                Integer ofertaId = perfilDeIngreso.getOfertaEducativa().getId(); 

                repositorio.findByOfertaEducativaId(ofertaId).ifPresent(existente -> { 
                    if (!existente.getId().equals(perfilDeIngreso.getId())){
                        throw new IllegalArgumentException("Esta oferta ya tiene un perfil asignado"); 
                    }
                }); 
            }

            PerfilDeIngreso savedPerfil = repositorio.save(perfilDeIngreso);
            return ResponseEntity.ok(java.util.Map.of("success", true, "message", "Perfil de ingreso guardado", "perfil", savedPerfil)); 

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                .body(Map.of("success", false, "message", e.getMessage()));
        } catch (Exception e) { 
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(java.util.Map.of("success", false, "message", "Error en el servidor")); 
        }
    }


    //  El if present es para saber si hay algo, si no simplemente no hace nada en la base de datos. Si el perfil existe, se lo pasa al delete del repositorio. 
    @DeleteMapping("/api/perfil/delete/{id}")
    @ResponseBody
    public ResponseEntity<?> deletePerfil(@PathVariable Integer id) { 
        Optional<PerfilDeIngreso> perfilOpt = repositorio.findById(id);
        
        if (perfilOpt.isPresent()) {
            PerfilDeIngreso perfil = perfilOpt.get();
            
            if (perfil.getOfertaEducativa() != null) {
                perfil.getOfertaEducativa().setPerfilDeIngreso(null);
            }
            
            repositorio.delete(perfil);
            return ResponseEntity.ok().build(); 
        }
        
        return ResponseEntity.notFound().build(); 
    }
}
