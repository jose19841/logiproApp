package com.logipro.shared.exceptions;

public class UserRegisterException extends RuntimeException{
    public UserRegisterException(String message) {
        super(message);
    }
    public UserRegisterException(String message, Throwable cause) {
        super(message, cause);
    }
}
