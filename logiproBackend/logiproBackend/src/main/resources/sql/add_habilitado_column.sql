-- Script para agregar columna 'habilitado' a la tabla proveedor

-- 1. Agregar la columna habilitado (si no existe)
ALTER TABLE proveedor
ADD COLUMN IF NOT EXISTS habilitado BOOLEAN NOT NULL DEFAULT TRUE;

-- 2. Actualizar todos los proveedores existentes para que estén habilitados
UPDATE proveedor
SET habilitado = TRUE
WHERE habilitado IS NULL OR habilitado = FALSE;

-- 3. Verificar los cambios
SELECT id_proveedor, nombre, habilitado FROM proveedor;
