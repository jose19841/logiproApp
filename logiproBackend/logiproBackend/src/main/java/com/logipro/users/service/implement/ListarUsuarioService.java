package com.logipro.users.service.implement;

import com.logipro.users.domain.Usuario;
import com.logipro.users.infrastructure.UsuarioRepository;
import com.logipro.users.service.usecase.ListarUsuarioUsecase;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ListarUsuarioService implements ListarUsuarioUsecase {

    private final UsuarioRepository usuarioRepository;

    @Override
    @Transactional(readOnly = true)
    public List<Usuario> listar() {
        return usuarioRepository.findAll();
    }
}
