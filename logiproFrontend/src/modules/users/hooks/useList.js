// src/modules/users/hooks/useList.js
import { useCallback, useEffect, useState } from "react";
import { alertConfirm, alertError, alertSuccess } from "../../../components/alerts/swal";
import { changeUserState, fetchUsers } from "../services/userList";

/**
 * Hook de listado de usuarios.
 * Encapsula: carga, mapeo de filas, errores, refresh y cambio de estado.
 */
export default function useList() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const mapRows = useCallback((data) => {
    return (Array.isArray(data) ? data : []).map((u) => ({
      id: u.id || u.id_usuario || u.idUsuario,
      usuario: u.usuario,
      nombre: u.nombre,
      apellido: u.apellido,
      nombreCompleto: `${u.nombre ?? ""} ${u.apellido ?? ""}`.trim(),
      email: u.email,
      rol: u.rol?.nombre || u.rol || "-",
      // Estados válidos del backend: REGISTRADO | ACTIVO | INACTIVO | SUSPENDIDO
      estado: u.estado || u.status || "REGISTRADO",
      _raw: u,
    }));
  }, []);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setErr("");
      const data = await fetchUsers();
      setRows(mapRows(data));
    } catch (e) {
      console.error(e);
      setErr("No se pudo cargar el listado de usuarios.");
    } finally {
      setLoading(false);
    }
  }, [mapRows]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleChangeState = useCallback(
    async (row, nuevoEstado) => {
      // Validación rápida contra el enum real del backend
      const ALLOWED = new Set(["REGISTRADO", "ACTIVO", "INACTIVO", "SUSPENDIDO"]);
      if (!ALLOWED.has(nuevoEstado)) {
        alertError("Estado inválido", `Valor no permitido: ${nuevoEstado}`);
        return;
      }

      const ok = await alertConfirm(
        "¿Cambiar estado?",
        `El usuario "${row.usuario}" pasará a ${nuevoEstado}.`
      );
      if (!ok.isConfirmed) return;

      try {
        await changeUserState(row.id, nuevoEstado);
        await alertSuccess("Estado actualizado", `El usuario ahora está ${nuevoEstado}.`);
        loadData();
      } catch (e) {
        console.error(e);
        alertError("No se pudo cambiar el estado.");
      }
    },
    [loadData]
  );

  return {
    rows,
    loading,
    err,
    reload: loadData,
    changeState: handleChangeState,
  };
}
