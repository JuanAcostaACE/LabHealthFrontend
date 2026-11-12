# LabHealt Frontend

Interfaz web de **LabHealt**, construida con React 18 + Vite. Consume la API REST de
NestJS del repo [LabHealt](https://github.com/JuanAcostaACE/LabHealt) para administrar
pacientes, doctores, historias clínicas y alertas de anormalidad.

La navegación es por estado, sin router: `App.jsx` guarda la sección activa y la navbar
la cambia. Los estilos son de Bootstrap 5.3, cargado por CDN en `index.html`.

## Requisitos

- Node 18 o superior
- La API corriendo (por defecto en `http://localhost:3000`)

## Instalación y ejecución

```bash
npm install
cp .env.example .env   # opcional, por defecto apunta a http://localhost:3000
npm run dev            # http://localhost:5173
npm run build          # compila a ../dist/frontend
npm run preview        # sirve el build
```

## Configuración

| Variable | Default | Para qué |
|---|---|---|
| `VITE_API_URL` | `http://localhost:3000` | URL base de la API |

## Estructura

```
src/
  main.jsx                   punto de entrada
  App.jsx                    sección activa (pacientes | doctores | historias | alertas)
  modal.js                   cierre de modales de Bootstrap
  services/api.js            cliente de la API
  components/
    Navbar.jsx
    Pacientes.jsx
    Doctores.jsx
    HistoriasClinicas.jsx
    Alertas.jsx
```

## Secciones

| Sección | Qué muestra | Endpoints que usa |
|---|---|---|
| **Pacientes** | Tabla con alta, edición y baja; botón *Historias* por fila | `/pacientes`, `/pacientes/:id/historias` |
| **Doctores** | Tabla con alta, edición y baja; botón *Historias* por fila | `/doctores`, `/doctores/:id/historias` |
| **Historias Clínicas** | Tabla con el nombre del paciente y del doctor; botón *Alertas* por fila con el alta de alertas de esa historia | `/historias-clinicas`, `/historias-clinicas/:id/alertas`, `/alerta-anormalidad` |
| **Alertas** | Tabla de todas las alertas con su nivel y la historia a la que pertenecen | `/alerta-anormalidad` |

Las alertas se crean desde la historia clínica, porque la API las pide con el
`historiaId` al que pertenecen.

## Cliente de la API (`services/api.js`)

Concentra las llamadas HTTP. Cada respuesta se revisa antes de devolverse: si el estado
no es correcto, se lanza el `message` que envía la API (que puede ser un texto o una
lista de textos) y la sección lo muestra en pantalla.

Los endpoints de relación no comparten formato: `/pacientes/:id/historias` responde
`{ data, count }` y los otros dos un array, así que el cliente los entrega siempre como
array.

Las ediciones se envían como actualización parcial: solo los campos modificados.

## Integrantes

- Juan David Acosta Urbano
- Juan Esteban Cuaran Santander
- Joseph Herrera
