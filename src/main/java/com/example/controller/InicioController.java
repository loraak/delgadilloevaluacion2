package com.example.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.validation.Errors;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;
import com.example.models.Division;
import com.example.models.OfertaEducativa;
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

    //Admin
    @GetMapping("/admin/oferta-educativa/add")
    public String getFormulario(Model model, OfertaEducativa ofertaEducativa) { 
        model.addAttribute("ofertaEducativa", ofertaEducativa);
        model.addAttribute("divisiones", divisionrepo.findAll());
        return "ofertaEducativaForm"; 
    }

    @GetMapping("/admin/oferta-educativa/edit/{id}")
    public String getFormularioEditar(Model model, @PathVariable Long id) { 
        OfertaEducativa ofertaEducativa = repo.findById(id).orElse(null);
        model.addAttribute("ofertaEducativa", ofertaEducativa);
        model.addAttribute("divisiones", divisionrepo.findAll());
        return "ofertaEducativaForm"; 
    }

    @PostMapping("/admin/oferta-educativa/save")
    public String postMethodName(@Valid OfertaEducativa ofertaEducativa, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return "ofertaEducativaForm";
        }
        repo.save(ofertaEducativa);
        return "redirect:/admin/ofertas-educativas";
    }

    @GetMapping("/api/ofertas/{id}")
    @ResponseBody
    public OfertaEducativa getOferta(@PathVariable Long id) {
        return repo.findById(id).orElse(null);
    }

    @PostMapping(value = "/api/oferta/save", consumes = "application/json", produces = "application/json")
    public ResponseEntity<?> saveOfertaAsync(@Valid @RequestBody OfertaEducativa ofertaEducativa, Errors errores) {
        if (errores.hasErrors()) {
            return ResponseEntity.badRequest()
                .body(java.util.Map.of("success", false, "message", "Errores de validación"));
        }

        try {
            OfertaEducativa savedOferta = repo.save(ofertaEducativa);
            return ResponseEntity.ok(java.util.Map.of(
                "success", true,
                "message", "Oferta guardada correctamente",
                "oferta", savedOferta
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(java.util.Map.of("success", false, "message", "Error al guardar la oferta"));
        }
    }

    @PostMapping("/admin/oferta-educativa/delete/{id}")
    public String deleteOfertaEducativa(@PathVariable Long id) {
        repo.findById(id).ifPresent(repo::delete);
        return "redirect:/admin/ofertas-educativas";
    }

    @GetMapping("/admin/divisiones")
    public String divisionesAdmin (Model model) { 
        model.addAttribute("title", "Divisiones");  
        model.addAttribute("divisiones", divisionrepo.findAll());
        if (!model.containsAttribute("division")) {
            model.addAttribute("division", new Division());
        }
        return "divisiones"; 
    }

    
    /*
    @PostMapping("/admin/divisiones/save")
    public String saveDivision(@Valid Division division, BindingResult bindingResult, Model model) {
        if (bindingResult.hasErrors()) {
            model.addAttribute("showModal", true);
            model.addAttribute("divisiones", divisionrepo.findAll());
            return "divisiones";
        }
        divisionrepo.save(division);
        return "redirect:/admin/divisiones";
    }
    */

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