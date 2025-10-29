package com.logipro.orders.application.service;


import com.logipro.orders.application.dto.request.FiltroPedidosRequestDTO;
import com.logipro.orders.application.dto.response.PedidoResponseDTO;
import com.logipro.orders.application.mapper.PedidoMapper;
import com.logipro.orders.application.usecase.ListarPedidosUseCase;
import com.logipro.orders.domain.model.EstadoPedido;
import com.logipro.orders.domain.model.Pedido;
import com.logipro.orders.domain.repository.PedidoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.repository.query.QueryLookupStrategy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.Objects;
import java.util.function.Function;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ListarPedidosService implements ListarPedidosUseCase {

    private final PedidoRepository pedidoRepository;
    private final PedidoMapper pedidoMapper;


    @Override
    public List<PedidoResponseDTO> ejecutar(FiltroPedidosRequestDTO filtros, int page, int size, String sortBy, String sortDir) {
        // 1) Traer todo (fuente).  filtramos en memoria.
        List<Pedido> source = pedidoRepository.findAll();

        // 2) Filtros
        List<Pedido> filtrados = source.stream()
                .filter(p -> filtroProveedor(p,filtros))
                .filter(p -> filtroUsuario(p,filtros))
                .filter(p -> filtroNumero(p,filtros))
                .filter(p -> filtroEstado(p,filtros))
                .filter(p -> filtroFechas(p,filtros))
                .filter(p -> filtroMateriales(p,filtros ))
                        .toList();

        // 3) Orden
        Comparator<Pedido> comparator = buildComparator(sortBy, sortDir);
        if (comparator != null) {
            filtrados = filtrados.stream().sorted(comparator).toList();
        }

        // 4) Paginado simple (coherente con otros módulos sin PageRequest)
        int pageSafe = Math.max(0, page);
        int sizeSafe = Math.max(0, size);
        int from = Math.min(pageSafe * sizeSafe, filtrados.size());
        int to = Math.min(from + sizeSafe, filtrados.size());
        List<Pedido> slice = filtrados.subList(from, to);

        return slice.stream().map(pedidoMapper::toResponseDTO).toList();

    }
    /* ===================== Filtros ===================== */
    private boolean filtroProveedor(Pedido p, FiltroPedidosRequestDTO f) {
        if (f == null || f.getProveedorId() == null) return true;
        return p.getProveedor() != null && Objects.equals(p.getProveedor().getId(), f.getProveedorId());
    }

    private boolean filtroUsuario(Pedido p, FiltroPedidosRequestDTO f) {
        if(f == null || f.getUsuarioId() == null) return true;
        return p.getUsuarioCreador() != null && Objects.equals(p.getUsuarioCreador().getId(), f.getUsuarioId());
    }

    private boolean filtroNumero(Pedido p, FiltroPedidosRequestDTO f) {
        if (f == null || f.getNumeroPedido() == null || f.getNumeroPedido().isBlank()) return true;
        return f.getNumeroPedido().trim().equalsIgnoreCase(nullSafe(p.getNumeroPedido()));
    }

    private boolean filtroEstado (Pedido p, FiltroPedidosRequestDTO f) {
        if (f == null || f.getEstado() == null || f.getEstado().isBlank()) return true;
        try {
            EstadoPedido estado = EstadoPedido.valueOf(f.getEstado().trim().toUpperCase(Locale.ROOT));
            return p.getEstado() == estado;
        } catch (IllegalArgumentException ex) {
            return  true;
        }
    }

    private boolean filtroFechas(Pedido p , FiltroPedidosRequestDTO f) {
        if (f == null) return true;
        LocalDate d = f.getFechaDesde();
        LocalDate h = f.getFechaHasta();
        LocalDate fp = p.getFechaPedido();
        if (fp == null) return false;
        if (d != null && fp.isBefore(d)) return false;
        if (h != null && fp.isAfter(h)) return false;
        return true;
    }

    private boolean filtroMateriales (Pedido p, FiltroPedidosRequestDTO f) {
        if (f == null || f.getMaterialId() == null) return true;
        return p.getDetalles() != null && p.getDetalles().stream()
                .anyMatch(d -> d.getMaterial() != null && Objects.equals(d.getMaterial().getId(), f.getMaterialId()));
    }

    private String nullSafe(String s) {return s== null ? "" : s; }

    /* ===================== Orden ===================== */
    private Comparator<Pedido> buildComparator(String sortBy, String sortDir) {
        boolean asc = !"desc".equalsIgnoreCase(sortDir);
        Function<Pedido, Comparable<?>> Key = KeyFor(sortBy);
        if (Key == null ) return null;

        Comparator<Pedido> cmp = Comparator.comparing(
                p -> {
                    Comparable<?> K = Key.apply(p);
                    return K == null ? "" : K;
                },
                (a, b) -> {
                    if (a == null && b == null) return 0;
                    if (a == null) return -1;
                    if ( b == null) return 1;
                    @SuppressWarnings("unchecked") Comparable<Object> c1 = (Comparable<Object>) a;
                    return c1.compareTo(b);
                }
        );
        return asc ? cmp : cmp.reversed();
    }

    private Function<Pedido, Comparable<?>> KeyFor (String sortBy) {
        if (sortBy == null || sortBy.isBlank()) return Pedido::getId;
        return switch (sortBy) {
            case "id" -> Pedido::getId;
            case  "numeroPedido" -> Pedido::getNumeroPedido;
            case "fechaPedido" -> Pedido::getFechaPedido;
            case "fechaEntregaEstimada" -> Pedido::getFechaEntregaEstimada;
            case "fechaEntregaReal" -> Pedido::getFechaEntregaReal;
            case "estado" -> p -> (p.getProveedor() != null ? p.getProveedor().getNombre() : null);
            default -> Pedido::getId;
        };
    }

}
