// src/features/users/hooks/useList.js
import { useCallback, useEffect, useState } from "react";
import useToast from "@shared/hooks/useToast";
import { changeUserState, fetchUsers } from "@/features/users/services/userList";

/**
 * Hook de listado de usuarios.
 * Encapsula: carga, mapeo de filas, errores, refresh, cambio de estado y UI states.
 */
export default function useList() {
  const toast = useToast();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [showStatesFor, setShowStatesFor] = useState(null); // Control de menú expandido

  const mapRows = useCallback((data) => {
    return (Array.isArray(data) ? data : []).map((u) => ({
      id: u.id || u.id_usuario || u.idUsuario,
      usuario: u.usuario,
      nombre: u.nombre,
      apellido: u.apellido,
      nombreCompleto: `${u.nombre ?? ""} ${u.apellido ?? ""}`.trim(),
      email: u.email,
      telefono: u.telefono,
      domicilio: u.domicilio,
      dni: u.dni,
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
        toast.showError("Estado inválido", `Valor no permitido: ${nuevoEstado}`);
        return;
      }

      const confirmed = await toast.showConfirm(
        "¿Cambiar estado?",
        `El usuario "${row.usuario}" pasará a ${nuevoEstado}.`,
        "Cambiar",
        "Cancelar"
      );
      if (!confirmed) return;

      try {
        await changeUserState(row.id, nuevoEstado);
        toast.showSuccess("Estado actualizado", `El usuario ahora está ${nuevoEstado}.`);
        loadData();
        // Cerrar el menú después del cambio
        setShowStatesFor(null);
      } catch (e) {
        console.error(e);
        toast.showError("Error", "No se pudo cambiar el estado.");
      }
    },
    [loadData]
  );

  const toggleStatesMenu = useCallback((userId) => {
    setShowStatesFor(showStatesFor === userId ? null : userId);
  }, [showStatesFor]);

  return {
    rows,
    loading,
    err,
    reload: loadData,
    changeState: handleChangeState,
    showStatesFor,
    toggleStatesMenu,
  };
}