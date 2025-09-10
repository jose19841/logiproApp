// src/components/DataTable.jsx
import { useMemo, useState } from "react";

/**
 * DataTable (Bootstrap 5)
 * Tabla genérica reutilizable.
 *
 * Props:
 * - columns: Array<{
 *     key: string;              // clave del dato (ej. "nombre", "email")
 *     label: string;            // texto de cabecera
 *     align?: "start"|"center"|"end";
 *     sortable?: boolean;       // habilita ordenamiento
 *     render?: (value, row) => React.ReactNode; // render custom por celda
 *   }>
 * - data: Array<object>
 * - loading?: boolean
 * - error?: string
 * - emptyMessage?: string
 * - onRowClick?: (row) => void
 * - rowKey?: string | ((row) => string|number) // key estable del <tr>
 */
export default function DataTable({
  columns = [],
  data = [],
  loading = false,
  error = "",
  emptyMessage = "Sin registros por ahora.",
  onRowClick,
  rowKey,
}) {
  const [sort, setSort] = useState({ key: null, dir: "asc" }); // "asc" | "desc"

  const sortedData = useMemo(() => {
    if (!sort.key) return data;
    const col = columns.find((c) => c.key === sort.key);
    if (!col) return data;

    const dir = sort.dir === "asc" ? 1 : -1;
    return [...data].sort((a, b) => {
      const av = a?.[col.key];
      const bv = b?.[col.key];

      // numérico si se puede
      const aNum = av !== null && av !== undefined && !isNaN(Number(av));
      const bNum = bv !== null && bv !== undefined && !isNaN(Number(bv));
      if (aNum && bNum) return (Number(av) - Number(bv)) * dir;

      // string fallback
      const as = (av ?? "").toString().toLowerCase();
      const bs = (bv ?? "").toString().toLowerCase();
      if (as < bs) return -1 * dir;
      if (as > bs) return 1 * dir;
      return 0;
    });
  }, [data, columns, sort]);

  const handleSort = (key, sortable) => {
    if (!sortable) return;
    setSort((prev) =>
      prev.key !== key ? { key, dir: "asc" } : { key, dir: prev.dir === "asc" ? "desc" : "asc" }
    );
  };

  const getRowKey = (row, idx) => {
    if (typeof rowKey === "function") return rowKey(row);
    if (typeof rowKey === "string") return row?.[rowKey] ?? idx;
    return row?.id ?? idx;
  };

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        {loading && (
          <div className="d-flex align-items-center gap-2 text-muted">
            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            <span>Cargando...</span>
          </div>
        )}

        {!loading && error && (
          <div className="alert alert-danger mb-0" role="alert">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="table-responsive">
            <table className="table align-middle">
              <thead>
                <tr>
                  {columns.map((col) => {
                    const isSorted = sort.key === col.key;
                    const arrow = isSorted ? (sort.dir === "asc" ? " ▲" : " ▼") : "";
                    const alignClass =
                      col.align === "end" ? "text-end" :
                      col.align === "center" ? "text-center" : "";

                    return (
                      <th
                        key={col.key}
                        scope="col"
                        className={`${alignClass} ${col.sortable ? "user-select-none" : ""}`}
                        style={{ cursor: col.sortable ? "pointer" : "default" }}
                        onClick={() => handleSort(col.key, col.sortable)}
                        aria-sort={isSorted ? (sort.dir === "asc" ? "ascending" : "descending") : "none"}
                      >
                        {col.label}{col.sortable && <span>{arrow}</span>}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {sortedData.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length} className="text-center text-muted py-4">
                      {emptyMessage}
                    </td>
                  </tr>
                ) : (
                  sortedData.map((row, idx) => (
                    <tr
                      key={getRowKey(row, idx)}
                      role={onRowClick ? "button" : undefined}
                      className={onRowClick ? "table-row-click" : ""}
                      onClick={onRowClick ? () => onRowClick(row) : undefined}
                      style={onRowClick ? { cursor: "pointer" } : undefined}
                    >
                      {columns.map((col) => {
                        const alignClass =
                          col.align === "end" ? "text-end" :
                          col.align === "center" ? "text-center" : "";
                        const value = row?.[col.key];

                        return (
                          <td key={col.key} className={alignClass}>
                            {col.render ? col.render(value, row) : (value ?? "-")}
                          </td>
                        );
                      })}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
