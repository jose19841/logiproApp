// src/features/orders/components/OrderForm.jsx
import { useState, useEffect } from "react";
import { listSuppliers } from "@/features/suppliers/services/suppliersApi";
import { listMaterials } from "@/features/materials/services/materialsApi";
import { useAuth } from "@/features/auth/context/AuthContext";

/**
 * Componente de formulario reutilizable para crear/editar pedidos
 * @param {Object} initialValues - Valores iniciales del formulario
 * @param {Function} onSubmit - Callback al enviar el formulario
 * @param {Function} onCancel - Callback al cancelar
 * @param {Boolean} loading - Estado de carga del submit
 * @param {String} submitLabel - Texto del botón de submit (default: "Guardar")
 * @param {Boolean} isEdit - Indica si es modo edición
 */
export default function OrderForm({
  initialValues = {},
  onSubmit,
  onCancel,
  loading = false,
  submitLabel = "Guardar",
  isEdit = false
}) {
  const { user } = useAuth();
  const [suppliers, setSuppliers] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  const [form, setForm] = useState({
    proveedorId: "",
    fechaPedido: "",
    fechaEntregaEstimada: "",
    observaciones: "",
    detalles: []
  });

  const [touched, setTouched] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [suppliersData, materialsData] = await Promise.all([
          listSuppliers().catch(() => []),
          listMaterials().catch(() => [])
        ]);

        setSuppliers(suppliersData || []);
        // Si materials devuelve un objeto paginado
        setMaterials(materialsData?.content || materialsData || []);
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
        proveedorId: initialValues.proveedorId?.toString() || "",
        fechaPedido: initialValues.fechaPedido || "",
        fechaEntregaEstimada: initialValues.fechaEntregaEstimada || "",
        observaciones: initialValues.observaciones || "",
        detalles: initialValues.detalles?.map(d => ({
          materialId: d.materialId?.toString() || "",
          cantidadSolicitada: d.cantidadSolicitada?.toString() || "",
          precioUnitario: d.precioUnitario?.toString() || ""
        })) || []
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

  // Manejo de detalles
  const handleAddItem = () => {
    setForm(prev => ({
      ...prev,
      detalles: [...prev.detalles, { materialId: "", cantidadSolicitada: "", precioUnitario: "" }]
    }));
  };

  const handleRemoveItem = (index) => {
    setForm(prev => ({
      ...prev,
      detalles: prev.detalles.filter((_, i) => i !== index)
    }));
  };

  const handleItemChange = (index, field, value) => {
    setForm(prev => ({
      ...prev,
      detalles: prev.detalles.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  // Cálculo de subtotales y total
  const calculateSubtotal = (cantidad, precio) => {
    const cant = parseFloat(cantidad) || 0;
    const prec = parseFloat(precio) || 0;
    return cant * prec;
  };

  const calculateTotal = () => {
    return form.detalles.reduce((total, item) => {
      return total + calculateSubtotal(item.cantidadSolicitada, item.precioUnitario);
    }, 0);
  };

  // Validaciones
  const errors = {};

  if (!form.proveedorId) {
    errors.proveedorId = "El proveedor es obligatorio";
  }

  if (!form.fechaPedido) {
    errors.fechaPedido = "La fecha de pedido es obligatoria";
  }

  if (form.detalles.length === 0) {
    errors.detalles = "Debe agregar al menos un ítem al pedido";
  } else {
    // Validar cada ítem
    form.detalles.forEach((item, index) => {
      if (!item.materialId) {
        errors[`detalle_${index}_materialId`] = "Debe seleccionar un material";
      }
      if (!item.cantidadSolicitada || parseFloat(item.cantidadSolicitada) <= 0) {
        errors[`detalle_${index}_cantidadSolicitada`] = "La cantidad debe ser mayor a 0";
      }
      if (!item.precioUnitario || parseFloat(item.precioUnitario) < 0) {
        errors[`detalle_${index}_precioUnitario`] = "El precio no puede ser negativo";
      }
    });
  }

  const isFormValid = Object.keys(errors).length === 0;

  const handleSubmit = (e) => {
    e.preventDefault();

    // Marcar todos los campos como touched
    setTouched({
      proveedorId: true,
      fechaPedido: true,
      fechaEntregaEstimada: true,
      observaciones: true
    });

    if (!isFormValid) {
      return;
    }

    const dto = {
      proveedorId: parseInt(form.proveedorId, 10),
      fechaPedido: form.fechaPedido,
      fechaEntregaEstimada: form.fechaEntregaEstimada || null,
      observaciones: form.observaciones || null,
      detalles: form.detalles.map(item => ({
        materialId: parseInt(item.materialId, 10),
        cantidadSolicitada: parseInt(item.cantidadSolicitada, 10),
        precioUnitario: parseFloat(item.precioUnitario)
      }))
    };

    // Solo agregar usuarioId al crear (no al editar)
    if (!isEdit && user?.id) {
      dto.usuarioId = user.id;
    }

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

        {/* Fecha de Pedido */}
        <div className="col-md-3">
          <label htmlFor="fechaPedido" className="form-label">
            Fecha de Pedido <span className="text-danger">*</span>
          </label>
          <input
            type="date"
            id="fechaPedido"
            name="fechaPedido"
            className={`form-control ${touched.fechaPedido && errors.fechaPedido ? 'is-invalid' : ''}`}
            value={form.fechaPedido}
            onChange={handleChange}
            onBlur={() => handleBlur("fechaPedido")}
            disabled={loading}
          />
          {touched.fechaPedido && errors.fechaPedido && (
            <div className="invalid-feedback">{errors.fechaPedido}</div>
          )}
        </div>

        {/* Fecha de Entrega Estimada */}
        <div className="col-md-3">
          <label htmlFor="fechaEntregaEstimada" className="form-label">
            Entrega Estimada
          </label>
          <input
            type="date"
            id="fechaEntregaEstimada"
            name="fechaEntregaEstimada"
            className="form-control"
            value={form.fechaEntregaEstimada}
            onChange={handleChange}
            onBlur={() => handleBlur("fechaEntregaEstimada")}
            disabled={loading}
          />
        </div>

        {/* Observaciones */}
        <div className="col-md-12">
          <label htmlFor="observaciones" className="form-label">
            Observaciones
          </label>
          <textarea
            id="observaciones"
            name="observaciones"
            className="form-control"
            placeholder="Ingrese observaciones sobre el pedido"
            value={form.observaciones}
            onChange={handleChange}
            onBlur={() => handleBlur("observaciones")}
            disabled={loading}
            rows={3}
            maxLength={500}
          />
          <small className="text-muted">{form.observaciones.length}/500 caracteres</small>
        </div>

        {/* Detalles de Ítems */}
        <div className="col-12">
          <div className="card border-0 bg-light">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="mb-0">
                  <i className="bi bi-box-seam me-2"></i>
                  Ítems del Pedido
                </h6>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-primary"
                  onClick={handleAddItem}
                  disabled={loading}
                >
                  <i className="bi bi-plus-circle me-1"></i>
                  Agregar Ítem
                </button>
              </div>

              {form.detalles.length === 0 ? (
                <div className="text-center text-muted py-3">
                  <i className="bi bi-inbox fs-1"></i>
                  <p className="mb-0">No hay ítems agregados. Haga clic en "Agregar Ítem" para comenzar.</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-sm table-hover">
                    <thead className="table-light">
                      <tr>
                        <th style={{ width: "40%" }}>Material</th>
                        <th style={{ width: "20%" }} className="text-center">Cantidad</th>
                        <th style={{ width: "20%" }} className="text-end">Precio Unit.</th>
                        <th style={{ width: "15%" }} className="text-end">Subtotal</th>
                        <th style={{ width: "5%" }} className="text-center">Acción</th>
                      </tr>
                    </thead>
                    <tbody>
                      {form.detalles.map((item, index) => (
                        <tr key={index}>
                          <td>
                            <select
                              className={`form-select form-select-sm ${errors[`detalle_${index}_materialId`] ? 'is-invalid' : ''}`}
                              value={item.materialId}
                              onChange={(e) => handleItemChange(index, "materialId", e.target.value)}
                              disabled={loading}
                            >
                              <option value="">-- Seleccione --</option>
                              {materials.map((material) => (
                                <option key={material.id} value={material.id}>
                                  {material.tipoMaterialNombre || `Material #${material.id}`}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td>
                            <input
                              type="number"
                              className={`form-control form-control-sm ${errors[`detalle_${index}_cantidadSolicitada`] ? 'is-invalid' : ''}`}
                              placeholder="Cantidad"
                              value={item.cantidadSolicitada}
                              onChange={(e) => handleItemChange(index, "cantidadSolicitada", e.target.value)}
                              disabled={loading}
                              min="1"
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              className={`form-control form-control-sm ${errors[`detalle_${index}_precioUnitario`] ? 'is-invalid' : ''}`}
                              placeholder="Precio"
                              value={item.precioUnitario}
                              onChange={(e) => handleItemChange(index, "precioUnitario", e.target.value)}
                              disabled={loading}
                              min="0"
                              step="0.01"
                            />
                          </td>
                          <td className="text-end align-middle">
                            <span className="fw-semibold">
                              ${calculateSubtotal(item.cantidadSolicitada, item.precioUnitario).toFixed(2)}
                            </span>
                          </td>
                          <td className="text-center">
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleRemoveItem(index)}
                              disabled={loading}
                              title="Eliminar ítem"
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="table-light">
                      <tr>
                        <td colSpan="3" className="text-end fw-bold">Total:</td>
                        <td className="text-end fw-bold text-success">
                          ${calculateTotal().toFixed(2)}
                        </td>
                        <td></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              )}

              {errors.detalles && (
                <div className="text-danger small mt-2">
                  <i className="bi bi-exclamation-circle me-1"></i>
                  {errors.detalles}
                </div>
              )}
            </div>
          </div>
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
