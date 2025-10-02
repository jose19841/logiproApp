package com.logipro.users.application.service;

import com.logipro.users.domain.model.Usuario;
import com.logipro.users.domain.repository.UsuarioRepository;
import com.logipro.users.application.usecase.ListarUsuarioUsecase;
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
