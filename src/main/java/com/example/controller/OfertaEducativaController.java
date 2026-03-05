package com.example.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import com.example.repository.DivisionRepository;
import com.example.repository.OfertaEducativaRepository;
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
}
