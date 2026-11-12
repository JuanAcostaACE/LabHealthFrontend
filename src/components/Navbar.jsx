function Navbar({ seccion, setSeccion }) {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <a className="navbar-brand" href="#" onClick={(e) => { e.preventDefault(); setSeccion('pacientes'); }}>
          LabHealt
        </a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className={`nav-item ${seccion === 'pacientes' ? 'active' : ''}`}>
              <a className="nav-link" href="#" onClick={(e) => { e.preventDefault(); setSeccion('pacientes'); }}>
                Pacientes
              </a>
            </li>
            <li className={`nav-item ${seccion === 'doctores' ? 'active' : ''}`}>
              <a className="nav-link" href="#" onClick={(e) => { e.preventDefault(); setSeccion('doctores'); }}>
                Doctores
              </a>
            </li>
            <li className={`nav-item ${seccion === 'historias' ? 'active' : ''}`}>
              <a className="nav-link" href="#" onClick={(e) => { e.preventDefault(); setSeccion('historias'); }}>
                Historias Clínicas
              </a>
            </li>
            <li className={`nav-item ${seccion === 'alertas' ? 'active' : ''}`}>
              <a className="nav-link" href="#" onClick={(e) => { e.preventDefault(); setSeccion('alertas'); }}>
                Alertas
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
