const API = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

// Nest responde los errores como { message: string | string[] }; sin esto un 400 pasaba por éxito.
const leer = async (r) => {
  const body = r.status === 204 ? null : await r.json().catch(() => null);
  if (!r.ok) throw new Error([body?.message].flat().filter(Boolean).join(', ') || `Error ${r.status}`);
  return body;
};

const pedir = (metodo, ruta, data) => fetch(`${API}${ruta}`, {
  method: metodo,
  headers: data ? { 'Content-Type': 'application/json' } : undefined,
  body: data ? JSON.stringify(data) : undefined,
}).then(leer);

// /pacientes/:id/historias responde { data, count } y los otros dos un array pelado.
const lista = (r) => (Array.isArray(r) ? r : r?.data ?? []);

export const api = {
  // Pacientes
  getPacientes: () => pedir('GET', '/pacientes'),
  createPaciente: (data) => pedir('POST', '/pacientes', data),
  updatePaciente: (id, data) => pedir('PUT', `/pacientes/${id}`, data),
  deletePaciente: (id) => pedir('DELETE', `/pacientes/${id}`),
  getHistoriasDePaciente: (id) => pedir('GET', `/pacientes/${id}/historias`).then(lista),

  // Doctores
  getDoctores: () => pedir('GET', '/doctores'),
  createDoctor: (data) => pedir('POST', '/doctores', data),
  updateDoctor: (id, data) => pedir('PUT', `/doctores/${id}`, data),
  deleteDoctor: (id) => pedir('DELETE', `/doctores/${id}`),
  getHistoriasDeDoctor: (id) => pedir('GET', `/doctores/${id}/historias`).then(lista),

  // Historias Clínicas
  getHistorias: () => pedir('GET', '/historias-clinicas'),
  createHistoria: (data) => pedir('POST', '/historias-clinicas', data),
  updateHistoria: (id, data) => pedir('PUT', `/historias-clinicas/${id}`, data),
  deleteHistoria: (id) => pedir('DELETE', `/historias-clinicas/${id}`),
  getAlertasDeHistoria: (id) => pedir('GET', `/historias-clinicas/${id}/alertas`).then(lista),

  // Alertas de anormalidad
  getAlertas: () => pedir('GET', '/alerta-anormalidad'),
  createAlerta: (data) => pedir('POST', '/alerta-anormalidad', data),
  updateAlerta: (id, data) => pedir('PUT', `/alerta-anormalidad/${id}`, data),
  deleteAlerta: (id) => pedir('DELETE', `/alerta-anormalidad/${id}`),
};
