package com.postforge.posteforgebackend.service;

import com.postforge.posteforgebackend.dto.AuthResponse;
import com.postforge.posteforgebackend.dto.LoginRequest;
import com.postforge.posteforgebackend.dto.RegisterRequest;
import com.postforge.posteforgebackend.entity.User;
import com.postforge.posteforgebackend.exception.EmailAlreadyExistsException;
import com.postforge.posteforgebackend.exception.EmailNotVerifiedException;
import com.postforge.posteforgebackend.exception.InvalidVerificationTokenException;
import com.postforge.posteforgebackend.repository.UserRepository;
import com.postforge.posteforgebackend.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final EmailService emailService;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new EmailAlreadyExistsException(request.email());
        }

        String verificationToken = UUID.randomUUID().toString();

        User user = User.builder()
                .email(request.email())
                .passwordHash(passwordEncoder.encode(request.password()))
                .fullName(request.fullName())
                .emailVerified(false)
                .verificationToken(verificationToken)
                .verificationTokenExpiry(LocalDateTime.now().plusHours(24))
                .build();

        userRepository.save(user);
        emailService.sendVerificationEmail(user.getEmail(), verificationToken);

        return new AuthResponse(null, user.getEmail(), user.getFullName());
    }

    public void verifyEmail(String token) {
        User user = userRepository.findByVerificationToken(token)
                .orElseThrow(() -> new InvalidVerificationTokenException("Token de vérification invalide."));

        if (user.getVerificationTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new InvalidVerificationTokenException("Le lien de vérification a expiré.");
        }

        user.setEmailVerified(true);
        user.setVerificationToken(null);
        userRepository.save(user);
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password())
        );

        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        if (!user.isEmailVerified()) {
            throw new EmailNotVerifiedException();
        }

        String token = jwtUtil.generateToken(user.getEmail());
        return new AuthResponse(token, user.getEmail(), user.getFullName());
    }
}