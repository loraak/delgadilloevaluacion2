package com.example.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
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
    public UserDetailsService userDetailsService() {
        InMemoryUserDetailsManager manager = new InMemoryUserDetailsManager();
        manager.createUser(User.withUsername("user")
            .password(passwordEncoder().encode("123456"))
            .roles("USER").build());
        manager.createUser(User.withUsername("admin")
            .password(passwordEncoder().encode("admin"))
            .roles("ADMIN", "USER").build());
        manager.createUser(User.withUsername("coordinador")
            .password(passwordEncoder().encode("123456"))
            .roles("COORDINADOR", "USER").build());
        return manager;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(authz -> authz
                .requestMatchers("/", "/login", "/ofertas-educativas", "/divisiones", "/email/**", "/seccion-institucional",
                        "/perfiles-ingreso", "/perfiles-profesionales", "/plan-estudios")
                .permitAll()
                .requestMatchers("/admin/ofertas-educativas/**", "/api/seccion-institucional/**",
                        "/admin/perfiles-ingreso/**", "/api/perfiles/**", "/api/perfil/**",
                        "/admin/perfiles-profesionales/**", "/api/perfilesprofesionales/**", "/api/perfilprofesional/**",
                        "/admin/plan-estudios/**", "/api/planestudios/**")
                .hasRole("ADMIN")
                .requestMatchers("/admin/divisiones/**").hasAnyRole("ADMIN", "COORDINADOR")
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