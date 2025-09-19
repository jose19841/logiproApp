// src/modules/users/pages/UserList.jsx
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import DataTable from "../../../components/DataTable";
import useList from "../hooks/useList";

export default function UserList() {
  const navigate = useNavigate();
  const { rows, loading, err, reload, changeState } = useList();

  const columns = useMemo(
    () => [
      { key: "usuario", label: "Usuario", sortable: true },
      { key: "nombreCompleto", label: "Nombre", sortable: true },
      { key: "email", label: "Email", sortable: true },
      { key: "rol", label: "Rol", sortable: true, align: "center" },
      {
        key: "estado",
        label: "Estado",
        sortable: true,
        align: "center",
        render: (value) => {
          const cls =
            value === "ACTIVO"
              ? "badge bg-success"
              : value === "INACTIVO"
              ? "badge bg-secondary"
              : value === "SUSPENDIDO"
              ? "badge bg-danger"
              : value === "REGISTRADO"
              ? "badge bg-info"
              : "badge bg-light text-dark";
          return <span className={cls}>{value ?? "-"}</span>;
        },
      },
      {
        key: "acciones",
        label: "",
        align: "end",
        render: (_, row) => (
          <div className="dropdown">
            <button
              className="btn btn-sm btn-outline-secondary"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              aria-label="Acciones"
              title="Acciones"
            >
              ⋮
            </button>
            <ul className="dropdown-menu dropdown-menu-end">
              <li>
                <button
                  className="dropdown-item"
                  onClick={() => navigate(`/usuarios/${row.id}`)}
                >
                  Ver usuario
                </button>
              </li>

              <li><hr className="dropdown-divider" /></li>
              <li className="dropdown-header">Cambiar estado</li>
              <li>
                <button
                  className="dropdown-item"
                  onClick={() => changeState(row, "ACTIVO")}
                >
                  Marcar como ACTIVO
                </button>
              </li>
              <li>
                <button
                  className="dropdown-item"
                  onClick={() => changeState(row, "INACTIVO")}
                >
                  Marcar como INACTIVO
                </button>
              </li>
              <li>
                <button
                  className="dropdown-item"
                  onClick={() => changeState(row, "SUSPENDIDO")}
                >
                  Marcar como SUSPENDIDO
                </button>
              </li>
              <li>
                <button
                  className="dropdown-item"
                  onClick={() => changeState(row, "REGISTRADO")}
                >
                  Marcar como REGISTRADO
                </button>
              </li>

              <li><hr className="dropdown-divider" /></li>
              <li>
                <button
                  className="dropdown-item"
                  onClick={() => navigate(`/usuarios/${row.id}/editar`)}
                >
                  Actualizar datos
                </button>
              </li>
            </ul>
          </div>
        ),
      },
    ],
    [changeState, navigate]
  );

  return (
    <div className="container-fluid">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h4 className="mb-0">Usuarios</h4>
        <div className="d-flex gap-2">
          <button
            className="btn btn-primary"
            onClick={() => navigate("/usuarios/nuevo")}
          >
            + Nuevo usuario
          </button>
          <button
            className="btn btn-outline-secondary"
            onClick={reload}
            disabled={loading}
          >
            {loading ? "Actualizando..." : "Refrescar"}
          </button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={rows}
        loading={loading}
        error={err}
        emptyMessage="No hay usuarios aún."
        rowKey="id"
      />
    </div>
  );
}
