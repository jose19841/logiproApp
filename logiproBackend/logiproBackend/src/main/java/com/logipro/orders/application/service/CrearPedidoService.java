package com.logipro.orders.application.service;

import com.logipro.materials.domain.model.Material;
import com.logipro.materials.domain.repository.MaterialRepository;
import com.logipro.orders.application.dto.request.CrearPedidoRequestDTO;
import com.logipro.orders.application.dto.request.ItemDetalleRequestDTO;
import com.logipro.orders.application.dto.response.PedidoResponseDTO;
import com.logipro.orders.application.mapper.PedidoMapper;
import com.logipro.orders.application.usecase.CrearPedidoUseCase;
import com.logipro.orders.domain.model.DetallePedido;
import com.logipro.orders.domain.model.EstadoPedido;
import com.logipro.orders.domain.model.Pedido;
import com.logipro.orders.domain.repository.PedidoRepository;
import com.logipro.supliers.domain.model.Proveedor;
import com.logipro.supliers.domain.repository.ProveedorRepository;
import com.logipro.users.domain.model.Usuario;
import com.logipro.users.domain.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;

@Service
@Transactional
@RequiredArgsConstructor
public class CrearPedidoService implements CrearPedidoUseCase {
    private final PedidoRepository pedidoRepository;
    private final ProveedorRepository proveedorRepository;
    private final UsuarioRepository usuarioRepository;
    private final MaterialRepository materialRepository;
    private final PedidoMapper pedidoMapper;


    @Override
    public PedidoResponseDTO ejecutar(CrearPedidoRequestDTO request) {

        // 1) Cargar referencias obligatorias
        Proveedor proveedor = proveedorRepository.findById(request.getProveedorId())
                .orElseThrow(() -> new IllegalArgumentException("proveedor no encontrado: id=" + request.getProveedorId()));

        // Obtener usuario autenticado del contexto de seguridad
        Usuario usuarioCreador = obtenerUsuarioAutenticado();

        // 2) Generar número único de pedido (formato PED-YYYY-####)
        String numeroGenerado = generarNumeroPedido();

        // 3) Construir entidad raíz (fecha de pedido = hoy, sin fecha estimada)
        Pedido pedido = Pedido.builder()
                .numeroPedido(numeroGenerado)
                .proveedor(proveedor)
                .fechaPedido(LocalDate.now())
                .fechaEntregaEstimada(null)
                .estado(EstadoPedido.PENDIENTE)
                .observaciones(request.getObservaciones())
                .usuarioCreador(usuarioCreador)
                .build();

        // 4) Agregar detalles
        request.getDetalles().forEach(item -> agregarDetallePedido(pedido, item));

        // 5) Persistir (cascade guarda los detalles y @PrePersist calcula los subtotales)
        Pedido guardado = pedidoRepository.save(pedido);

        // 6) Recalcular totales después de persistir (ahora los subtotales están calculados por @PrePersist)
        guardado.recalcularTotales();
        guardado = pedidoRepository.save(guardado);

        // 7) Mapear respuesta
        return pedidoMapper.toResponseDTO(guardado);
    }
    /* ===================== Helpers ===================== */
    private void agregarDetallePedido(Pedido pedido, ItemDetalleRequestDTO item) {
        Material material = materialRepository.findById(item.getMaterialId())
                .orElseThrow(() -> new IllegalArgumentException("Material no encontrado: id=" + item.getMaterialId()));

        if (item.getCantidadSolicitada() == null || item.getCantidadSolicitada() <= 0) {
            throw new IllegalArgumentException("La cantidad solicitada debe ser mayor a 0 (materialId=" + item.getMaterialId() + ")");
        }
        if (item.getPrecioUnitario() == null || item.getPrecioUnitario().signum() < 0) {
            throw new IllegalArgumentException("El precio unitario no puede ser negativo (materialId=" + item.getMaterialId() + ")");
        }

        // Construir detalle (el subtotal se calculará en @PrePersist)
        DetallePedido detalle = new DetallePedido();
        detalle.setMaterial(material);
        detalle.setCantidadSolicitada(item.getCantidadSolicitada());
        detalle.setCantidadRecibida(null);
        detalle.setPrecioUnitario(item.getPrecioUnitario());

        pedido.agregarDetalle(detalle);
    }
    // genera un numero de pedido legible y unico
    private String generarNumeroPedido() {
        long correlativo = pedidoRepository.count() + 1;
        String year = String.valueOf(LocalDate.now().getYear());
        return String.format("PED-%s-%04d", year, correlativo);
    }

    // Obtener usuario autenticado del contexto de seguridad
    private Usuario obtenerUsuarioAutenticado() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new IllegalStateException("No hay usuario autenticado");
        }

        String username = authentication.getName();
        return usuarioRepository.findByUsuario(username)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado: " + username));
    }
}
