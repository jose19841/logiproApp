package com.logipro.users.application.service;

import com.logipro.shared.exceptions.UserRegisterException;
import com.logipro.users.application.dto.request.RegistrarUsuarioRequestDTO;
import com.logipro.users.domain.model.Rol;
import com.logipro.users.domain.model.UserStatus;
import com.logipro.users.domain.model.Usuario;
import com.logipro.users.domain.repository.RolRepository;
import com.logipro.users.domain.repository.UsuarioRepository;
import com.logipro.users.application.mapper.UsuarioMapper;
import com.logipro.users.application.usecase.RegistrarUsuarioUsecase;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class RegistrarUsuarioService implements RegistrarUsuarioUsecase {

    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;
    private final UsuarioMapper usuarioMapper;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public Usuario registrar(RegistrarUsuarioRequestDTO request) {
        // validar duplicado
        if (usuarioRepository.findByUsuario(request.getUsuario()).isPresent()) {
            throw new UserRegisterException(
                    "El nombre de usuario " + request.getUsuario() + " ya está registrado."
            );
        }

        // validar rol
        Rol rol = rolRepository.findByNombre(request.getRol())
                .orElseThrow(() -> new UserRegisterException("Rol no encontrado: " + request.getRol()));

        // mapear DTO -> entidad
        Usuario user = usuarioMapper.toEntity(request);

        // encriptar clave del request y setear valores obligatorios
        user.setClave(passwordEncoder.encode(request.getClave()));
        user.setEstado(UserStatus.REGISTRADO);
        user.setRol(rol);

        // persistir
        return usuarioRepository.save(user);
    }
}
