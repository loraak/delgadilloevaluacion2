package com.example.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import com.example.repository.DivisionRepository;

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
}
