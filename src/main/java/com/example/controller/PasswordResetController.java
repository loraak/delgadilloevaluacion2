package com.example.controller;

import java.util.UUID;
import java.util.concurrent.ThreadLocalRandom;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.example.dto.EmailDTO;
import com.example.models.Usuario;
import com.example.repository.UsuarioRepository;
import com.example.service.EmailService;
import com.example.service.UsuarioService;

import jakarta.servlet.http.HttpServletRequest;

@Controller
public class PasswordResetController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private EmailService emailService;

    @GetMapping("/forgot-password")
    public String showForgotPasswordForm() {
        return "forgot-password";
    }

    @PostMapping("/forgot-password")
    public String processForgotPassword(@RequestParam("email") String email, HttpServletRequest request, RedirectAttributes redirectAttributes) {
        Usuario user = usuarioRepository.findByEmail(email);
        if (user == null) {
            redirectAttributes.addFlashAttribute("error", "No existe un usuario con ese correo electrónico.");
            return "redirect:/forgot-password";
        }

        String code = String.format("%06d", ThreadLocalRandom.current().nextInt(0, 1000000));
        usuarioService.createPasswordResetTokenForUser(user, code);

        EmailDTO emailDto = new EmailDTO();
        emailDto.setDestinatario(user.getEmail());
        emailDto.setAsunto("Código de Restablecimiento de Contraseña");
        emailDto.setMensaje("Usa el siguiente código para restablecer tu contraseña. Si no solicitaste esto, puedes ignorar este correo.");
        emailDto.setCodigo(code);
        
        try {
            emailService.enviarHtmlEmail(emailDto);
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", "Error al enviar el correo. Inténtalo de nuevo.");
            return "redirect:/forgot-password";
        }

        redirectAttributes.addFlashAttribute("message", "Se ha enviado un correo con el código para restablecer tu contraseña.");
        redirectAttributes.addAttribute("email", email);
        return "redirect:/verify-code";
    }

    @GetMapping("/reset-password")
    public String showResetPasswordForm(@RequestParam("token") String token, Model model, RedirectAttributes redirectAttributes) {
        Usuario user = usuarioService.getUserByPasswordResetToken(token);
        if (user == null) {
            redirectAttributes.addFlashAttribute("error", "El enlace de restablecimiento es inválido o ha expirado.");
            return "redirect:/login";
        }
        model.addAttribute("token", token);
        return "reset-password";
    }

    @GetMapping("/verify-code")
    public String showVerifyCodeForm(@RequestParam("email") String email, Model model) {
        model.addAttribute("email", email);
        return "verify-code";
    }

    @PostMapping("/verify-code")
    public String processVerifyCode(@RequestParam("email") String email, @RequestParam("code") String code, RedirectAttributes redirectAttributes) {
        Usuario user = usuarioRepository.findByEmail(email);
        if (user == null || user.getResetPasswordToken() == null || !user.getResetPasswordToken().equals(code)) {
            redirectAttributes.addFlashAttribute("error", "El código es incorrecto o ha expirado.");
            redirectAttributes.addAttribute("email", email);
            return "redirect:/verify-code";
        }

        String token = UUID.randomUUID().toString();
        usuarioService.createPasswordResetTokenForUser(user, token);

        return "redirect:/reset-password?token=" + token;
    }



    @PostMapping("/reset-password")
    public String processResetPassword(@RequestParam("token") String token, @RequestParam("password") String newPassword, @RequestParam("confirmPassword") String confirmPassword, RedirectAttributes redirectAttributes) {
        if (!newPassword.equals(confirmPassword)) {
            redirectAttributes.addFlashAttribute("error", "Las contraseñas no coinciden.");
            return "redirect:/reset-password?token=" + token;
        }

        Usuario user = usuarioService.getUserByPasswordResetToken(token);
        if (user == null) {
            redirectAttributes.addFlashAttribute("error", "El enlace de restablecimiento es inválido o ha expirado.");
            return "redirect:/login";
        }

        usuarioService.changeUserPassword(user, newPassword);
        redirectAttributes.addFlashAttribute("message", "Tu contraseña ha sido cambiada exitosamente.");
        return "redirect:/login";
    }
}