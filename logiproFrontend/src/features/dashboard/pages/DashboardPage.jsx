import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CardStat from "@/features/dashboard/components/CardStat";
import DataTable from "@shared/components/DataTable";
import { alertInfo as swalInfo } from "@shared/components/alerts/swal";
import { useAuth } from "@/features/auth/context/AuthContext";
import apiClient from "@shared/services/apiClient";
import "../styles/dashboard.css";

const alertInfo = swalInfo ?? ((msg) => window.alert(msg));

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    materiales: 0,
    proveedores: 0,
    reclamos: 0,
    inventario: 0,
  });

  // Cargar estadísticas desde los servicios existentes
  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        const [materialesRes, proveedoresRes, reclamosRes, inventarioRes] = await Promise.all([
          apiClient.get("/api/materiales").catch(() => ({ data: [] })),
          apiClient.get("/api/proveedores").catch(() => ({ data: [] })),
          apiClient.get("/api/reclamos").catch(() => ({ data: [] })),
          apiClient.get("/api/inventario").catch(() => ({ data: [] })),
        ]);

        setStats({
          materiales: materialesRes.data?.length || 0,
          proveedores: proveedoresRes.data?.length || 0,
          reclamos: reclamosRes.data?.length || 0,
          inventario: inventarioRes.data?.length || 0,
        });
      } catch (error) {
        console.error("Error loading dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  // Inventario con stock bajo
  const [lowStockItems, setLowStockItems] = useState([]);

  useEffect(() => {
    const loadLowStock = async () => {
      try {
        const res = await apiClient.get("/api/inventario").catch(() => ({ data: [] }));
        // Filtrar items donde la cantidad actual está por debajo del mínimo o cerca
        const low = (res.data || [])
          .filter(item => {
            if (!item.cantidadActual || !item.cantidadMinima) return false;
            // Mostrar si está por debajo del mínimo o dentro del 20% arriba del mínimo
            const margen = item.cantidadMinima * 0.2;
            return item.cantidadActual <= (item.cantidadMinima + margen);
          })
          .sort((a, b) => {
            // Ordenar por porcentaje (los más críticos primero)
            const pctA = (a.cantidadActual / a.cantidadMinima) * 100;
            const pctB = (b.cantidadActual / b.cantidadMinima) * 100;
            return pctA - pctB;
          })
          .slice(0, 10); // Mostrar máximo 10 items
        setLowStockItems(low);
      } catch (error) {
        console.error("Error loading low stock items:", error);
      }
    };
    loadLowStock();
  }, []);

  // Últimos materiales registrados (como actividad reciente)
  const [recentMaterials, setRecentMaterials] = useState([]);

  useEffect(() => {
    const loadRecent = async () => {
      try {
        const res = await apiClient.get("/api/materiales").catch(() => ({ data: [] }));
        // Mostrar los últimos 5 materiales ordenados por fecha de creación
        const sorted = (res.data || [])
          .sort((a, b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion))
          .slice(0, 5);
        setRecentMaterials(sorted);
      } catch (error) {
        console.error("Error loading recent materials:", error);
      }
    };
    loadRecent();
  }, []);

  const handleQuick = (route) => {
    if (route) navigate(route);
    else alertInfo("Próximamente");
  };

  return (
    <div className="dashboard-page">
      <div className="container-fluid py-3">
        {/* Título y bienvenida */}
        <div className="d-flex align-items-center justify-content-between mb-3">
          <div>
            <h1 className="h3 mb-0">Panel de Control</h1>
            {user && (
              <p className="text-muted mb-0">
                Bienvenido, <strong>{user.nombre || user.usuario}</strong>
                {user.rol && <span className="badge bg-primary ms-2">{user.rol}</span>}
              </p>
            )}
          </div>
        </div>

        {/* KPIs */}
        <div className="row g-3 mb-4">
          <div className="col-12 col-sm-6 col-xl-3">
            <CardStat
              label="Materiales"
              value={loading ? "..." : stats.materiales}
              hint="Total de materiales registrados"
            />
          </div>
          <div className="col-12 col-sm-6 col-xl-3">
            <CardStat
              label="Proveedores"
              value={loading ? "..." : stats.proveedores}
              hint="Proveedores activos"
            />
          </div>
          <div className="col-12 col-sm-6 col-xl-3">
            <CardStat
              label="Reclamos"
              value={loading ? "..." : stats.reclamos}
              hint="Reclamos registrados"
            />
          </div>
          <div className="col-12 col-sm-6 col-xl-3">
            <CardStat
              label="Inventario"
              value={loading ? "..." : stats.inventario}
              hint="Registros de inventario"
            />
          </div>
        </div>

        {/* Grid principal */}
        <div className="row g-3">
          {/* Inventario - Stock Bajo */}
          <div className="col-12 col-xl-8">
            <div className="card shadow-sm">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h2 className="h5 mb-0">
                  <i className="bi bi-exclamation-circle text-warning me-2"></i>
                  Control de Inventario
                </h2>
                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => navigate("/inventory")}
                >
                  Ver todo
                </button>
              </div>
              <div className="card-body">
                {lowStockItems.length === 0 ? (
                  <div className="text-center py-4">
                    <i className="bi bi-check-circle text-success" style={{ fontSize: "3rem" }}></i>
                    <p className="mt-2 mb-0 opacity-75">
                      Todo el inventario está en niveles óptimos
                    </p>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-sm align-middle mb-0">
                      <thead>
                        <tr>
                          <th>Sector</th>
                          <th>Material</th>
                          <th className="text-center">Cantidad</th>
                          <th className="text-center">Mínimo</th>
                          <th className="text-center">Máximo</th>
                          <th className="text-center">Estado</th>
                        </tr>
                      </thead>
                      <tbody>
                        {lowStockItems.map((item) => {
                          // ✅ Cálculo correcto: comparar cantidad actual vs mínima
                          const actual = item.cantidadActual || 0;
                          const min = item.cantidadMinima || 0;
                          const max = item.cantidadMaxima || min * 2;

                          let estadoBadge = "success";
                          let estadoTexto = "OK";

                          if (actual < min) {
                            // Por debajo del mínimo = CRÍTICO
                            estadoBadge = "danger";
                            estadoTexto = "Crítico";
                          } else if (actual <= min * 1.2) {
                            // Dentro del 20% arriba del mínimo = BAJO
                            estadoBadge = "warning";
                            estadoTexto = "Bajo";
                          }

                          return (
                            <tr key={item.id}>
                              <td>
                                <span className="fw-semibold">
                                  {item.sectorNombre || "Sin sector"}
                                </span>
                              </td>
                              <td>
                                <div className="small opacity-75">
                                  {item.materialNombre || `Material #${item.id}`}
                                </div>
                              </td>
                              <td className="text-center">
                                <span className={`badge bg-${estadoBadge}`}>
                                  {actual}
                                </span>
                              </td>
                              <td className="text-center">
                                <span className="badge bg-info">
                                  {min}
                                </span>
                              </td>
                              <td className="text-center">
                                <span className="badge bg-success">
                                  {max}
                                </span>
                              </td>
                              <td className="text-center">
                                <span className={`badge bg-${estadoBadge}`}>
                                  {estadoTexto}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Materiales recientes */}
          <div className="col-12 col-xl-4">
            <div className="card shadow-sm h-100">
              <div className="card-header">
                <h2 className="h5 mb-0">Materiales Recientes</h2>
              </div>
              <div className="card-body">
                {recentMaterials.length === 0 ? (
                  <p className="opacity-75 mb-0">No hay materiales registrados aún.</p>
                ) : (
                  <div className="list-group list-group-flush">
                    {recentMaterials.map((material) => (
                      <div
                        key={material.id}
                        className="list-group-item px-0 border-bottom"
                      >
                        <div className="d-flex justify-content-between align-items-start">
                          <div className="flex-grow-1">
                            <div className="fw-semibold">
                              {material.nombreTipoMaterial || `Material #${material.id}`}
                            </div>
                            <small className="opacity-75">
                              {material.proveedorDescripcion || "Sin proveedor"}
                            </small>
                          </div>
                          <span className="badge bg-primary">
                            {material.cantidad}
                          </span>
                        </div>
                        {material.fechaCreacion && (
                          <small className="opacity-75">
                            {new Date(material.fechaCreacion).toLocaleDateString('es-AR', {
                              day: '2-digit',
                              month: 'short'
                            })}
                          </small>
                        )}
                      </div>
                    ))}
                  </div>
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
                  onClick={() => handleQuick("/materials/new")}
                >
                  <i className="bi bi-plus-circle me-2"></i>
                  Nuevo Material
                </button>
                <button
                  type="button"
                  className="btn btn-outline-primary"
                  onClick={() => handleQuick("/inventory")}
                >
                  <i className="bi bi-box-seam me-2"></i>
                  Inventario
                </button>
                <button
                  type="button"
                  className="btn btn-outline-primary"
                  onClick={() => handleQuick("/suppliers")}
                >
                  <i className="bi bi-truck me-2"></i>
                  Proveedores
                </button>
                <button
                  type="button"
                  className="btn btn-outline-primary"
                  onClick={() => handleQuick("/claims")}
                >
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  Reclamos
                </button>
                {user?.rol === "ADMIN" && (
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => handleQuick("/usuarios")}
                  >
                    <i className="bi bi-people me-2"></i>
                    Usuarios
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Nota: luego integramos servicios y refactorizamos Accesos rápidos a componente propio */}
      </div>
    </div>
  );
}
