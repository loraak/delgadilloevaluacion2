package com.example.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.models.Usuario;
import com.example.repository.UsuarioRepository;

@Service
public class UsuarioServiceImpl implements UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Override
    public void createPasswordResetTokenForUser(Usuario user, String token) {
        user.setResetPasswordToken(token);
        usuarioRepository.save(user);
    }

    @Override
    public Usuario getUserByPasswordResetToken(String token) {
        return usuarioRepository.findByResetPasswordToken(token);
    }

    @Override
    public void changeUserPassword(Usuario user, String newPassword) {
        user.setPassword(passwordEncoder.encode(newPassword));
        user.setResetPasswordToken(null);
        usuarioRepository.save(user);
    }
}