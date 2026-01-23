// src/features/materials/components/MaterialForm.jsx
import { useState, useEffect } from "react";
import { listSuppliers } from "@/features/suppliers/services/suppliersApi";
import apiClient from "@shared/services/apiClient";

/**
 * Componente de formulario reutilizable para crear/editar materiales
 * Campos: cantidad, proveedorId, calidadId, tipoMaterialId
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
  const [tiposMaterial, setTiposMaterial] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  const [form, setForm] = useState({
    cantidad: "",
    proveedorId: "",
    tipoMaterialId: "",
    resultadoInspeccion: "",
    observacionesInspeccion: "",
    ...initialValues
  });

  const [touched, setTouched] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [suppliersData, tiposMaterialData] = await Promise.all([
          listSuppliers().catch(() => []),
          apiClient.get("/api/materiales/tipos-material").then(res => res.data).catch(() => [])
        ]);

        // Filtrar solo proveedores habilitados
        const activeSuppliers = (suppliersData || []).filter(supplier => supplier.habilitado === true);
        setSuppliers(activeSuppliers);
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
        proveedorId: initialValues.proveedorId?.toString() || "",
        tipoMaterialId: initialValues.tipoMaterialId?.toString() || "",
        resultadoInspeccion: initialValues.resultadoInspeccion || "",
        observacionesInspeccion: initialValues.observacionesInspeccion || ""
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

  const cantidadStr = String(form.cantidad || "").trim();
  if (!cantidadStr) {
    errors.cantidad = "La cantidad es obligatoria";
  } else if (isNaN(cantidadStr)) {
    errors.cantidad = "Debe ser un número";
  } else if (parseInt(cantidadStr) <= 0) {
    errors.cantidad = "La cantidad debe ser mayor que 0";
  }

  if (!form.proveedorId) {
    errors.proveedorId = "El proveedor es obligatorio";
  }

  const resultadoStr = String(form.resultadoInspeccion || "").trim();
  if (!resultadoStr) {
    errors.resultadoInspeccion = "El resultado de la inspección es obligatorio";
  }

  if (!form.tipoMaterialId) {
    errors.tipoMaterialId = "El tipo de material es obligatorio";
  }

  const isFormValid = Object.keys(errors).length === 0;

  const handleSubmit = (e) => {
    e.preventDefault();

    // Marcar todos los campos como touched
    setTouched({
      cantidad: true,
      proveedorId: true,
      resultadoInspeccion: true,
      tipoMaterialId: true
    });

    if (!isFormValid) {
      return;
    }

    const dto = {
      cantidad: parseInt(form.cantidad, 10),
      proveedorId: parseInt(form.proveedorId, 10),
      tipoMaterialId: parseInt(form.tipoMaterialId, 10),
      resultadoInspeccion: form.resultadoInspeccion,
      observacionesInspeccion: form.observacionesInspeccion || null
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
            min="1"
          />
          {touched.cantidad && errors.cantidad && (
            <div className="invalid-feedback">{errors.cantidad}</div>
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

        {/* Resultado de Inspección */}
        <div className="col-md-6">
          <label htmlFor="resultadoInspeccion" className="form-label">
            Resultado de Inspección <span className="text-danger">*</span>
          </label>
          <select
            id="resultadoInspeccion"
            name="resultadoInspeccion"
            className={`form-select ${touched.resultadoInspeccion && errors.resultadoInspeccion ? 'is-invalid' : ''}`}
            value={form.resultadoInspeccion}
            onChange={handleChange}
            onBlur={() => handleBlur("resultadoInspeccion")}
            disabled={loading}
          >
            <option value="">-- Seleccione resultado --</option>
            <option value="Bueno">Bueno</option>
            <option value="Regular">Regular</option>
            <option value="Malo">Malo</option>
          </select>
          {touched.resultadoInspeccion && errors.resultadoInspeccion && (
            <div className="invalid-feedback">{errors.resultadoInspeccion}</div>
          )}
        </div>

        {/* Observaciones de Inspección */}
        <div className="col-md-12">
          <label htmlFor="observacionesInspeccion" className="form-label">
            Observaciones de Inspección (Opcional)
          </label>
          <textarea
            id="observacionesInspeccion"
            name="observacionesInspeccion"
            className="form-control"
            placeholder="Ingrese observaciones sobre la inspección"
            value={form.observacionesInspeccion}
            onChange={handleChange}
            onBlur={() => handleBlur("observacionesInspeccion")}
            disabled={loading}
            rows={3}
          />
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
