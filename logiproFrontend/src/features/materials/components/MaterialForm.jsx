// src/features/materials/components/MaterialForm.jsx
import { useState, useEffect } from "react";
import { listSuppliers } from "@/features/suppliers/services/suppliersApi";
import { listClaims } from "@/features/claims/services/claimsApi";
import apiClient from "@shared/services/apiClient";

/**
 * Componente de formulario reutilizable para crear/editar materiales
 * @param {Object} initialValues - Valores iniciales del formulario
 * @param {Function} onSubmit - Callback al enviar el formulario
 * @param {Function} onCancel - Callback al cancelar
 * @param {Boolean} loading - Estado de carga del submit
 * @param {String} submitLabel - Texto del botón de submit (default: "Guardar")
 */
export default function MaterialForm({
  initialValues = {},
  onSubmit,
  onCancel,
  loading = false,
  submitLabel = "Guardar"
}) {
  const [suppliers, setSuppliers] = useState([]);
  const [claims, setClaims] = useState([]);
  const [calidades, setCalidades] = useState([]);
  const [tiposMaterial, setTiposMaterial] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  const [form, setForm] = useState({
    cantidad: "",
    reclamoId: "",
    proveedorId: "",
    calidadId: "",
    tipoMaterialId: "",
    ...initialValues
  });

  const [touched, setTouched] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [suppliersData, claimsData, calidadesData, tiposMaterialData] = await Promise.all([
          listSuppliers().catch(() => []),
          listClaims().catch(() => []),
          apiClient.get("/api/calidades").then(res => res.data).catch(() => []),
          apiClient.get("/api/tipos-material").then(res => res.data).catch(() => [])
        ]);

        setSuppliers(suppliersData || []);
        setClaims(claimsData || []);
        setCalidades(calidadesData || []);
        setTiposMaterial(tiposMaterialData || []);
      } catch (error) {
        console.error("Error loading form data:", error);
      } finally {
        setLoadingData(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (initialValues && Object.keys(initialValues).length > 0) {
      setForm({
        cantidad: initialValues.cantidad?.toString() || "",
        reclamoId: initialValues.reclamoId?.toString() || "",
        proveedorId: initialValues.proveedorId?.toString() || "",
        calidadId: initialValues.calidadId?.toString() || "",
        tipoMaterialId: initialValues.tipoMaterialId?.toString() || ""
      });
    }
  }, [initialValues]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  // Validaciones
  const errors = {};

  if (!form.cantidad || form.cantidad.trim() === "") {
    errors.cantidad = "Campo obligatorio";
  } else if (isNaN(form.cantidad)) {
    errors.cantidad = "Debe ser un número";
  } else if (parseInt(form.cantidad) < 0) {
    errors.cantidad = "Debe ser un número entero mayor o igual a 0";
  }

  if (!form.reclamoId) {
    errors.reclamoId = "Campo obligatorio";
  }

  if (!form.proveedorId) {
    errors.proveedorId = "Campo obligatorio";
  }

  if (!form.calidadId) {
    errors.calidadId = "Campo obligatorio";
  }

  if (!form.tipoMaterialId) {
    errors.tipoMaterialId = "Campo obligatorio";
  }

  const isFormValid = Object.keys(errors).length === 0;

  const handleSubmit = (e) => {
    e.preventDefault();

    // Marcar todos los campos como touched
    setTouched({
      cantidad: true,
      reclamoId: true,
      proveedorId: true,
      calidadId: true,
      tipoMaterialId: true
    });

    if (!isFormValid) {
      return;
    }

    const dto = {
      cantidad: parseInt(form.cantidad, 10),
      reclamoId: parseInt(form.reclamoId, 10),
      proveedorId: parseInt(form.proveedorId, 10),
      calidadId: parseInt(form.calidadId, 10),
      tipoMaterialId: parseInt(form.tipoMaterialId, 10)
    };

    onSubmit?.(dto);
  };

  if (loadingData) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-2 text-muted">Cargando formulario...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="row g-3">
        {/* Cantidad */}
        <div className="col-md-6">
          <label htmlFor="cantidad" className="form-label">
            Cantidad <span className="text-danger">*</span>
          </label>
          <input
            type="number"
            id="cantidad"
            name="cantidad"
            className={`form-control ${touched.cantidad && errors.cantidad ? 'is-invalid' : ''}`}
            placeholder="Ingrese cantidad"
            value={form.cantidad}
            onChange={handleChange}
            onBlur={() => handleBlur("cantidad")}
            disabled={loading}
            min="0"
          />
          {touched.cantidad && errors.cantidad && (
            <div className="invalid-feedback">{errors.cantidad}</div>
          )}
        </div>

        {/* Reclamo */}
        <div className="col-md-6">
          <label htmlFor="reclamoId" className="form-label">
            Reclamo <span className="text-danger">*</span>
          </label>
          <select
            id="reclamoId"
            name="reclamoId"
            className={`form-select ${touched.reclamoId && errors.reclamoId ? 'is-invalid' : ''}`}
            value={form.reclamoId}
            onChange={handleChange}
            onBlur={() => handleBlur("reclamoId")}
            disabled={loading}
          >
            <option value="">-- Seleccione un reclamo --</option>
            {claims.map((claim) => (
              <option key={claim.id} value={claim.id}>
                {claim.numReclamo || `Reclamo #${claim.id}`}
              </option>
            ))}
          </select>
          {touched.reclamoId && errors.reclamoId && (
            <div className="invalid-feedback">{errors.reclamoId}</div>
          )}
        </div>

        {/* Proveedor */}
        <div className="col-md-6">
          <label htmlFor="proveedorId" className="form-label">
            Proveedor <span className="text-danger">*</span>
          </label>
          <select
            id="proveedorId"
            name="proveedorId"
            className={`form-select ${touched.proveedorId && errors.proveedorId ? 'is-invalid' : ''}`}
            value={form.proveedorId}
            onChange={handleChange}
            onBlur={() => handleBlur("proveedorId")}
            disabled={loading}
          >
            <option value="">-- Seleccione un proveedor --</option>
            {suppliers.map((supplier) => (
              <option key={supplier.id} value={supplier.id}>
                {supplier.nombre}
              </option>
            ))}
          </select>
          {touched.proveedorId && errors.proveedorId && (
            <div className="invalid-feedback">{errors.proveedorId}</div>
          )}
        </div>

        {/* Calidad */}
        <div className="col-md-6">
          <label htmlFor="calidadId" className="form-label">
            Calidad <span className="text-danger">*</span>
          </label>
          <select
            id="calidadId"
            name="calidadId"
            className={`form-select ${touched.calidadId && errors.calidadId ? 'is-invalid' : ''}`}
            value={form.calidadId}
            onChange={handleChange}
            onBlur={() => handleBlur("calidadId")}
            disabled={loading}
          >
            <option value="">-- Seleccione una calidad --</option>
            {calidades.map((calidad) => (
              <option key={calidad.id} value={calidad.id}>
                {calidad.nombre || `Calidad #${calidad.id}`}
              </option>
            ))}
          </select>
          {touched.calidadId && errors.calidadId && (
            <div className="invalid-feedback">{errors.calidadId}</div>
          )}
        </div>

        {/* Tipo Material */}
        <div className="col-md-6">
          <label htmlFor="tipoMaterialId" className="form-label">
            Tipo de Material <span className="text-danger">*</span>
          </label>
          <select
            id="tipoMaterialId"
            name="tipoMaterialId"
            className={`form-select ${touched.tipoMaterialId && errors.tipoMaterialId ? 'is-invalid' : ''}`}
            value={form.tipoMaterialId}
            onChange={handleChange}
            onBlur={() => handleBlur("tipoMaterialId")}
            disabled={loading}
          >
            <option value="">-- Seleccione un tipo de material --</option>
            {tiposMaterial.map((tipo) => (
              <option key={tipo.id} value={tipo.id}>
                {tipo.nombre || `Tipo #${tipo.id}`}
              </option>
            ))}
          </select>
          {touched.tipoMaterialId && errors.tipoMaterialId && (
            <div className="invalid-feedback">{errors.tipoMaterialId}</div>
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
              Procesando...
            </>
          ) : (
            submitLabel
          )}
        </button>
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={onCancel}
          disabled={loading}
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
