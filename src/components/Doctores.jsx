import { useState, useEffect } from 'react';
import { api } from '../services/api.js';
import { cerrarModal } from '../modal.js';

const VACIO = {
  nombre: '',
  especialidad: '',
  licencia: '',
  email: '',
  telefono: '',
};

function Doctores() {
  const [doctores, setDoctores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(VACIO);
  const [editingId, setEditingId] = useState(null);
  const [original, setOriginal] = useState({});
  const [historias, setHistorias] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    cargarDoctores();
  }, []);

  const cargarDoctores = async () => {
    try {
      const data = await api.getDoctores();
      setDoctores(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        // PartialType: solo mandamos lo que cambió
        const cambios = Object.fromEntries(Object.entries(form).filter(([k, v]) => v !== original[k]));
        if (Object.keys(cambios).length) await api.updateDoctor(editingId, cambios);
        setEditingId(null);
      } else {
        await api.createDoctor(form);
      }
      setForm(VACIO);
      cerrarModal('modalDoctor');
      await cargarDoctores();
    } catch (err) {
      setError(err.message);
    }
  };

  // Si se canceló una edición, editingId y el form siguen cargados: hay que limpiarlos.
  const nuevo = () => {
    setEditingId(null);
    setForm(VACIO);
    setError('');
  };

  const editar = (d) => {
    const campos = Object.fromEntries(Object.keys(form).map(k => [k, d[k] ?? '']));
    setEditingId(d.id);
    setForm(campos);
    setOriginal(campos);
  };

  const verHistorias = async (d) => {
    try {
      setHistorias({ nombre: d.nombre, items: await api.getHistoriasDeDoctor(d.id) });
    } catch (err) {
      setError(err.message);
    }
  };

  const eliminar = async (id) => {
    if (!confirm('¿Eliminar este doctor?')) return;
    try {
      await api.deleteDoctor(id);
      await cargarDoctores();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="seccion-doctores">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0">Doctores</h1>
        <button className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modalDoctor" onClick={nuevo}>
          Nuevo doctor
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="table-responsive">
        <table className="table table-striped table-hover align-middle">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Especialidad</th>
              <th>Licencia</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="7" className="text-center">Cargando...</td></tr>
            ) : (
              doctores.map(d => (
                <tr key={d.id}>
                  <td>{d.id}</td>
                  <td>{d.nombre}</td>
                  <td>{d.especialidad}</td>
                  <td>{d.licencia}</td>
                  <td>{d.email}</td>
                  <td>{d.telefono}</td>
                  <td>
                    <button className="btn btn-sm btn-outline-secondary me-1" onClick={() => verHistorias(d)}>Historias</button>
                    <button className="btn btn-sm btn-outline-primary me-1" data-bs-toggle="modal" data-bs-target="#modalDoctor" onClick={() => editar(d)}>Editar</button>
                    <button className="btn btn-sm btn-danger" onClick={() => eliminar(d.id)}>Eliminar</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {historias && (
        <div className="card mb-4">
          <div className="card-header d-flex justify-content-between align-items-center">
            <span>Historias clínicas de {historias.nombre}</span>
            <button type="button" className="btn-close" onClick={() => setHistorias(null)}></button>
          </div>
          <ul className="list-group list-group-flush">
            {historias.items.length === 0 ? (
              <li className="list-group-item">Este doctor no tiene historias clínicas</li>
            ) : (
              historias.items.map(h => (
                <li key={h.id} className="list-group-item">
                  <strong>#{h.id}</strong> · {h.fecha} · {h.diagnostico}
                </li>
              ))
            )}
          </ul>
        </div>
      )}

      <div className="modal fade" id="modalDoctor" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{editingId ? 'Editar doctor' : 'Nuevo doctor'}</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Nombre completo</label>
                  <input type="text" maxLength={255} className="form-control" name="nombre" value={form.nombre} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Especialidad</label>
                  <input type="text" maxLength={255} className="form-control" name="especialidad" value={form.especialidad} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Licencia</label>
                  <input type="text" maxLength={50} className="form-control" name="licencia" value={form.licencia} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input type="email" maxLength={255} className="form-control" name="email" value={form.email} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Teléfono</label>
                  <input type="tel" inputMode="numeric" pattern="\d{7,15}" title="Solo dígitos, entre 7 y 15"
                    className="form-control" name="telefono" value={form.telefono} onChange={handleChange} required />
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Guardar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Doctores;
