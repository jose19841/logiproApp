// src/features/orders/components/OrderDetail.jsx

/**
 * Componente modal para mostrar detalles de un pedido
 * @param {Object} order - Pedido a mostrar
 * @param {Function} onClose - Callback al cerrar
 * @param {Function} onEdit - Callback al editar
 */
export default function OrderDetail({ order, onClose, onEdit }) {
  if (!order) return null;

  const getEstadoBadge = (estado) => {
    let badgeClass = "secondary";
    switch (estado) {
      case "PENDIENTE":
        badgeClass = "warning";
        break;
      case "EN_PROCESO":
        badgeClass = "info";
        break;
      case "RECIBIDO":
        badgeClass = "success";
        break;
      case "CANCELADO":
        badgeClass = "danger";
        break;
    }
    return <span className={`badge bg-${badgeClass} fs-6`}>{estado.replace(/_/g, " ")}</span>;
  };

  return (
    <div
      className="modal fade show"
      style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}
      onClick={(e) => e.target === e.currentTarget && onClose?.()}
    >
      <div className="modal-dialog modal-xl">
        <div className="modal-content">
          <div className="modal-header bg-light">
            <h5 className="modal-title">
              <i className="bi bi-receipt me-2"></i>
              Detalles del Pedido
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
                      <div className="col-md-4">
                        <label className="form-label small mb-1">Número de Pedido</label>
                        <p className="fw-semibold mb-0">{order.numeroPedido || 'No especificado'}</p>
                      </div>
                      <div className="col-md-4">
                        <label className="form-label small mb-1">Estado</label>
                        <p className="fw-semibold mb-0">
                          {getEstadoBadge(order.estado)}
                        </p>
                      </div>
                      <div className="col-md-4">
                        <label className="form-label small mb-1">Monto Total</label>
                        <p className="fw-semibold mb-0 text-success">
                          ${order.montoTotal ? parseFloat(order.montoTotal).toFixed(2) : '0.00'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Fechas */}
              <div className="col-12">
                <div className="card border-0 bg-light">
                  <div className="card-body">
                    <h6 className="card-title mb-3">
                      <i className="bi bi-calendar-event me-2"></i>
                      Fechas
                    </h6>
                    <div className="row g-3">
                      <div className="col-md-4">
                        <label className="form-label small mb-1">Fecha de Pedido</label>
                        <p className="fw-semibold mb-0">
                          {order.fechaPedido ? new Date(order.fechaPedido).toLocaleDateString('es-AR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          }) : 'No especificado'}
                        </p>
                      </div>
                      <div className="col-md-4">
                        <label className="form-label small mb-1">Entrega Estimada</label>
                        <p className="fw-semibold mb-0">
                          {order.fechaEntregaEstimada ? new Date(order.fechaEntregaEstimada).toLocaleDateString('es-AR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          }) : 'No especificado'}
                        </p>
                      </div>
                      <div className="col-md-4">
                        <label className="form-label small mb-1">Entrega Real</label>
                        <p className="fw-semibold mb-0">
                          {order.fechaEntregaReal ? new Date(order.fechaEntregaReal).toLocaleDateString('es-AR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          }) : 'No registrado'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Proveedor y Usuario */}
              <div className="col-12">
                <div className="card border-0 bg-light">
                  <div className="card-body">
                    <h6 className="card-title mb-3">
                      <i className="bi bi-people me-2"></i>
                      Proveedor y Usuario
                    </h6>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label small mb-1">Proveedor</label>
                        <p className="fw-semibold mb-0">
                          {order.proveedorNombre || 'No especificado'}
                        </p>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small mb-1">Usuario Creador</label>
                        <p className="fw-semibold mb-0">
                          {order.usuarioNombre || 'No especificado'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Observaciones */}
              {order.observaciones && (
                <div className="col-12">
                  <div className="card border-0 bg-light">
                    <div className="card-body">
                      <h6 className="card-title mb-3">
                        <i className="bi bi-chat-left-text me-2"></i>
                        Observaciones
                      </h6>
                      <p className="mb-0">{order.observaciones}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Detalles de Ítems */}
              <div className="col-12">
                <div className="card border-0 bg-light">
                  <div className="card-body">
                    <h6 className="card-title mb-3">
                      <i className="bi bi-box-seam me-2"></i>
                      Detalles de Ítems
                    </h6>
                    {order.detalles && order.detalles.length > 0 ? (
                      <div className="table-responsive">
                        <table className="table table-sm table-hover">
                          <thead className="table-light">
                            <tr>
                              <th>Material</th>
                              <th className="text-center">Cant. Solicitada</th>
                              <th className="text-center">Cant. Recibida</th>
                              <th className="text-end">Precio Unit.</th>
                              <th className="text-end">Subtotal</th>
                            </tr>
                          </thead>
                          <tbody>
                            {order.detalles.map((detalle) => (
                              <tr key={detalle.id}>
                                <td>{detalle.materialNombre || `Material #${detalle.materialId}`}</td>
                                <td className="text-center">{detalle.cantidadSolicitada || 0}</td>
                                <td className="text-center">
                                  {detalle.cantidadRecibida !== null && detalle.cantidadRecibida !== undefined
                                    ? detalle.cantidadRecibida
                                    : '-'}
                                </td>
                                <td className="text-end">
                                  ${detalle.precioUnitario ? parseFloat(detalle.precioUnitario).toFixed(2) : '0.00'}
                                </td>
                                <td className="text-end fw-semibold">
                                  ${detalle.subtotal ? parseFloat(detalle.subtotal).toFixed(2) : '0.00'}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot className="table-light">
                            <tr>
                              <td colSpan="4" className="text-end fw-bold">Total:</td>
                              <td className="text-end fw-bold text-success">
                                ${order.montoTotal ? parseFloat(order.montoTotal).toFixed(2) : '0.00'}
                              </td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    ) : (
                      <p className="text-muted mb-0">No hay ítems en este pedido.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            {order.estado !== "RECIBIDO" && order.estado !== "CANCELADO" && (
              <button
                type="button"
                className="btn btn-outline-primary"
                onClick={() => {
                  onClose?.();
                  onEdit?.(order);
                }}
              >
                <i className="bi bi-pencil me-2"></i>
                Editar
              </button>
            )}
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
