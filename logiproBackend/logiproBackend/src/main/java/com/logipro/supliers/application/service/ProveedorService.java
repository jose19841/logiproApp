package com.logipro.supliers.application.service;

import com.logipro.supliers.application.dto.request.ActualizarProveedorRequestDTO;
import com.logipro.supliers.application.dto.request.CrearProveedorRequestDTO;
import com.logipro.supliers.application.dto.response.ProveedorResponseDTO;
import com.logipro.supliers.application.usecase.ActualizarProveedorUseCase;
import com.logipro.supliers.application.usecase.BuscarProveedorPorIdUseCase;
import com.logipro.supliers.application.usecase.CambiarEstadoProveedorUseCase;
import com.logipro.supliers.application.usecase.CrearProveedorUseCase;
import com.logipro.supliers.application.usecase.ListarProveedoresUseCase;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ProveedorService {
    private final CrearProveedorUseCase crearProveedorUseCase;
    private final ListarProveedoresUseCase listarProveedoresUseCase;
    private final ActualizarProveedorUseCase actualizarProveedorUseCase;
    private final BuscarProveedorPorIdUseCase buscarProveedorPorIdUseCase;
    private final CambiarEstadoProveedorUseCase cambiarEstadoProveedorUseCase;

    @Transactional
    public ProveedorResponseDTO crear(CrearProveedorRequestDTO dto){
        return crearProveedorUseCase.ejecutar(dto);
    }

    @Transactional(readOnly = true)
    public Optional<ProveedorResponseDTO> buscar(Long id){
        return buscarProveedorPorIdUseCase.ejecutar(id);
    }

    @Transactional(readOnly = true)
    public List<ProveedorResponseDTO> listar(){
        return listarProveedoresUseCase.ejecutar();
    }

    @Transactional
    public Optional<ProveedorResponseDTO> actualizar(Long id, ActualizarProveedorRequestDTO dto) {
        return actualizarProveedorUseCase.ejecutar(id, dto);
    }

    @Transactional
    public Optional<ProveedorResponseDTO> cambiarEstado(Long id, Boolean habilitar) {
        return cambiarEstadoProveedorUseCase.ejecutar(id, habilitar);
    }

}
