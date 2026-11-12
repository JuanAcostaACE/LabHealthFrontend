import { useState, useEffect } from 'react';
import { api } from '../services/api.js';

function HistoriasClinicas() {
  const [historias, setHistorias] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [doctores, setDoctores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    pacienteId: '',
    doctorId: '',
    fecha: '',
    diagnostico: '',
    tratamiento: '',
    observaciones: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    cargarTodo();
  }, []);

  const cargarTodo = async () => {
    try {
      const [hRes, pRes, dRes] = await Promise.all([
        api.getHistorias(),
        api.getPacientes(),
        api.getDoctores(),
      ]);
      setHistorias(hRes);
      setPacientes(pRes);
      setDoctores(dRes);
    } catch (err) {
      setError('Error al cargar datos');
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
      await api.createHistoria({
        pacienteId: Number(form.pacienteId),
        doctorId: Number(form.doctorId),
        fecha: form.fecha,
        diagnostico: form.diagnostico,
        tratamiento: form.tratamiento,
        observaciones: form.observaciones,
      });
      setForm({ pacienteId: '', doctorId: '', fecha: '', diagnostico: '', tratamiento: '', observaciones: '' });
      await cargarTodo();
    } catch (err) {
      setError('Error al guardar historia clínica');
    }
  };

  const eliminar = async (id) => {
    if (!confirm('¿Eliminar esta historia clínica?')) return;
    try {
      await api.deleteHistoria(id);
      await cargarTodo();
    } catch (err) {
      setError('Error al eliminar historia clínica');
    }
  };

  return (
    <div className="seccion-historias">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0">Historias Clínicas</h1>
        <button className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modalHistoria">
          Nueva historia clínica
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="table-responsive">
        <table className="table table-striped table-hover align-middle">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Paciente</th>
              <th>Doctor</th>
              <th>Fecha</th>
              <th>Diagnóstico</th>
              <th>Tratamiento</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="7" className="text-center">Cargando...</td></tr>
            ) : (
              historias.map(h => (
                <tr key={h.id}>
                  <td>{h.id}</td>
                  <td>{h.paciente?.nombre ?? h.pacienteId}</td>
                  <td>{h.doctor?.nombre ?? h.doctorId}</td>
                  <td>{h.fecha}</td>
                  <td>{h.diagnostico}</td>
                  <td>{h.tratamiento}</td>
                  <td>
                    <button className="btn btn-sm btn-danger" onClick={() => eliminar(h.id)}>Eliminar</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="modal fade" id="modalHistoria" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Nueva historia clínica</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Paciente</label>
                  <select className="form-select" name="pacienteId" value={form.pacienteId} onChange={handleChange} required>
                    <option value="">Seleccione paciente</option>
                    {pacientes.map(p => (
                      <option key={p.id} value={p.id}>{p.nombre}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Doctor</label>
                  <select className="form-select" name="doctorId" value={form.doctorId} onChange={handleChange} required>
                    <option value="">Seleccione doctor</option>
                    {doctores.map(d => (
                      <option key={d.id} value={d.id}>{d.nombre}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Fecha</label>
                  <input type="date" className="form-control" name="fecha" value={form.fecha} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Diagnóstico</label>
                  <input type="text" className="form-control" name="diagnostico" value={form.diagnostico} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Tratamiento</label>
                  <input type="text" className="form-control" name="tratamiento" value={form.tratamiento} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Observaciones</label>
                  <textarea className="form-control" name="observaciones" value={form.observaciones} onChange={handleChange} rows="3"></textarea>
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

export default HistoriasClinicas;
