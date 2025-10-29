// src/features/orders/components/OrderList.jsx
import { useMemo } from "react";
import DataTable from "@shared/components/DataTable";

/**
 * Componente de tabla para listar pedidos
 * @param {Array} data - Array de pedidos
 * @param {Boolean} loading - Estado de carga
 * @param {String} error - Mensaje de error
 * @param {Function} onView - Callback al ver detalles
 * @param {Function} onEdit - Callback al editar
 * @param {Function} onDelete - Callback al eliminar
 * @param {Function} onChangeStatus - Callback al cambiar estado
 */
export default function OrderList({ data = [], loading = false, error = "", onView, onEdit, onDelete, onChangeStatus }) {
  const columns = useMemo(
    () => [
      {
        key: "numeroPedido",
        label: "Número Pedido",
        sortable: true,
        align: "left",
        render: (value) => (
          <span className="fw-semibold">{value || "-"}</span>
        )
      },
      {
        key: "proveedorNombre",
        label: "Proveedor",
        sortable: true,
        align: "left",
        render: (value) => value || "-"
      },
      {
        key: "fechaPedido",
        label: "Fecha Pedido",
        sortable: true,
        align: "center",
        render: (value) => value ? new Date(value).toLocaleDateString('es-AR', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        }) : "-"
      },
      {
        key: "usuarioNombre",
        label: "Usuario Creador",
        sortable: true,
        align: "left",
        render: (value) => value || "-"
      },
      {
        key: "estado",
        label: "Estado",
        sortable: true,
        align: "center",
        render: (value) => {
          if (!value) return "-";
          let badgeClass = "secondary";
          switch (value) {
            case "PENDIENTE":
              badgeClass = "warning";
              break;
            case "EN_PROCESO":
              badgeClass = "info";
              break;
            case "RECIBIDO":
              badgeClass = "success";
              break;
            case "CANCELADO":
              badgeClass = "danger";
              break;
          }
          const label = value.replace(/_/g, " ");
          return <span className={`badge bg-${badgeClass} text-nowrap`}>{label}</span>;
        }
      },
      {
        key: "montoTotal",
        label: "Monto Total",
        sortable: true,
        align: "right",
        render: (value) => value ? `$${parseFloat(value).toFixed(2)}` : "$0.00"
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
              disabled={row.estado === "RECIBIDO" || row.estado === "CANCELADO"}
            >
              <i className="bi bi-pencil"></i>
            </button>
            <button
              className="btn btn-outline-info"
              onClick={() => onChangeStatus?.(row)}
              title="Cambiar estado"
              disabled={row.estado === "RECIBIDO" || row.estado === "CANCELADO"}
            >
              <i className="bi bi-arrow-repeat"></i>
            </button>
            <button
              className="btn btn-outline-danger"
              onClick={() => onDelete?.(row)}
              title="Eliminar"
              disabled={row.estado === "RECIBIDO"}
            >
              <i className="bi bi-trash"></i>
            </button>
          </div>
        ),
      },
    ],
    [onView, onEdit, onDelete, onChangeStatus]
  );

  return (
    <DataTable
      columns={columns}
      data={data}
      loading={loading}
      error={error}
      emptyMessage="No hay pedidos registrados."
      rowKey="id"
    />
  );
}
