package com.nitc.bookmyroom.service;

import com.nitc.bookmyroom.entity.User;
import com.nitc.bookmyroom.repository.UserRepository;
import com.nitc.bookmyroom.security.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Map;
import java.util.Optional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    public Map<String, Object> login(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        if (!user.isActive()) {
            throw new RuntimeException("Account is deactivated");
        }

        String token = jwtUtil.generateToken(email, user.getRole().name());
        return Map.of(
            "token", token,
            "role", user.getRole().name().toLowerCase(),
            "name", user.getName(),
            "email", user.getEmail()
        );
    }

    public Map<String, Object> register(String name, String email, String password, User.Role role) {
        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email already registered");
        }

        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setRole(role);
        user.setAuthProvider(User.AuthProvider.LOCAL);
        userRepository.save(user);

        String token = jwtUtil.generateToken(email, role.name());
        return Map.of(
            "token", token,
            "role", role.name().toLowerCase(),
            "name", name,
            "email", email
        );
    }

    public User getOrCreateGoogleUser(String email, String name) {
        Optional<User> existing = userRepository.findByEmail(email);
        if (existing.isPresent()) return existing.get();

        User user = new User();
        user.setEmail(email);
        user.setName(name);
        user.setRole(User.Role.STUDENT);
        user.setAuthProvider(User.AuthProvider.GOOGLE);
        return userRepository.save(user);
    }

    public void changePassword(String email, String currentPassword, String newPassword) {
    User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));

    // Skip current password check for first-time Google login
    if (currentPassword != null && !currentPassword.equals("null")) {
        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new RuntimeException("Current password is incorrect");
        }
    }

    user.setPassword(passwordEncoder.encode(newPassword));
    user.setFirstLogin(false);
    userRepository.save(user);
}

}
