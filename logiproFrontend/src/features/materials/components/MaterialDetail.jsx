// src/features/materials/components/MaterialDetail.jsx

/**
 * Componente modal para mostrar detalles de un material
 * @param {Object} material - Material a mostrar
 * @param {Function} onClose - Callback al cerrar
 * @param {Function} onEdit - Callback al editar
 */
export default function MaterialDetail({ material, onClose, onEdit }) {
  if (!material) return null;

  return (
    <div
      className="modal fade show"
      style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}
      onClick={(e) => e.target === e.currentTarget && onClose?.()}
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header bg-light">
            <h5 className="modal-title">
              <i className="bi bi-box-seam me-2"></i>
              Detalles del Material
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              aria-label="Cerrar"
            ></button>
          </div>

          <div className="modal-body">
            <div className="row g-3">
              {/* Información General */}
              <div className="col-12">
                <div className="card border-0 bg-light">
                  <div className="card-body">
                    <h6 className="card-title mb-3">
                      <i className="bi bi-info-circle me-2"></i>
                      Información General
                    </h6>
                    <div className="row g-3">
                      <div className="col-md-3">
                        <label className="form-label small mb-1">ID</label>
                        <p className="fw-semibold mb-0">
                          <code className="bg-white px-2 py-1 rounded">{material.id}</code>
                        </p>
                      </div>
                      <div className="col-md-3">
                        <label className="form-label small mb-1">Cantidad</label>
                        <p className="fw-semibold mb-0">
                          <span className="badge bg-primary fs-6">
                            {material.cantidad ?? 'No especificado'}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Información del Material */}
              <div className="col-12">
                <div className="card border-0 bg-light">
                  <div className="card-body">
                    <h6 className="card-title mb-3">
                      <i className="bi bi-diagram-3 me-2"></i>
                      Información del Material
                    </h6>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label small mb-1">Proveedor</label>
                        <p className="fw-semibold mb-0">
                          {material.proveedorDescripcion || 'No especificado'}
                        </p>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small mb-1">Tipo de Material</label>
                        <p className="fw-semibold mb-0">
                          {material.nombreTipoMaterial || 'No especificado'}
                        </p>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small mb-1">Calidad (Resultado de Inspección)</label>
                        <p className="fw-semibold mb-0">
                          {material.resultadoCalidad ? (
                            <span className={`badge bg-${
                              material.resultadoCalidad === 'Bueno' ? 'success' :
                              material.resultadoCalidad === 'Regular' ? 'warning' :
                              'danger'
                            }`}>
                              {material.resultadoCalidad}
                            </span>
                          ) : 'No especificado'}
                        </p>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small mb-1">Fecha de Registro</label>
                        <p className="fw-semibold mb-0">
                          {material.fechaCreacion ? (
                            new Date(material.fechaCreacion).toLocaleDateString('es-AR', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })
                          ) : 'No especificado'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-outline-primary"
              onClick={() => {
                onClose?.();
                onEdit?.(material);
              }}
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
  );
}
