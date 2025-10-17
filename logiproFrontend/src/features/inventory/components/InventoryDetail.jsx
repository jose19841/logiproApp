// src/features/inventory/components/InventoryDetail.jsx
export default function InventoryDetail({ inventario, onClose, onEdit }) {
  if (!inventario) return null;

  return (
    <>
      {/* Modal backdrop */}
      <div
        className="modal-backdrop fade show"
        onClick={onClose}
        style={{ zIndex: 1040 }}
      ></div>

      {/* Modal */}
      <div
        className="modal fade show"
        style={{ display: "block", zIndex: 1050 }}
        tabIndex="-1"
        role="dialog"
      >
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                <i className="bi bi-box-seam me-2"></i>
                Detalle de Inventario #{inventario.id}
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
                aria-label="Close"
              ></button>
            </div>

            <div className="modal-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label text-muted small">ID</label>
                  <p className="fw-bold">#{inventario.id}</p>
                </div>

                <div className="col-md-6">
                  <label className="form-label text-muted small">Sector</label>
                  <p className="fw-bold">{inventario.sectorNombre || 'No especificado'}</p>
                </div>

                <div className="col-md-6">
                  <label className="form-label text-muted small">Material (Tipo)</label>
                  <p className="fw-bold">{inventario.materialNombre || 'No especificado'}</p>
                </div>

                <div className="col-md-6">
                  <label className="form-label text-muted small">Cantidad Mínima</label>
                  <p>
                    <span className="badge bg-info fs-6">{inventario.cantidadMinima}</span>
                  </p>
                </div>

                <div className="col-md-6">
                  <label className="form-label text-muted small">Cantidad Máxima</label>
                  <p>
                    <span className="badge bg-success fs-6">{inventario.cantidadMaxima}</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-warning"
                onClick={() => onEdit?.(inventario)}
              >
                <i className="bi bi-pencil me-2"></i>
                Editar
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
