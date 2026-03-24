package com.example.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;

import com.example.service.EmailService;

import com.example.dto.EmailDTO;

@Controller
public class EmailController {
    @Autowired
    private EmailService emailService;
    
    @GetMapping("/email/form")
    public String form(Model model, EmailDTO emailDTO) { 
        model.addAttribute("emailDTO", emailDTO); 
        return "emailForm"; 
    }

    @PostMapping("/email/enviar")
    public String page(@ModelAttribute EmailDTO emailDTO) { 
        try { 
            emailDTO.setAsunto("Recuperación de Contraseña");
            emailDTO.setMensaje("Este es un correo para recuperar tu contraseña. Por favor, haz clic en el siguiente enlace.");
            emailService.enviarHtmlEmail(emailDTO); 
        } catch (Exception e) { 
            System.out.println("Error al enviar correo: " + e.getMessage());
        }
        return "redirect:/login"; 
    }
}
