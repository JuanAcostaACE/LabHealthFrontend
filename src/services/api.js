const API = 'http://localhost:3000';

export const api = {
  // Pacientes
  getPacientes: () => fetch(`${API}/pacientes`).then(r => r.json()),
  createPaciente: (data) => fetch(`${API}/pacientes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(r => r.json()),
  updatePaciente: (id, data) => fetch(`${API}/pacientes/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(r => r.json()),
  deletePaciente: (id) => fetch(`${API}/pacientes/${id}`, {
    method: 'DELETE',
  }).then(r => r.json()),

  // Doctores
  getDoctores: () => fetch(`${API}/doctores`).then(r => r.json()),
  createDoctor: (data) => fetch(`${API}/doctores`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(r => r.json()),
  updateDoctor: (id, data) => fetch(`${API}/doctores/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(r => r.json()),
  deleteDoctor: (id) => fetch(`${API}/doctores/${id}`, {
    method: 'DELETE',
  }).then(r => r.json()),

  // Historias Clínicas
  getHistorias: () => fetch(`${API}/historias-clinicas`).then(r => r.json()),
  createHistoria: (data) => fetch(`${API}/historias-clinicas`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(r => r.json()),
  deleteHistoria: (id) => fetch(`${API}/historias-clinicas/${id}`, {
    method: 'DELETE',
  }).then(r => r.json()),
};
