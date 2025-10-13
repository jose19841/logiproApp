package com.logipro.supliers.application.usecase;


import com.logipro.supliers.application.dto.response.ProveedorResponseDTO;

import java.util.List;

public interface ListarProveedoresUseCase {
    List<ProveedorResponseDTO> ejecutar();
}
