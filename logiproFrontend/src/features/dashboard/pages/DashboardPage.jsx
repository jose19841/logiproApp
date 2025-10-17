import CardStat from "@/features/dashboard/components/CardStat";
import DataTable from "@shared/components/DataTable";
import { alertInfo as swalInfo } from "@shared/components/alerts/swal";
import "../styles/dashboard.css";

const alertInfo = swalInfo ?? ((msg) => window.alert(msg));

export default function DashboardPage() {
  // KPIs mock (se reemplazan con servicios luego)
  const kpis = {
    productos: 0,
    stockTotal: 0,
    ordenesPendientes: 0,
    alertas: 0,
  };

  // Bajo stock (vacío por ahora)
  const lowStockItems = [];
  const lowStockColumns = [
    { key: "nombre", label: "Producto", sortable: true },
    { key: "codigo", label: "Código" },
    { key: "stock", label: "Stock", align: "end", sortable: true },
    { key: "minimo", label: "Mínimo", align: "end", sortable: true },
    {
      key: "estado",
      label: "Estado",
      render: (v, row) => {
        const isLow = Number(row?.stock ?? 0) <= Number(row?.minimo ?? 0);
        const text = v ?? (isLow ? "Bajo" : "OK");
        const badge = isLow ? "text-bg-warning" : "text-bg-success";
        return <span className={`badge ${badge}`}>{text}</span>;
      },
    },
  ];

  // Actividad reciente (placeholder vacío por ahora)
  const recentActivity = [];

  const handleQuick = (label) => alertInfo(`Próximamente: ${label}`);

  return (
    <div className="dashboard-page">
      <div className="container-fluid py-3">
        {/* Título */}
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h1 className="h3 mb-0">Panel de Inventario</h1>
        </div>

        {/* KPIs */}
        <div className="row g-3 mb-4">
          <div className="col-12 col-sm-6 col-xl-3">
            <CardStat label="Productos" value={kpis.productos} hint="Total de SKUs" />
          </div>
          <div className="col-12 col-sm-6 col-xl-3">
            <CardStat label="Stock total" value={kpis.stockTotal} hint="Unidades en almacén" />
          </div>
          <div className="col-12 col-sm-6 col-xl-3">
            <CardStat
              label="Órdenes pendientes"
              value={kpis.ordenesPendientes}
              hint="Por recibir / despachar"
            />
          </div>
          <div className="col-12 col-sm-6 col-xl-3">
            <CardStat
              label="Alertas"
              value={kpis.alertas}
              hint="Bajo stock / vencimientos"
            />
          </div>
        </div>

        {/* Grid principal */}
        <div className="row g-3">
          {/* Bajo stock */}
          <div className="col-12 col-xl-8">
            <div className="card shadow-sm">
              <div className="card-header">
                <h2 className="h5 mb-0">Bajo stock</h2>
              </div>
              <div className="card-body pt-0">
                <DataTable
                  columns={lowStockColumns}
                  data={lowStockItems}
                  emptyMessage="Sin registros por ahora."
                />
              </div>
            </div>
          </div>

          {/* Actividad reciente */}
          <div className="col-12 col-xl-4">
            <div className="card shadow-sm h-100">
              <div className="card-header">
                <h2 className="h5 mb-0">Actividad reciente</h2>
              </div>
              <div className="card-body">
                {recentActivity.length === 0 ? (
                  <p className="text-muted mb-0">No hay movimientos recientes.</p>
                ) : (
                  <ul className="list-group list-group-flush">
                    {recentActivity.map((mov) => (
                      <li
                        key={mov.id}
                        className="list-group-item px-0"
                        style={{
                          backgroundColor: "#2f3640",
                          color: "#eceff1",
                          borderColor: "#3a4750",
                        }}
                      >
                        <div className="d-flex justify-content-between">
                          <span className="fw-semibold">{mov.titulo}</span>
                          <small className="text-muted">{mov.fecha}</small>
                        </div>
                        {mov.detalle && <small className="text-muted">{mov.detalle}</small>}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>

          {/* Accesos rápidos */}
          <div className="col-12">
            <div className="card shadow-sm">
              <div className="card-header">
                <h2 className="h5 mb-0">Accesos rápidos</h2>
              </div>
              <div className="card-body d-flex flex-wrap gap-2">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => handleQuick("Nuevo movimiento")}
                >
                  Nuevo movimiento
                </button>
                <button
                  type="button"
                  className="btn btn-outline-primary"
                  onClick={() => handleQuick("Inventario")}
                >
                  Inventario
                </button>
                <button
                  type="button"
                  className="btn btn-outline-primary"
                  onClick={() => handleQuick("Órdenes")}
                >
                  Órdenes
                </button>
                <button
                  type="button"
                  className="btn btn-outline-primary"
                  onClick={() => handleQuick("Proveedores")}
                >
                  Proveedores
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Nota: luego integramos servicios y refactorizamos Accesos rápidos a componente propio */}
      </div>
    </div>
  );
}
