# SEPE Campo - Frontend

Aplicación web construida con Next.js que consume la API del backend SEPE Campo para la captura y consolidación de actas de electrificación rural en baja tensión (BT).

## 🚀 Stack Tecnológico

- **Next.js 16** (App Router, compilador Turbopack)
- **React 19**
- **TypeScript**
- **Tailwind CSS 4**

## 🛠️ Configuración del Proyecto

### Requisitos Previos
- Node.js 18+ (probado con v24)
- Backend de SEPE Campo corriendo (ver `../sepe-campo-backend/README.md`)

### Instalación de Dependencias

```bash
npm install
```

### Variables de Entorno

Opcional. Por defecto la aplicación consume la API en `http://localhost:3001`. Para apuntar a otra dirección, crea un archivo `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## 🚀 Ejecución

### Desarrollo
```bash
npm run dev
```
La aplicación queda disponible en [http://localhost:3000](http://localhost:3000).

### Producción
```bash
npm run build
npm run start
```

### Lint
```bash
npm run lint
```

## 🔐 Autenticación

Todas las rutas de la aplicación (excepto `/auth/login` y `/auth/register`) requieren sesión iniciada. El token JWT emitido por el backend se guarda en `localStorage` bajo la clave `access_token`. Un componente de guardia (`AuthGuard`) redirige a `/auth/login` si no hay token, y el menú de navegación (Informe Total, Visitas, Nueva Visita, Cerrar sesión) solo se muestra con sesión activa.

Para crear el primer usuario, ejecuta `npm run create:admin` en el backend, o regístrate desde `/auth/register`.

## 🗺️ Rutas de la Aplicación

| Ruta | Descripción | Acceso |
|---|---|---|
| `/auth/login` | Inicio de sesión | Público |
| `/auth/register` | Registro de usuario | Público |
| `/` | Informe Total: cantidades consolidadas de todas las visitas | Requiere sesión |
| `/visitas` | Listado de visitas (crear, ver, eliminar) | Requiere sesión |
| `/visitas/crear` | Formulario de alta de una nueva visita | Requiere sesión |
| `/visitas/[id]` | Detalle de la visita, con pestañas: General, Usuarios, Apoyos, Tramos, Validaciones e Informe | Requiere sesión |
| `/visitas/[id]/consolidado` | Vista de consolidado de cantidades de la visita | Requiere sesión |

## 📋 Funcionalidades por pestaña (detalle de visita)

- **Usuarios**: registro de usuarios beneficiarios (nombre, medidor, observaciones).
- **Apoyos**: registro de postes con numeración autoincremental, marcado de poste nuevo/existente (checkbox "Poste Existente"), componentes y observaciones generales.
- **Tramos**: selección del apoyo de origen y destino por su código de campo, tipo de cable (dúplex/triplex) y longitud en metros.
- **Validaciones**: lista unificada de inconsistencias detectadas por el motor de reglas y observaciones registradas en usuarios, apoyos y tramos.
- **Informe**: resumen ejecutivo de la visita (totales, replanteo, medidores A1/A3, postes nuevos/existentes, cable dúplex/triplex).

## 🗂️ Estructura del Proyecto

```
src/
├── app/
│   ├── layout.tsx              # Layout raíz (envuelve todo con AuthGuard)
│   ├── page.tsx                 # Informe Total (pantalla de inicio)
│   ├── auth/login/              # Login
│   ├── auth/register/           # Registro
│   ├── components/AuthGuard.tsx # Protección de rutas por sesión
│   └── visitas/                 # Listado, alta y detalle de visitas
├── components/
│   ├── layout/                  # Header, Layout, footer
│   ├── forms/FormFields.tsx     # Componentes de formulario reutilizables
│   └── VisitasList.tsx
├── lib/api/client.ts            # Cliente HTTP hacia la API del backend
└── types/index.ts               # Tipos TypeScript compartidos con el backend
```

## 📚 Más información

Consulta el [documento técnico completo del proyecto](../DOCS/Documento_Tecnico_SEPE_Campo.docx) y las [especificaciones funcionales](../DOCS/) para el detalle del problema resuelto, la arquitectura y el modelo de datos.
