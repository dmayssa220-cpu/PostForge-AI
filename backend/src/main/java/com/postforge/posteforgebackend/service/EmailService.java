package com.postforge.posteforgebackend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.base-url}")
    private String baseUrl;

    public void sendVerificationEmail(String toEmail, String token) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Vérifie ton adresse email - PostForge AI");
        message.setText(
                "Bienvenue sur PostForge AI !\n\n" +
                        "Clique sur ce lien pour vérifier ton adresse email :\n" +
                        baseUrl + "/api/v1/auth/verify?token=" + token + "\n\n" +
                        "Ce lien expire dans 24 heures."
        );
        mailSender.send(message);
    }
}