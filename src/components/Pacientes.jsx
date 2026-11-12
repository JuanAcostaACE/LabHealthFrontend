import { useState, useEffect } from 'react';
import { api } from '../services/api.js';
import { cerrarModal } from '../modal.js';

function Pacientes() {
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    nombre: '',
    documento: '',
    telefono: '',
    email: '',
    fechaNacimiento: '',
    tipoSangre: '',
    antecedentesClinicos: '',
  });
  const [editingId, setEditingId] = useState(null);
  const [original, setOriginal] = useState({});
  const [historias, setHistorias] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    cargarPacientes();
  }, []);

  const cargarPacientes = async () => {
    try {
      const data = await api.getPacientes();
      setPacientes(data);
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
        if (Object.keys(cambios).length) await api.updatePaciente(editingId, cambios);
        setEditingId(null);
      } else {
        await api.createPaciente(form);
      }
      setForm({ nombre: '', documento: '', telefono: '', email: '', fechaNacimiento: '', tipoSangre: '', antecedentesClinicos: '' });
      cerrarModal('modalPaciente');
      await cargarPacientes();
    } catch (err) {
      setError(err.message);
    }
  };

  const editar = (p) => {
    const campos = Object.fromEntries(Object.keys(form).map(k => [k, p[k] ?? '']));
    setEditingId(p.id);
    setForm(campos);
    setOriginal(campos);
  };

  const verHistorias = async (p) => {
    try {
      setHistorias({ nombre: p.nombre, items: await api.getHistoriasDePaciente(p.id) });
    } catch (err) {
      setError(err.message);
    }
  };

  const eliminar = async (id) => {
    if (!confirm('¿Eliminar este paciente?')) return;
    try {
      await api.deletePaciente(id);
      await cargarPacientes();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="seccion-pacientes">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0">Pacientes</h1>
        <button className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modalPaciente">
          Nuevo paciente
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="table-responsive">
        <table className="table table-striped table-hover align-middle">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Documento</th>
              <th>Teléfono</th>
              <th>Email</th>
              <th>Fecha Nacimiento</th>
              <th>Tipo Sangre</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="8" className="text-center">Cargando...</td></tr>
            ) : (
              pacientes.map(p => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.nombre}</td>
                  <td>{p.documento}</td>
                  <td>{p.telefono}</td>
                  <td>{p.email}</td>
                  <td>{p.fechaNacimiento}</td>
                  <td>{p.tipoSangre}</td>
                  <td>
                    <button className="btn btn-sm btn-outline-secondary me-1" onClick={() => verHistorias(p)}>Historias</button>
                    <button className="btn btn-sm btn-outline-primary me-1" data-bs-toggle="modal" data-bs-target="#modalPaciente" onClick={() => editar(p)}>Editar</button>
                    <button className="btn btn-sm btn-danger" onClick={() => eliminar(p.id)}>Eliminar</button>
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
              <li className="list-group-item">Este paciente no tiene historias clínicas</li>
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

      <div className="modal fade" id="modalPaciente" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{editingId ? 'Editar paciente' : 'Nuevo paciente'}</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Nombre completo</label>
                  <input type="text" maxLength={255} className="form-control" name="nombre" value={form.nombre} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Documento</label>
                  <input type="text" maxLength={50} className="form-control" name="documento" value={form.documento} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Teléfono</label>
                  <input type="tel" inputMode="numeric" pattern="\d{7,15}" title="Solo dígitos, entre 7 y 15"
                    className="form-control" name="telefono" value={form.telefono} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input type="email" maxLength={255} className="form-control" name="email" value={form.email} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Fecha de nacimiento</label>
                  <input type="date" className="form-control" name="fechaNacimiento" value={form.fechaNacimiento} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Tipo de sangre</label>
                  <select className="form-select" name="tipoSangre" value={form.tipoSangre} onChange={handleChange} required>
                    <option value="">Seleccione</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Antecedentes clínicos</label>
                  <textarea maxLength={1000} className="form-control" name="antecedentesClinicos" value={form.antecedentesClinicos} onChange={handleChange} rows="3"></textarea>
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

export default Pacientes;
