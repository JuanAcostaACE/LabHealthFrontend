# LabHealt Frontend

Frontend de **LabHealt** (React + Vite) para la API de NestJS del repo
[LabHealt](https://github.com/JuanAcostaACE/LabHealt). Sin router ni librería de estado:
`App.jsx` guarda la sección activa y la navbar la cambia. Bootstrap 5.3 entra por CDN
en `index.html`.

## Requisitos

- Node 18+
- La API corriendo (por defecto en `http://localhost:3000`)

## Instalación y ejecución

```bash
npm install
cp .env.example .env   # opcional, por defecto apunta a http://localhost:3000
npm run dev            # http://localhost:5173
npm run build          # compila a ../dist/frontend
npm run preview
```

## Configuración

| Variable | Default | Para qué |
|---|---|---|
| `VITE_API_URL` | `http://localhost:3000` | URL base de la API |

La API habilita CORS (`app.enableCors()`), así que el front le pega directo; no hay proxy.

## Estructura

```
src/
  App.jsx                    sección activa (pacientes | doctores | historias | alertas)
  modal.js                   cierra un modal de Bootstrap después de guardar
  services/api.js            toda la comunicación con la API
  components/
    Navbar.jsx
    Pacientes.jsx
    Doctores.jsx
    HistoriasClinicas.jsx
    Alertas.jsx
```

## Qué hace cada sección

| Sección | Qué permite |
|---|---|
| **Pacientes** | CRUD + botón *Historias* (`GET /pacientes/:id/historias`) |
| **Doctores** | CRUD + botón *Historias* (`GET /doctores/:id/historias`) |
| **Historias Clínicas** | CRUD + botón *Alertas* (`GET /historias-clinicas/:id/alertas`) y alta de alertas de esa historia |
| **Alertas** | Lista y elimina alertas. **No se crean desde aquí**: `CreateAlertaDto` exige `historiaId`, así que se crean desde la historia |

## `services/api.js`

Un solo punto de entrada por método. Dos cosas que vale la pena saber:

- **Errores:** cada respuesta pasa por `leer(r)`, que revisa `r.ok` y lanza el `message`
  de Nest (que puede ser `string` o `string[]`). Los componentes muestran `err.message`,
  así que un 400 de validación se ve en pantalla tal como lo manda la API.
- **Relaciones:** `GET /pacientes/:id/historias` responde `{ data, count }` mientras que
  `/doctores/:id/historias` y `/historias-clinicas/:id/alertas` responden un array pelado.
  El helper `lista()` normaliza los tres a un array.

## Updates parciales

Los DTOs de update del backend usan `PartialType`, así que al editar se manda **solo lo
que cambió**, no la entidad completa.

## Integrantes

- Juan David Acosta Urbano
- Juan Esteban Cuaran Santander
- Joseph Herrera
