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
        key: "reclamoId",
        label: "Reclamo",
        sortable: true,
        align: "center",
        render: (value) => value ? `#${value}` : "-"
      },
      {
        key: "proveedorId",
        label: "Proveedor",
        sortable: true,
        align: "center",
        render: (value) => value ? `#${value}` : "-"
      },
      {
        key: "calidadId",
        label: "Calidad",
        sortable: true,
        align: "center",
        render: (value) => value ? `#${value}` : "-"
      },
      {
        key: "tipoMaterialId",
        label: "Tipo Material",
        sortable: true,
        align: "center",
        render: (value) => value ? `#${value}` : "-"
      },
      {
        key: "acciones",
        label: "Acciones",
        align: "end",
        render: (_, row) => (
          <div className="dropdown">
            <button
              className="btn btn-sm btn-outline-secondary border-0"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              aria-label="Acciones"
              title="Acciones"
              style={{ fontSize: '18px', lineHeight: 1 }}
            >
              ⋮
            </button>
            <ul className="dropdown-menu dropdown-menu-end shadow-sm" style={{minWidth: '200px'}}>
              <li>
                <button
                  className="dropdown-item d-flex align-items-center gap-2 py-2"
                  onClick={() => onView?.(row)}
                >
                  <i className="bi bi-eye text-primary"></i>
                  Ver detalles
                </button>
              </li>
              <li>
                <button
                  className="dropdown-item d-flex align-items-center gap-2 py-2"
                  onClick={() => onEdit?.(row)}
                >
                  <i className="bi bi-pencil text-warning"></i>
                  Editar
                </button>
              </li>

              <li><hr className="dropdown-divider" /></li>

              <li>
                <button
                  className="dropdown-item d-flex align-items-center gap-2 py-2 text-danger"
                  onClick={() => onDelete?.(row)}
                >
                  <i className="bi bi-trash"></i>
                  Eliminar
                </button>
              </li>
            </ul>
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
