package com.example.service;

import com.example.models.Usuario;


// Se crea uno nuevo para ser reutilizado en otros servicios. 
public interface UsuarioService {
    void createPasswordResetTokenForUser(Usuario user, String token);
    Usuario getUserByPasswordResetToken(String token);
    void changeUserPassword(Usuario user, String newPassword);
}