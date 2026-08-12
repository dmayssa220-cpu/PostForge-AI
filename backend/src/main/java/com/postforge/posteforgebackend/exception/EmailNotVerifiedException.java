package com.postforge.posteforgebackend.exception;

public class EmailNotVerifiedException extends RuntimeException {
    public EmailNotVerifiedException() {
        super("Merci de vérifier ton adresse email avant de te connecter.");
    }
}