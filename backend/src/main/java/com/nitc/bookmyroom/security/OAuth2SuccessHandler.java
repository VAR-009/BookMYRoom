package com.nitc.bookmyroom.security;

import com.nitc.bookmyroom.entity.User;
import com.nitc.bookmyroom.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Optional;

@Component
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {

    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    public OAuth2SuccessHandler(JwtUtil jwtUtil, UserRepository userRepository) {
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");

        Optional<User> existingUser = userRepository.findByEmail(email);
        User user;

        if (existingUser.isEmpty()) {
            user = new User();
            user.setEmail(email);
            user.setName(name);
            user.setRole(User.Role.STUDENT);
            user.setPassword("GOOGLE_OAUTH");
            user.setFirstLogin(true);
            user.setAuthProvider(User.AuthProvider.GOOGLE);
            userRepository.save(user);
        } else {
            user = existingUser.get();
        }

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());
        String role = user.getRole().name().toLowerCase();
        boolean forceReset = user.isFirstLogin();
        String encodedName = URLEncoder.encode(user.getName(), StandardCharsets.UTF_8);
        String encodedEmail = URLEncoder.encode(user.getEmail(), StandardCharsets.UTF_8);

        String redirectUrl = "http://localhost:3000?token=" + token
                + "&role=" + role
                + "&name=" + encodedName
                + "&email=" + encodedEmail
                + "&forcePasswordReset=" + forceReset;

        response.sendRedirect(redirectUrl);
    }
}
