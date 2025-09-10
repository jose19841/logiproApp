import Swal from "sweetalert2";

export function alertSuccess(title = "ok", text = "") {
  return Swal.fire({
    icon: "success",
    title,
    text,
    confirmButtonText: "Aceptar",
  });
}

export function alertError(title = "Error", text = "Ocurrió un error") {
  return Swal.fire({
    icon: "error",
    title,
    text,
    confirmButtonText: "Aceptar",
  });
}

export function alertConfirm(
  title = "¿Estás seguro?",
  text = "",
  confirmButtonText = "Si, continuar"
) {
  return Swal.fire({
    icon: "question",
    title,
    text,
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText: "Cancelar",
  });
}

export function alertInfo(title = "Info", text = "") {
  return Swal.fire({
    icon: "info",
    title,
    text,
    confirmButtonText: "Aceptar",
  });
}
  export function alertLoading(title = "Verificando sesión…") {
  return Swal.fire({
    title,
    allowOutsideClick: false,
    didOpen: () => Swal.showLoading(),
  });
}


