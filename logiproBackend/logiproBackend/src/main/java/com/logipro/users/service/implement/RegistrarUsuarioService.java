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
    private final UsuarioMapper usuarioMapper;      // <-- agregado
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public void execute(RegistrarUsuarioRequestDTO request) {
        // validar username duplicado
        if (usuarioRepository.findByUsuario(request.getUsuario()).isPresent()) {
            throw new UserRegisterException(
                    "El nombre de usuario " + request.getUsuario() + " ya está registrado."
            );
        }

        // rol existente
        Rol rol = rolRepository.findByNombre(request.getRol())
                .orElseThrow(() -> new UserRegisterException("Rol no encontrado: " + request.getRol()));

        // crear entidad desde el DTO con el mapper
        Usuario user = usuarioMapper.toEntity(request);

        // encriptar y setear estado/rol
        user.setClave(passwordEncoder.encode(user.getClave()));
        user.setEstado(UserStatus.REGISTRADO);
        user.setRol(rol);

        // guardar
        usuarioRepository.save(user);
    }

    @Override
    @Transactional
    public Usuario registrar(String usuario, String clave, String nombreRol) {
        if (usuarioRepository.findByUsuario(usuario).isPresent()) {
            throw new UserRegisterException(
                    "El nombre de usuario " + usuario + " ya está registrado."
            );
        }

        Rol rol = rolRepository.findByNombre(nombreRol)
                .orElseThrow(() -> new UserRegisterException("Rol no encontrado: " + nombreRol));

        Usuario entity = Usuario.builder()
                .usuario(usuario)
                .clave(passwordEncoder.encode(clave))
                .estado(UserStatus.REGISTRADO)
                .rol(rol)
                .build();

        return usuarioRepository.save(entity);
    }
}
