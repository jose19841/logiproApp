// src/features/inventory/components/InventoryForm.jsx
import { useState, useEffect } from "react";
import { listMaterials } from "@/features/materials/services/materialsApi";
import apiClient from "@shared/services/apiClient";

/**
 * Componente de formulario reutilizable para crear/editar inventario
 * @param {Object} initialValues - Valores iniciales del formulario
 * @param {Function} onSubmit - Callback al enviar el formulario
 * @param {Function} onCancel - Callback al cancelar
 * @param {Boolean} loading - Estado de carga del submit
 * @param {String} submitLabel - Texto del botón de submit (default: "Guardar")
 */
export default function InventoryForm({
  initialValues = {},
  onSubmit,
  onCancel,
  loading = false,
  submitLabel = "Guardar"
}) {
  const [sectores, setSectores] = useState([]);
  const [materiales, setMateriales] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  const [form, setForm] = useState({
    sectorId: "",
    materialId: "",
    cantidadMinima: "",
    cantidadMaxima: "",
    ...initialValues
  });

  const [touched, setTouched] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sectoresData, materialesData] = await Promise.all([
          apiClient.get("/api/inventario/sectores").then(res => res.data).catch(() => []),
          listMaterials().catch(() => [])
        ]);

        setSectores(sectoresData || []);
        setMateriales(materialesData || []);
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
        sectorId: initialValues.sectorId?.toString() || "",
        materialId: initialValues.materialId?.toString() || "",
        cantidadMinima: initialValues.cantidadMinima?.toString() || "",
        cantidadMaxima: initialValues.cantidadMaxima?.toString() || ""
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

  if (!form.sectorId) {
    errors.sectorId = "Campo obligatorio";
  }

  if (!form.materialId) {
    errors.materialId = "Campo obligatorio";
  }

  if (!form.cantidadMinima || form.cantidadMinima.trim() === "") {
    errors.cantidadMinima = "Campo obligatorio";
  } else if (isNaN(form.cantidadMinima)) {
    errors.cantidadMinima = "Debe ser un número";
  } else if (parseInt(form.cantidadMinima) < 0) {
    errors.cantidadMinima = "Debe ser mayor o igual a 0";
  }

  if (!form.cantidadMaxima || form.cantidadMaxima.trim() === "") {
    errors.cantidadMaxima = "Campo obligatorio";
  } else if (isNaN(form.cantidadMaxima)) {
    errors.cantidadMaxima = "Debe ser un número";
  } else if (parseInt(form.cantidadMaxima) < 0) {
    errors.cantidadMaxima = "Debe ser mayor o igual a 0";
  } else if (
    !isNaN(form.cantidadMinima) &&
    !isNaN(form.cantidadMaxima) &&
    parseInt(form.cantidadMaxima) < parseInt(form.cantidadMinima)
  ) {
    errors.cantidadMaxima = "Debe ser mayor o igual a la cantidad mínima";
  }

  const isFormValid = Object.keys(errors).length === 0;

  const handleSubmit = (e) => {
    e.preventDefault();

    // Marcar todos los campos como touched
    setTouched({
      sectorId: true,
      materialId: true,
      cantidadMinima: true,
      cantidadMaxima: true
    });

    if (!isFormValid) {
      return;
    }

    const dto = {
      sectorId: parseInt(form.sectorId, 10),
      materialId: parseInt(form.materialId, 10),
      cantidadMinima: parseInt(form.cantidadMinima, 10),
      cantidadMaxima: parseInt(form.cantidadMaxima, 10)
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
        {/* Sector */}
        <div className="col-md-6">
          <label htmlFor="sectorId" className="form-label">
            Sector <span className="text-danger">*</span>
          </label>
          <select
            id="sectorId"
            name="sectorId"
            className={`form-select ${touched.sectorId && errors.sectorId ? 'is-invalid' : ''}`}
            value={form.sectorId}
            onChange={handleChange}
            onBlur={() => handleBlur("sectorId")}
            disabled={loading}
          >
            <option value="">-- Seleccione un sector --</option>
            {sectores.map((sector) => (
              <option key={sector.id} value={sector.id}>
                {sector.nombre || `Sector #${sector.id}`}
              </option>
            ))}
          </select>
          {touched.sectorId && errors.sectorId && (
            <div className="invalid-feedback">{errors.sectorId}</div>
          )}
        </div>

        {/* Material */}
        <div className="col-md-6">
          <label htmlFor="materialId" className="form-label">
            Material <span className="text-danger">*</span>
          </label>
          <select
            id="materialId"
            name="materialId"
            className={`form-select ${touched.materialId && errors.materialId ? 'is-invalid' : ''}`}
            value={form.materialId}
            onChange={handleChange}
            onBlur={() => handleBlur("materialId")}
            disabled={loading}
          >
            <option value="">-- Seleccione un material --</option>
            {materiales.map((material) => (
              <option key={material.id} value={material.id}>
                Material #{material.id} - Cantidad: {material.cantidad}
              </option>
            ))}
          </select>
          {touched.materialId && errors.materialId && (
            <div className="invalid-feedback">{errors.materialId}</div>
          )}
        </div>

        {/* Cantidad Mínima */}
        <div className="col-md-6">
          <label htmlFor="cantidadMinima" className="form-label">
            Cantidad Mínima <span className="text-danger">*</span>
          </label>
          <input
            type="number"
            id="cantidadMinima"
            name="cantidadMinima"
            className={`form-control ${touched.cantidadMinima && errors.cantidadMinima ? 'is-invalid' : ''}`}
            placeholder="Ingrese cantidad mínima"
            value={form.cantidadMinima}
            onChange={handleChange}
            onBlur={() => handleBlur("cantidadMinima")}
            disabled={loading}
            min="0"
          />
          {touched.cantidadMinima && errors.cantidadMinima && (
            <div className="invalid-feedback">{errors.cantidadMinima}</div>
          )}
        </div>

        {/* Cantidad Máxima */}
        <div className="col-md-6">
          <label htmlFor="cantidadMaxima" className="form-label">
            Cantidad Máxima <span className="text-danger">*</span>
          </label>
          <input
            type="number"
            id="cantidadMaxima"
            name="cantidadMaxima"
            className={`form-control ${touched.cantidadMaxima && errors.cantidadMaxima ? 'is-invalid' : ''}`}
            placeholder="Ingrese cantidad máxima"
            value={form.cantidadMaxima}
            onChange={handleChange}
            onBlur={() => handleBlur("cantidadMaxima")}
            disabled={loading}
            min="0"
          />
          {touched.cantidadMaxima && errors.cantidadMaxima && (
            <div className="invalid-feedback">{errors.cantidadMaxima}</div>
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
