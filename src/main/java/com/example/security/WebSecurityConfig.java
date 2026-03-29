package com.example.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.thymeleaf.extras.springsecurity6.dialect.SpringSecurityDialect;

@Configuration
@EnableWebSecurity
public class WebSecurityConfig implements WebMvcConfigurer {
    @Override
    public void addViewControllers(ViewControllerRegistry registro){
        registro.addViewController("/login").setViewName("login");
    }

    @Bean
    public SpringSecurityDialect springSecurityDialect() {
        return new SpringSecurityDialect();
    }

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(authz -> authz
                .requestMatchers("/", "/login", "/forgot-password", "/reset-password", "/verify-code", 
                        "/email/**")
                .permitAll()
                .requestMatchers("/admin/ofertas-educativas/**", "/admin/seccion-institucional/**", "/api/seccion-institucional/**",
                        "/api/perfil/**",
                        "/api/perfilesprofesionales/**", "/api/perfilprofesional/**",
                        "/api/planestudios/**")
                .hasAnyRole("ADMIN", "RECTOR")
                .requestMatchers("/api/divisiones/**", "/api/division/**", "/api/perfilesprofesionales/**", "/api/perfilprofesional/**", "/api/perfiles/**").hasAnyRole("ADMIN", "COORDINADOR", "SECRETARIA", "RECTOR")
                .anyRequest().authenticated()
            )
            .formLogin((form) -> form
                .loginPage("/login")
                .permitAll()
                )
                .logout((logout) -> logout.permitAll());

        return http.build();
    }
}