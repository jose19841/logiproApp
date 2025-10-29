package com.logipro.orders.domain.model;

public enum EstadoPedido {
    PENDIENTE("pedido creado, esperando procesamiento"),
    EN_PROCESO("pedido en curso con el proveedor"),
    RECIBIDO("pedido recibido(impacta inventario"),
    CANCELADO("pedido cancelado por el usuario o proveedor");

    private final String descripcion;

    EstadoPedido(String descripcion) {this.descripcion = descripcion; }
    public String getDescripcion() {return descripcion; }
}
