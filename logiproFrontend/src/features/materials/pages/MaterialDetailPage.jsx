// src/features/materials/pages/MaterialDetailPage.jsx
import { useNavigate, useParams } from "react-router-dom";
import useMaterialDetail from "@/features/materials/hooks/useMaterialDetail";

export default function MaterialDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { material, loading, error } = useMaterialDetail(id);

  if (loading) {
    return (
      <div className="container-fluid">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-2 text-muted">Cargando material...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-fluid">
        <div className="alert alert-danger" role="alert">
          <i className="bi bi-exclamation-triangle me-2"></i>
          {error}
        </div>
        <button
          className="btn btn-outline-secondary"
          onClick={() => navigate("/materials")}
        >
          <i className="bi bi-arrow-left me-2"></i>
          Volver a Materiales
        </button>
      </div>
    );
  }

  if (!material) {
    return (
      <div className="container-fluid">
        <div className="alert alert-warning" role="alert">
          <i className="bi bi-info-circle me-2"></i>
          Material no encontrado
        </div>
        <button
          className="btn btn-outline-secondary"
          onClick={() => navigate("/materials")}
        >
          <i className="bi bi-arrow-left me-2"></i>
          Volver a Materiales
        </button>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h4 className="mb-0">
          <i className="bi bi-box-seam me-2"></i>
          Material #{material.id}
        </h4>
        <div className="d-flex gap-2">
          <button
            className="btn btn-primary"
            onClick={() => navigate(`/materials/${id}/edit`)}
          >
            <i className="bi bi-pencil me-2"></i>
            Editar
          </button>
          <button
            className="btn btn-outline-secondary"
            onClick={() => navigate("/materials")}
          >
            <i className="bi bi-arrow-left me-2"></i>
            Volver
          </button>
        </div>
      </div>

      {/* Información General */}
      <div className="card shadow-sm mb-3">
        <div className="card-header bg-light">
          <h6 className="mb-0">
            <i className="bi bi-info-circle me-2"></i>
            Información General
          </h6>
        </div>
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-3">
              <label className="form-label text-muted small mb-1">ID</label>
              <p className="fw-semibold mb-0">
                <code className="bg-light px-2 py-1 rounded">{material.id}</code>
              </p>
            </div>
            <div className="col-md-3">
              <label className="form-label text-muted small mb-1">Cantidad</label>
              <p className="fw-semibold mb-0">
                <span className="badge bg-primary fs-6">
                  {material.cantidad ?? 'No especificado'}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Relaciones */}
      <div className="card shadow-sm">
        <div className="card-header bg-light">
          <h6 className="mb-0">
            <i className="bi bi-diagram-3 me-2"></i>
            Relaciones
          </h6>
        </div>
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label text-muted small mb-1">Reclamo ID</label>
              <p className="fw-semibold mb-0">
                {material.reclamoId ? (
                  <code className="bg-light px-2 py-1 rounded">#{material.reclamoId}</code>
                ) : (
                  <span className="text-muted">No especificado</span>
                )}
              </p>
            </div>
            <div className="col-md-6">
              <label className="form-label text-muted small mb-1">Proveedor ID</label>
              <p className="fw-semibold mb-0">
                {material.proveedorId ? (
                  <code className="bg-light px-2 py-1 rounded">#{material.proveedorId}</code>
                ) : (
                  <span className="text-muted">No especificado</span>
                )}
              </p>
            </div>
            <div className="col-md-6">
              <label className="form-label text-muted small mb-1">Calidad ID</label>
              <p className="fw-semibold mb-0">
                {material.calidadId ? (
                  <code className="bg-light px-2 py-1 rounded">#{material.calidadId}</code>
                ) : (
                  <span className="text-muted">No especificado</span>
                )}
              </p>
            </div>
            <div className="col-md-6">
              <label className="form-label text-muted small mb-1">Tipo Material ID</label>
              <p className="fw-semibold mb-0">
                {material.tipoMaterialId ? (
                  <code className="bg-light px-2 py-1 rounded">#{material.tipoMaterialId}</code>
                ) : (
                  <span className="text-muted">No especificado</span>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
