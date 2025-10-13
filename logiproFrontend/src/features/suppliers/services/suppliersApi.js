

import apiClient from "@shared/services/apiClient";

const BASE_PATH = "/api/proveedores";


export async function createSupplier(dto) {
  const { data } = await apiClient.post(BASE_PATH, dto);
  return data;
}


export async function listSuppliers() {
  const { data } = await apiClient.get(BASE_PATH);
  return data;
}


export async function getSupplierById(id) {
  const { data } = await apiClient.get(`${BASE_PATH}/${id}`);
  return data;
}


export async function updateSupplier(id, dto) {
  const { data } = await apiClient.patch(`${BASE_PATH}/${id}`, dto);
  return data;
}
