package com.logipro.supliers.application.usecase;

import com.logipro.supliers.application.dto.request.CrearProveedorRequestDTO;
import com.logipro.supliers.application.dto.response.ProveedorResponseDTO;

/**
 * ========== USECASE INTERFACE: Crear Proveedor ==========
 * Contrato de aplicación para registrar un nuevo proveedor.
 */

public interface CrearProveedorUseCase {
    ProveedorResponseDTO ejecutar(CrearProveedorRequestDTO request);
}
