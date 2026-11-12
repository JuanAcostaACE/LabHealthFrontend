import { useState, useEffect } from 'react';
import { api } from '../services/api.js';

function Alertas() {
  const [alertas, setAlertas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    cargarAlertas();
  }, []);

  const cargarAlertas = async () => {
    try {
      setAlertas(await api.getAlertas());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const eliminar = async (id) => {
    if (!confirm('¿Eliminar esta alerta?')) return;
    try {
      await api.deleteAlerta(id);
      await cargarAlertas();
    } catch (err) {
      setError(err.message);
    }
  };

  const colorNivel = { Bajo: 'bg-success', Medio: 'bg-warning text-dark', Alto: 'bg-danger' };

  return (
    <div className="seccion-alertas">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0">Alertas de anormalidad</h1>
      </div>

      <div className="alert alert-info">Las alertas se crean desde una historia clínica.</div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="table-responsive">
        <table className="table table-striped table-hover align-middle">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Nivel</th>
              <th>Resultado</th>
              <th>Mensaje</th>
              <th>Historia</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" className="text-center">Cargando...</td></tr>
            ) : alertas.length === 0 ? (
              <tr><td colSpan="6" className="text-center">No hay alertas registradas</td></tr>
            ) : (
              alertas.map(a => (
                <tr key={a.id}>
                  <td>{a.id}</td>
                  <td><span className={`badge ${colorNivel[a.nivel] ?? 'bg-secondary'}`}>{a.nivel}</span></td>
                  <td>{a.resultado}</td>
                  <td>{a.mensaje}</td>
                  <td>#{a.historiaId}</td>
                  <td>
                    <button className="btn btn-sm btn-danger" onClick={() => eliminar(a.id)}>Eliminar</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Alertas;
