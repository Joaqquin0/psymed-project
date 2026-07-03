# PsyMed — Prototipo de Interfaz Web

> Proyecto universitario — Curso Ágil · Noveno Ciclo

## Descripción

**PsyMed** es un prototipo de aplicación web para la gestión clínica de pacientes psiquiátricos. Permite a doctores y pacientes interactuar con sus respectivos flujos desde una interfaz moderna e intuitiva.

## Roles

| Rol | Acceso |
|---|---|
| **Doctor** | Login → Agenda → Pacientes → Ficha → Panel clínico → Citas → Resumen → Medicación → Documentos → Asistente IA |
| **Paciente** | Login → Inicio → Mis Citas → Reporte |

## Estructura del proyecto

```
psymed_project/
├── index.html              # Punto de entrada — selección de rol
├── psymed.css              # Estilos compartidos (layout full-viewport)
├── psymed.js               # Script compartido de navegación e interacciones
│
├── doctor/
│   ├── login.html          # Login del doctor
│   ├── registro.html       # Registro de nuevo doctor
│   ├── agenda.html         # Agenda principal con lista de pacientes
│   ├── lista.html          # Vista de lista de pacientes
│   ├── ficha.html          # Ficha individual del paciente
│   ├── panel.html          # Panel clínico (tareas, biológicas, prescripción)
│   ├── resumen.html        # Historia clínica / resumen diagnóstico
│   ├── medicacion.html     # Gestión de medicación
│   ├── documentos.html     # Documentos clínicos
│   ├── citas.html          # Gestión de citas
│   ├── asistente.html      # Asistente IA para consultas clínicas
│   ├── nuevo.html          # Nuevo paciente
│   └── perfil.html         # Perfil del doctor
│
└── paciente/
    ├── login.html          # Login del paciente
    ├── agenda.html         # Inicio / dashboard del paciente
    ├── citas.html          # Mis citas
    └── reporte.html        # Reporte de síntomas
```

## Cómo ejecutar

1. Abre `index.html` en cualquier servidor local, o usa Python:
   ```bash
   python -m http.server 9999
   ```
2. Navega a `http://localhost:9999`
3. Selecciona el rol (Doctor o Paciente) y explora el flujo

## Tecnologías

- **HTML5** — Estructura semántica de cada pantalla
- **CSS3** — Estilos compartidos en `psymed.css` (full-viewport, animaciones)
- **JavaScript (Vanilla)** — Navegación y microinteracciones en `psymed.js`
- **Google Fonts** — [Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans)

## Flujo de navegación (Doctor)

```
index.html
└── doctor/login.html
    └── doctor/agenda.html ←──────────────────┐
        ├── doctor/lista.html                  │
        │   └── doctor/ficha.html              │
        │       ├── doctor/resumen.html        │
        │       └── doctor/panel.html          │
        │           ├── doctor/medicacion.html │
        │           └── doctor/citas.html ─────┘
        └── doctor/asistente.html
```

## Integrantes del equipo

<!-- Agrega aquí los nombres de tu equipo -->
- ...

---

*Prototipo desarrollado como parte del curso de metodologías ágiles.*
