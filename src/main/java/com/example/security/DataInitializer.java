package com.example.security;

import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import com.example.models.Rol;
import com.example.models.Usuario;
import com.example.repository.RolRepository;
import com.example.repository.UsuarioRepository;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private RolRepository rolRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {

        Rol rolAdmin = createRoleIfNotFound("ROLE_ADMIN");
        Rol rolUser = createRoleIfNotFound("ROLE_USER");
        Rol rolCoordinador = createRoleIfNotFound("ROLE_COORDINADOR");
        Rol rolSecretaria = createRoleIfNotFound("ROLE_SECRETARIA");
        Rol rolRector = createRoleIfNotFound("ROLE_RECTOR");

        createUserIfNotFound("user", "caradeowo@gmail.com", "123456", Arrays.asList(rolUser));
        createUserIfNotFound("admin", "lmaolorak@gmail.com", "admin", Arrays.asList(rolAdmin, rolUser));
        createUserIfNotFound("coordinador", "caradeowo@gmail2.com", "123456", Arrays.asList(rolCoordinador, rolUser));
        createUserIfNotFound("secretaria", "caradeowo@gmail3.com", "secretaria", Arrays.asList(rolSecretaria, rolUser));
        createUserIfNotFound("rector", "caradeowo@gmail4.com", "rector", Arrays.asList(rolRector, rolUser));
    }

    private Rol createRoleIfNotFound(String name) {
        Rol rol = rolRepository.findByNombre(name);
        if (rol == null) {
            rol = new Rol();
            rol.setNombre(name);
            rolRepository.save(rol);
        }
        return rol;
    }

    private void createUserIfNotFound(String username, String email, String password, java.util.List<Rol> roles) {
        if (usuarioRepository.findByUsername(username) == null) {
            Usuario user = new Usuario();
            user.setUsername(username);
            user.setEmail(email);
            user.setPassword(passwordEncoder.encode(password));
            user.setRoles(roles);
            user.setEnabled(true);
            usuarioRepository.save(user);
        }
    }
}