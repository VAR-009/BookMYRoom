package com.nitc.bookmyroom.controller;

import com.nitc.bookmyroom.entity.User;
import com.nitc.bookmyroom.security.JwtUtil;
import com.nitc.bookmyroom.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final JwtUtil jwtUtil;

    public AuthController(AuthService authService, JwtUtil jwtUtil) {
        this.authService = authService;
        this.jwtUtil = jwtUtil;
    }



    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        try {
            Map<String, Object> result = authService.login(body.get("email"), body.get("password"));
            return ResponseEntity.ok(result);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> body) {
        try {
            Map<String, Object> result = authService.register(
                body.get("name"),
                body.get("email"),
                body.get("password"),
                User.Role.valueOf(body.get("role").toUpperCase())
            );
            return ResponseEntity.ok(result);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/change-password")
public ResponseEntity<?> changePassword(@RequestBody Map<String, String> body,
                                         @RequestHeader("Authorization") String authHeader) {
    try {
        String token = authHeader.replace("Bearer ", "");
        String email = jwtUtil.extractEmail(token);
        authService.changePassword(email, body.get("currentPassword"), body.get("newPassword"));
        return ResponseEntity.ok(Map.of("message", "Password changed successfully"));
    } catch (RuntimeException e) {
        return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
    }
}

}
