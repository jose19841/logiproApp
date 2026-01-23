// src/features/suppliers/pages/SupplierCreatePage.jsx
import { createSupplier } from "@/features/suppliers/services/suppliersApi";
import useToast from "@shared/hooks/useToast";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SupplierCreatePage() {
  const navigate = useNavigate();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    direccion: "",
    telefono: "",
  });
  const [touched, setTouched] = useState({
    nombre: false,
    descripcion: false,
    direccion: false,
    telefono: false,
  });

  // Validations (matching backend constraints)
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

  const direccionError = form.direccion.length > 200
    ? "La dirección no puede exceder 200 caracteres"
    : "";

  const telefonoError = form.telefono.length > 20
    ? "El teléfono no puede exceder 20 caracteres"
    : "";

  const isFormValid = !nombreError && !descripcionError && !direccionError && !telefonoError;

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
    setTouched({ nombre: true, descripcion: true, direccion: true, telefono: true });

    if (!isFormValid) {
      toast.showError("Datos inválidos", "Por favor corrija los errores en el formulario");
      return;
    }

    setLoading(true);
    try {
      // Send DTO with exact backend field names (Spanish)
      const dto = {
        nombre: form.nombre.trim(),
        descripcion: form.descripcion.trim(),
        direccion: form.direccion.trim(),
        telefono: form.telefono.trim(),
      };

      const response = await createSupplier(dto);

      toast.showSuccess(
        "Proveedor creado",
        `El proveedor "${response.nombre}" ha sido creado exitosamente.`
      );

      navigate("/suppliers");
    } catch (err) {
      const status = err?.response?.status;
      const message = err?.response?.data?.mensaje || err?.response?.data?.message || err.message;

      if (status === 400) {
        toast.showError("Error de validación", message || "Datos inválidos proporcionados");
      } else if (status === 401) {
        toast.showError("No autorizado", "Su sesión ha expirado. Por favor inicie sesión nuevamente.");
        navigate("/login");
      } else {
        toast.showError("Error", message || "No se pudo crear el proveedor");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid">
      <div className="row mb-3">
        <div className="col-12">
          <h4 className="mb-0">Crear Nuevo Proveedor</h4>
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

                {/* Direccion Field */}
                <div className="mb-3">
                  <label htmlFor="direccion" className="form-label">
                    Dirección
                  </label>
                  <input
                    id="direccion"
                    type="text"
                    className={`form-control ${
                      touched.direccion && direccionError ? "is-invalid" : ""
                    }`}
                    placeholder="Ingrese dirección del proveedor"
                    value={form.direccion}
                    onChange={handleChange("direccion")}
                    onBlur={handleBlur("direccion")}
                    maxLength={200}
                    disabled={loading}
                  />
                  {touched.direccion && direccionError && (
                    <div className="invalid-feedback">{direccionError}</div>
                  )}
                  <small className="text-muted">
                    {form.direccion.length}/200 caracteres
                  </small>
                </div>

                {/* Telefono Field */}
                <div className="mb-3">
                  <label htmlFor="telefono" className="form-label">
                    Teléfono
                  </label>
                  <input
                    id="telefono"
                    type="tel"
                    className={`form-control ${
                      touched.telefono && telefonoError ? "is-invalid" : ""
                    }`}
                    placeholder="Ingrese teléfono del proveedor"
                    value={form.telefono}
                    onChange={handleChange("telefono")}
                    onBlur={handleBlur("telefono")}
                    maxLength={20}
                    disabled={loading}
                  />
                  {touched.telefono && telefonoError && (
                    <div className="invalid-feedback">{telefonoError}</div>
                  )}
                  <small className="text-muted">
                    {form.telefono.length}/20 caracteres
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
                        Crear...
                      </>
                    ) : (
                      "Crear Proveedor"
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
