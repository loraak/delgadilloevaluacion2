package com.example.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import com.example.dto.EmailDTO;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {
    @Autowired
    private JavaMailSender mailSender; 

    @Autowired
    private TemplateEngine templateEngine; 

    @Value("${spring.mail.username}")
    private String sender; 

    public void enviarHtmlEmail(EmailDTO dto) throws MessagingException { 
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        Context context = new Context();
        context.setVariable("nombre", dto.getAsunto());
        context.setVariable("mensaje", dto.getMensaje());
        context.setVariable("codigo", (int) (Math.random() * 99999));

        String htmlContent = templateEngine.process("email-template", context);

        helper.setFrom(sender);
        helper.setTo(dto.getDestinatario());
        helper.setSubject(dto.getAsunto());
        helper.setText(htmlContent, true);

        mailSender.send(message);
    }
}
