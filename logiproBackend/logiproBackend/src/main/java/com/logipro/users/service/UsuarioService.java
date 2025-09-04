    package com.logipro.users.service;

    import com.logipro.users.controller.dto.RegistrarUsuarioRequestDTO;
    import com.logipro.users.controller.dto.UsuarioResponseDTO;
    import com.logipro.users.domain.Usuario;
    import com.logipro.users.infrastructure.UsuarioRepository;
    import com.logipro.users.service.mapper.UsuarioMapper;
    import com.logipro.users.service.usecase.BuscarUsuarioUseCase;
    import com.logipro.users.service.usecase.RegistrarUsuarioUsecase;
    import lombok.RequiredArgsConstructor;
    import org.springframework.stereotype.Service;
    import org.springframework.transaction.annotation.Transactional;

    import java.util.Optional;

    @Service
    @RequiredArgsConstructor
    public class UsuarioService {
        private final RegistrarUsuarioUsecase registrarUsuarioUsecase;
        private final BuscarUsuarioUseCase buscarUsuarioUseCase;
        private final UsuarioMapper usuarioMapper;
        private final UsuarioRepository usuarioRepository;

        @Transactional // porque guarda en la bd
        public UsuarioResponseDTO registrar (RegistrarUsuarioRequestDTO dto){
            Usuario u = registrarUsuarioUsecase.registrar(dto.getUsuario(), dto.getClave(), dto.getRol());
            return usuarioMapper.toResponse(u);
        }
        public Optional<UsuarioResponseDTO> buscarPorUsuario(String username) {
            return buscarUsuarioUseCase.buscar(username)
                    .map(usuarioMapper::toResponse);
        }
        // busqueda por id
        public Optional<UsuarioResponseDTO> buscarPorId(Long id){
            return usuarioRepository.findById(id)
                    .map(usuarioMapper::toResponse);
        }
    }
