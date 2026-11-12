// LabHealt Frontend - Componente principal
import { useState } from 'react';
import Navbar from './components/Navbar.jsx';
import Pacientes from './components/Pacientes.jsx';
import Doctores from './components/Doctores.jsx';
import HistoriasClinicas from './components/HistoriasClinicas.jsx';
import Alertas from './components/Alertas.jsx';

function App() {
  const [seccion, setSeccion] = useState('pacientes');

  return (
    <div className="app">
      <Navbar seccion={seccion} setSeccion={setSeccion} />
      <main className="container mt-4">
        {seccion === 'pacientes' && <Pacientes />}
        {seccion === 'doctores' && <Doctores />}
        {seccion === 'historias' && <HistoriasClinicas />}
        {seccion === 'alertas' && <Alertas />}
      </main>
    </div>
  );
}

export default App;

