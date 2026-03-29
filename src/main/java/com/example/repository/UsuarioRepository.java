package com.example.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.models.Usuario;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Usuario findByUsername(String username);
    Usuario findByResetPasswordToken(String token);
    Usuario findByEmail(String email);
}