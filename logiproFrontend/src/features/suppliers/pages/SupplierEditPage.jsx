// src/features/suppliers/pages/SupplierEditPage.jsx
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { alertConfirm, alertError, alertSuccess } from "@shared/components/alerts/swal";
import { getSupplierById, updateSupplier } from "@/features/suppliers/services/suppliersApi";

export default function SupplierEditPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
  });
  const [touched, setTouched] = useState({
    nombre: false,
    descripcion: false,
  });

  // Cargar datos del proveedor
  useEffect(() => {
    const fetchSupplier = async () => {
      try {
        setLoadingData(true);
        const data = await getSupplierById(id);
        setForm({
          nombre: data.nombre || "",
          descripcion: data.descripcion || "",
        });
      } catch (error) {
        console.error("Error loading supplier:", error);
        alertError("Error", "No se pudo cargar el proveedor");
        navigate("/suppliers");
      } finally {
        setLoadingData(false);
      }
    };
    fetchSupplier();
  }, [id, navigate]);

  // Validaciones (matching backend constraints)
  const nombreError = !form.nombre.trim()
    ? "El nombre es requerido"
    : form.nombre.length > 100
    ? "El nombre no puede exceder 100 caracteres"
    : "";

  const descripcionError = !form.descripcion.trim()
    ? "La descripción es requerida"
    : form.descripcion.length > 255
    ? "La descripción no puede exceder 255 caracteres"
    : "";

  const isFormValid = !nombreError && !descripcionError;

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
    if (!touched[field]) {
      setTouched({ ...touched, [field]: true });
    }
  };

  const handleBlur = (field) => () => {
    setTouched({ ...touched, [field]: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prevenir doble submit
    if (loading) return;

    // Mark all fields as touched
    setTouched({ nombre: true, descripcion: true });

    if (!isFormValid) {
      alertError("Datos inválidos", "Por favor corrija los errores en el formulario");
      return;
    }

    const ok = await alertConfirm(
      "¿Actualizar proveedor?",
      `Se actualizarán los datos del proveedor.`
    );
    if (!ok.isConfirmed) return;

    setLoading(true);
    try {
      // Send DTO with exact backend field names (Spanish)
      const dto = {
        nombre: form.nombre.trim(),
        descripcion: form.descripcion.trim(),
      };

      const response = await updateSupplier(id, dto);

      await alertSuccess(
        "Proveedor actualizado",
        `El proveedor "${response.nombre}" ha sido actualizado exitosamente.`
      );

      navigate("/suppliers");
    } catch (err) {
      const status = err?.response?.status;
      const message = err?.response?.data?.mensaje || err?.response?.data?.message || err.message;

      if (status === 400) {
        await alertError("Error de validación", message || "Datos inválidos proporcionados");
      } else if (status === 401) {
        await alertError("No autorizado", "Su sesión ha expirado. Por favor inicie sesión nuevamente.");
        navigate("/login");
      } else if (status === 404) {
        await alertError("No encontrado", "El proveedor no existe");
        navigate("/suppliers");
      } else {
        await alertError("Error", message || "No se pudo actualizar el proveedor");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="container-fluid">
        <div className="d-flex align-items-center gap-2 text-muted">
          <span className="spinner-border spinner-border-sm" role="status"></span>
          <span>Cargando proveedor...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="row mb-3">
        <div className="col-12">
          <h4 className="mb-0">Editar Proveedor</h4>
        </div>
      </div>

      <div className="row">
        <div className="col-12 col-lg-8 col-xl-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <form onSubmit={handleSubmit} noValidate>
                {/* Name Field */}
                <div className="mb-3">
                  <label htmlFor="nombre" className="form-label">
                    Nombre <span className="text-danger">*</span>
                  </label>
                  <input
                    id="nombre"
                    type="text"
                    className={`form-control ${
                      touched.nombre && nombreError ? "is-invalid" : ""
                    }`}
                    placeholder="Ingrese Nombre Proveedor"
                    value={form.nombre}
                    onChange={handleChange("nombre")}
                    onBlur={handleBlur("nombre")}
                    maxLength={100}
                    disabled={loading}
                    required
                  />
                  {touched.nombre && nombreError && (
                    <div className="invalid-feedback">{nombreError}</div>
                  )}
                  <small className="text-muted">
                    {form.nombre.length}/100 caracteres
                  </small>
                </div>

                {/* Description Field */}
                <div className="mb-3">
                  <label htmlFor="descripcion" className="form-label">
                    Descripcion <span className="text-danger">*</span>
                  </label>
                  <textarea
                    id="descripcion"
                    className={`form-control ${
                      touched.descripcion && descripcionError ? "is-invalid" : ""
                    }`}
                    placeholder="Ingrese Descripcion"
                    value={form.descripcion}
                    onChange={handleChange("descripcion")}
                    onBlur={handleBlur("descripcion")}
                    maxLength={255}
                    rows={4}
                    disabled={loading}
                    required
                  />
                  {touched.descripcion && descripcionError && (
                    <div className="invalid-feedback">{descripcionError}</div>
                  )}
                  <small className="text-muted">
                    {form.descripcion.length}/255 caracteres
                  </small>
                </div>

                {/* Action Buttons */}
                <div className="d-flex gap-2">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={!isFormValid || loading}
                  >
                    {loading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        />
                        Actualizando...
                      </>
                    ) : (
                      "Actualizar Proveedor"
                    )}
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => navigate("/suppliers")}
                    disabled={loading}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
