// src/features/claims/pages/ClaimCreatePage.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useToast from "@shared/hooks/useToast";
import { createClaim } from "@/features/claims/services/claimsApi";
import { listSuppliers } from "@/features/suppliers/services/suppliersApi";

const ESTADOS = {
  PENDIENTE: "Pendiente",
  EN_PROCESO: "En Proceso",
  RESUELTO: "Resuelto",
  CERRADO: "Cerrado"
};

export default function ClaimCreatePage() {
  const navigate = useNavigate();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [suppliers, setSuppliers] = useState([]);
  const [loadingSuppliers, setLoadingSuppliers] = useState(true);

  const [form, setForm] = useState({
    descripcion: "",
    proveedorId: ""
  });

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const data = await listSuppliers();
        setSuppliers(data || []);
      } catch (error) {
        console.error("Error loading suppliers:", error);
        toast.showError("Error", "No se pudo cargar la lista de proveedores");
      } finally {
        setLoadingSuppliers(false);
      }
    };
    fetchSuppliers();
  }, [toast]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // Validation
  const descripcionError = !form.descripcion.trim()
    ? "La descripción es requerida"
    : form.descripcion.length > 500
    ? "La descripción no puede exceder 500 caracteres"
    : "";

  const proveedorIdError = !form.proveedorId ? "El proveedor es requerido" : "";

  const isFormValid = !descripcionError && !proveedorIdError;

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prevenir doble submit
    if (loading) return;

    if (!isFormValid) {
      toast.showError("Error de Validación", "Por favor corrija los errores en el formulario");
      return;
    }

    const confirmed = await toast.showConfirm(
      "¿Crear reclamo?",
      "Se creará un nuevo reclamo con estado En Proceso.",
      "Crear",
      "Cancelar"
    );
    if (!confirmed) return;

    setLoading(true);

    try {
      // Generate automatic claim number using timestamp
      const timestamp = Date.now();
      const autoNumReclamo = `REC-${timestamp}`;

      // Build DTO with exact Spanish field names
      const dto = {
        numReclamo: autoNumReclamo,
        descripcion: form.descripcion.trim(),
        proveedorId: parseInt(form.proveedorId, 10),
        estado: "EN_PROCESO"
        // detalleReclamoId is optional and will be null
      };

      const response = await createClaim(dto);

      toast.showSuccess("Reclamo creado", `El reclamo #${response.numReclamo} ha sido creado exitosamente.`);

      navigate("/claims");
    } catch (error) {
      console.error("Error creating claim:", error);
      toast.showError("Error", error?.response?.data?.mensaje || error?.message || "No se pudo crear el reclamo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h4 className="mb-0">Nuevo Reclamo</h4>
        <button
          className="btn btn-outline-secondary"
          onClick={() => navigate("/claims")}
        >
          ← Volver a Reclamos
        </button>
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              {/* Description */}
              <div className="col-12">
                <label htmlFor="descripcion" className="form-label">
                  Descripción <span className="text-danger">*</span>
                </label>
                <textarea
                  id="descripcion"
                  name="descripcion"
                  className={`form-control ${descripcionError ? 'is-invalid' : ''}`}
                  placeholder="Ingrese descripción del reclamo"
                  value={form.descripcion}
                  onChange={handleChange}
                  rows={4}
                  maxLength={500}
                  disabled={loading}
                />
                {descripcionError && (
                  <div className="invalid-feedback">{descripcionError}</div>
                )}
                <small className="text-muted">
                  {form.descripcion.length}/500 caracteres
                </small>
              </div>

              {/* Supplier */}
              <div className="col-md-6">
                <label htmlFor="proveedorId" className="form-label">
                  Proveedor <span className="text-danger">*</span>
                </label>
                <select
                  id="proveedorId"
                  name="proveedorId"
                  className={`form-select ${proveedorIdError ? 'is-invalid' : ''}`}
                  value={form.proveedorId}
                  onChange={handleChange}
                  disabled={loading || loadingSuppliers}
                >
                  <option value="">-- Seleccione un proveedor --</option>
                  {suppliers.map((supplier) => (
                    <option key={supplier.id} value={supplier.id}>
                      {supplier.nombre}
                    </option>
                  ))}
                </select>
                {proveedorIdError && (
                  <div className="invalid-feedback">{proveedorIdError}</div>
                )}
                {loadingSuppliers && (
                  <small className="text-muted">Cargando proveedores...</small>
                )}
              </div>
            </div>

            {/* Form Actions */}
            <div className="mt-4 d-flex gap-2">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading || !isFormValid}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Creando...
                  </>
                ) : (
                  'Crear Reclamo'
                )}
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => navigate("/claims")}
                disabled={loading}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
