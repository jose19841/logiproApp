package com.logipro.users.service.implement;

import com.logipro.shared.exceptions.UserRegisterException;
import com.logipro.users.controller.dto.RegistrarUsuarioRequestDTO;
import com.logipro.users.domain.Rol;
import com.logipro.users.domain.UserStatus;
import com.logipro.users.domain.Usuario;
import com.logipro.users.infrastructure.RolRepository;
import com.logipro.users.infrastructure.UsuarioRepository;
import com.logipro.users.service.mapper.UsuarioMapper;
import com.logipro.users.service.usecase.RegistrarUsuarioUsecase;
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
