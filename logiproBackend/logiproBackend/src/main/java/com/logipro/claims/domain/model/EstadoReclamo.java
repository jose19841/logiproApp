package com.logipro.claims.domain.model;


public enum EstadoReclamo {

        PENDIENTE("El reclamo fue registrado y está pendiente de revisión"),
        EN_PROCESO("El reclamo está siendo analizado o gestionado"),
        RESUELTO("El reclamo fue resuelto exitosamente"),
        CERRADO("El reclamo fue cerrado sin resolución o fuera de tiempo");

        private final String descripcion;

        EstadoReclamo(String descripcion) {
            this.descripcion = descripcion;
        }

        public String getDescripcion() {
            return descripcion;
        }
    }

