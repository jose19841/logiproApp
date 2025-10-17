// src/features/materials/components/MaterialList.jsx
import { useMemo } from "react";
import DataTable from "@shared/components/DataTable";

/**
 * Componente de tabla para listar materiales
 * @param {Array} data - Array de materiales
 * @param {Boolean} loading - Estado de carga
 * @param {String} error - Mensaje de error
 * @param {Function} onView - Callback al ver detalles
 * @param {Function} onEdit - Callback al editar
 * @param {Function} onDelete - Callback al eliminar
 */
export default function MaterialList({ data = [], loading = false, error = "", onView, onEdit, onDelete }) {
  const columns = useMemo(
    () => [
      {
        key: "id",
        label: "ID",
        sortable: true,
        align: "center",
        render: (value) => (
          <code className="bg-light px-2 py-1 rounded">{value}</code>
        )
      },
      {
        key: "cantidad",
        label: "Cantidad",
        sortable: true,
        align: "center",
        render: (value) => (
          <span className="fw-semibold">{value ?? "-"}</span>
        )
      },
      {
        key: "fechaCreacion",
        label: "Fecha de Registro",
        sortable: true,
        align: "center",
        render: (value) => value ? new Date(value).toLocaleDateString('es-AR', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        }) : "-"
      },
      {
        key: "proveedorDescripcion",
        label: "Proveedor",
        sortable: true,
        align: "left",
        render: (value) => value || "-"
      },
      {
        key: "resultadoCalidad",
        label: "Calidad",
        sortable: true,
        align: "center",
        render: (value) => {
          if (!value) return "-";
          const badgeClass = value === "Bueno" ? "success" : value === "Regular" ? "warning" : "danger";
          return <span className={`badge bg-${badgeClass}`}>{value}</span>;
        }
      },
      {
        key: "nombreTipoMaterial",
        label: "Tipo Material",
        sortable: true,
        align: "left",
        render: (value) => value || "-"
      },
      {
        key: "acciones",
        label: "Acciones",
        align: "center",
        render: (_, row) => (
          <div className="btn-group btn-group-sm" role="group">
            <button
              className="btn btn-outline-primary"
              onClick={() => onView?.(row)}
              title="Ver detalle"
            >
              <i className="bi bi-eye"></i>
            </button>
            <button
              className="btn btn-outline-warning"
              onClick={() => onEdit?.(row)}
              title="Editar"
            >
              <i className="bi bi-pencil"></i>
            </button>
            <button
              className="btn btn-outline-danger"
              onClick={() => onDelete?.(row)}
              title="Eliminar"
            >
              <i className="bi bi-trash"></i>
            </button>
          </div>
        ),
      },
    ],
    [onView, onEdit, onDelete]
  );

  return (
    <DataTable
      columns={columns}
      data={data}
      loading={loading}
      error={error}
      emptyMessage="No hay materiales registrados."
      rowKey="id"
    />
  );
}
