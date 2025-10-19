// src/features/inventory/components/InventoryList.jsx
export default function InventoryList({ data, loading, error, onView, onEdit, onDelete }) {
  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-2 text-muted">Cargando inventario...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        <i className="bi bi-exclamation-triangle me-2"></i>
        {error}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="alert alert-info" role="alert">
        <i className="bi bi-info-circle me-2"></i>
        No se encontraron registros de inventario.
      </div>
    );
  }

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Sector</th>
                <th>Material</th>
                <th className="text-center">Cantidad Actual</th>
                <th className="text-center">Mínimo</th>
                <th className="text-center">Máximo</th>
                <th className="text-center">Estado</th>
                <th className="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {data.map((inventario) => {
                // Calcular estado basado en cantidad actual vs mínima
                const actual = inventario.cantidadActual || 0;
                const min = inventario.cantidadMinima || 0;

                let estadoBadge = "success";
                let estadoTexto = "OK";
                let estadoIcon = "check-circle";

                if (actual < min) {
                  estadoBadge = "danger";
                  estadoTexto = "Crítico";
                  estadoIcon = "exclamation-triangle";
                } else if (actual <= min * 1.2) {
                  estadoBadge = "warning";
                  estadoTexto = "Bajo";
                  estadoIcon = "exclamation-circle";
                }

                return (
                  <tr key={inventario.id}>
                    <td>
                      <span className="badge bg-secondary">#{inventario.id}</span>
                    </td>
                    <td>
                      <strong>{inventario.sectorNombre}</strong>
                      <br />
                      <small className="opacity-75">ID: {inventario.sectorId}</small>
                    </td>
                    <td>
                      <strong>{inventario.materialNombre}</strong>
                      <br />
                      <small className="opacity-75">ID: {inventario.materialId}</small>
                    </td>
                    <td className="text-center">
                      <span className={`badge bg-${estadoBadge} fs-6`}>
                        {actual}
                      </span>
                    </td>
                    <td className="text-center">
                      <span className="badge bg-info">{inventario.cantidadMinima}</span>
                    </td>
                    <td className="text-center">
                      <span className="badge bg-success">{inventario.cantidadMaxima}</span>
                    </td>
                    <td className="text-center">
                      <span className={`badge bg-${estadoBadge}`}>
                        <i className={`bi bi-${estadoIcon} me-1`}></i>
                        {estadoTexto}
                      </span>
                    </td>
                    <td className="text-center">
                      <div className="btn-group btn-group-sm" role="group">
                        <button
                          className="btn btn-outline-primary"
                          onClick={() => onView?.(inventario)}
                          title="Ver detalle"
                        >
                          <i className="bi bi-eye"></i>
                        </button>
                        <button
                          className="btn btn-outline-warning"
                          onClick={() => onEdit?.(inventario)}
                          title="Editar"
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button
                          className="btn btn-outline-danger"
                          onClick={() => onDelete?.(inventario)}
                          title="Eliminar"
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-3 text-muted small">
          Total de registros: {data.length}
        </div>
      </div>
    </div>
  );
}
