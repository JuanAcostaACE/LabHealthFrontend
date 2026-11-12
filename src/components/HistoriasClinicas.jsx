import { useState, useEffect } from 'react';
import { api } from '../services/api.js';
import { cerrarModal } from '../modal.js';

const VACIO = {
  pacienteId: '',
  doctorId: '',
  fecha: '',
  diagnostico: '',
  tratamiento: '',
  observaciones: '',
};

function HistoriasClinicas() {
  const [historias, setHistorias] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [doctores, setDoctores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(VACIO);
  const [editingId, setEditingId] = useState(null);
  const [original, setOriginal] = useState({});
  const [alertas, setAlertas] = useState(null);
  const [formAlerta, setFormAlerta] = useState({ resultado: '', mensaje: '', nivel: 'Bajo' });
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
      const datos = {
        ...form,
        pacienteId: Number(form.pacienteId),
        doctorId: Number(form.doctorId),
      };
      if (editingId) {
        // PartialType: solo mandamos lo que cambió
        const cambios = Object.fromEntries(Object.entries(datos).filter(([k, v]) => String(v) !== String(original[k])));
        if (Object.keys(cambios).length) await api.updateHistoria(editingId, cambios);
        setEditingId(null);
      } else {
        await api.createHistoria(datos);
      }
      setForm(VACIO);
      cerrarModal('modalHistoria');
      await cargarTodo();
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

  const editar = (h) => {
    const campos = Object.fromEntries(Object.keys(form).map(k => [k, h[k] ?? '']));
    setEditingId(h.id);
    setForm(campos);
    setOriginal(campos);
  };

  const verAlertas = async (h) => {
    try {
      setAlertas({ historiaId: h.id, items: await api.getAlertasDeHistoria(h.id) });
      setFormAlerta({ resultado: '', mensaje: '', nivel: 'Bajo' });
    } catch (err) {
      setError(err.message);
    }
  };

  const crearAlerta = async (e) => {
    e.preventDefault();
    try {
      await api.createAlerta({ ...formAlerta, historiaId: alertas.historiaId });
      setAlertas({ historiaId: alertas.historiaId, items: await api.getAlertasDeHistoria(alertas.historiaId) });
      setFormAlerta({ resultado: '', mensaje: '', nivel: 'Bajo' });
    } catch (err) {
      setError(err.message);
    }
  };

  const eliminar = async (id) => {
    if (!confirm('¿Eliminar esta historia clínica?')) return;
    try {
      await api.deleteHistoria(id);
      await cargarTodo();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="seccion-historias">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0">Historias Clínicas</h1>
        <button className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modalHistoria" onClick={nuevo}>
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
                    <button className="btn btn-sm btn-outline-secondary me-1" onClick={() => verAlertas(h)}>Alertas</button>
                    <button className="btn btn-sm btn-outline-primary me-1" data-bs-toggle="modal" data-bs-target="#modalHistoria" onClick={() => editar(h)}>Editar</button>
                    <button className="btn btn-sm btn-danger" onClick={() => eliminar(h.id)}>Eliminar</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {alertas && (
        <div className="card mb-4">
          <div className="card-header d-flex justify-content-between align-items-center">
            <span>Alertas de la historia #{alertas.historiaId}</span>
            <button type="button" className="btn-close" onClick={() => setAlertas(null)}></button>
          </div>
          <ul className="list-group list-group-flush">
            {alertas.items.length === 0 ? (
              <li className="list-group-item">Esta historia no tiene alertas</li>
            ) : (
              alertas.items.map(a => (
                <li key={a.id} className="list-group-item">
                  <span className="badge bg-secondary me-2">{a.nivel}</span>
                  <strong>{a.resultado}</strong> · {a.mensaje}
                </li>
              ))
            )}
          </ul>
          <div className="card-body">
            <form className="row g-2 align-items-end" onSubmit={crearAlerta}>
              <div className="col-md-3">
                <label className="form-label">Resultado</label>
                <input type="text" maxLength={255} className="form-control" value={formAlerta.resultado}
                  onChange={(e) => setFormAlerta({ ...formAlerta, resultado: e.target.value })} required />
              </div>
              <div className="col-md-5">
                <label className="form-label">Mensaje</label>
                <input type="text" maxLength={500} className="form-control" value={formAlerta.mensaje}
                  onChange={(e) => setFormAlerta({ ...formAlerta, mensaje: e.target.value })} required />
              </div>
              <div className="col-md-2">
                <label className="form-label">Nivel</label>
                <select className="form-select" value={formAlerta.nivel}
                  onChange={(e) => setFormAlerta({ ...formAlerta, nivel: e.target.value })}>
                  <option value="Bajo">Bajo</option>
                  <option value="Medio">Medio</option>
                  <option value="Alto">Alto</option>
                </select>
              </div>
              <div className="col-md-2">
                <button type="submit" className="btn btn-primary w-100">Agregar alerta</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="modal fade" id="modalHistoria" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{editingId ? 'Editar historia clínica' : 'Nueva historia clínica'}</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
            </div>
            <div className="modal-body">
              {/* La alerta de la página queda tapada por el backdrop del modal */}
              {error && <div className="alert alert-danger">{error}</div>}
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
                  <input type="text" maxLength={500} className="form-control" name="diagnostico" value={form.diagnostico} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Tratamiento</label>
                  <input type="text" maxLength={500} className="form-control" name="tratamiento" value={form.tratamiento} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Observaciones</label>
                  <textarea maxLength={1000} className="form-control" name="observaciones" value={form.observaciones} onChange={handleChange} rows="3"></textarea>
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
