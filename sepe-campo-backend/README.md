# SEPE Campo - Backend API

API REST construida con NestJS para el sistema de captura y consolidación de actas de electrificación rural en **baja tensión (BT)**.

## 🚀 Descripción General

Proporciona la API REST completa para:

- ✅ Autenticación de usuarios técnicos (JWT)
- ✅ Gestión de visitas de verificación (con eliminación en cascada de todos sus datos)
- ✅ Registro de usuarios beneficiarios
- ✅ Captura de apoyos (postes, marcados como nuevos o existentes) y sus estructuras
- ✅ Registro de tramos (con tipo de cable dúplex/triplex) y cálculo de metros de replanteo
- ✅ Motor de validación de inconsistencias (sistema experto basado en reglas)
- ✅ Consolidado de cantidades por visita
- ✅ Informe técnico por visita e informe total consolidando todas las visitas
- ✅ Exportación a Excel corporativo

> El alcance del sistema se limita exclusivamente a redes de **baja tensión**. Los campos y reglas de media tensión (MT) que aparecían en la especificación original fueron retirados del modelo de datos y de la lógica de negocio.

## 📋 Módulos Implementados

| Módulo | Descripción | Endpoint base |
|--------|-------------|----------|
| **Auth** | Registro e inicio de sesión (JWT) | `/auth` |
| **Users** | Usuarios del sistema (técnicos) | — (usado internamente por Auth) |
| **Visitas** | Gestión de visitas de campo | `/visitas` |
| **Usuarios Beneficiarios** | Registro de beneficiarios | `/usuarios-beneficiarios` |
| **Apoyos** | Registro de postes y estructuras | `/apoyos` |
| **Tramos** | Conexiones entre apoyos y tipo de cable | `/tramos` |
| **Validaciones** | Motor de reglas (2 reglas) | `/validaciones` |
| **Consolidado** | Cálculo de totales por visita | `/consolidado` |
| **Informe Técnico** | Informe por visita e informe total | `/informe-tecnico` |
| **Exportación Excel** | Generación de archivos XLSX | `/exportacion-excel` |

## 🛠️ Configuración del Proyecto

### Requisitos Previos
- Node.js 18+ (probado con v24)
- PostgreSQL 12+ (probado con v18)
- npm

### Instalación de Dependencias

```bash
npm install
```

### Base de Datos

Crear una base de datos vacía llamada `sepe_campo` y dejar que TypeORM sincronice el esquema automáticamente al arrancar (`synchronize: true`), o aplicar el esquema manualmente con el script incluido:

```bash
psql -U postgres -f db/init.sql
```

### Variables de Entorno

Crea un archivo `.env` en la raíz de `sepe-campo-backend/`:

```env
# Base de datos
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=tu_password
DATABASE_NAME=sepe_campo

# API
NODE_ENV=development
PORT=3001

# Autenticación (opcionales, tienen valores por defecto)
JWT_SECRET=cambia_este_secreto_en_produccion
ADMIN_USERNAME=admin
ADMIN_PASSWORD=Admin1234!
ADMIN_ROLE=admin
```

> El puerto por defecto es **3001** porque el frontend (Next.js) usa el 3000 y viene configurado para consumir la API en `http://localhost:3001`.

## 🚀 Ejecución

### Desarrollo (con auto-reload)
```bash
npm run start:dev
```

### Crear el primer usuario administrador
```bash
npm run create:admin
```
Crea el usuario definido en `ADMIN_USERNAME` / `ADMIN_PASSWORD` (por defecto `admin` / `Admin1234!`) si aún no existe.

### Producción
```bash
npm run build
npm run start:prod
```

### Pruebas
```bash
npm run test        # Unitarias
npm run test:e2e    # E2E
npm run test:cov    # Cobertura
```

## 📚 Documentación de API

Para el detalle de todos los endpoints, consulta [API_DOCUMENTATION.md](./API_DOCUMENTATION.md).

### Ejemplos Rápidos

#### 1. Iniciar sesión
```bash
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "Admin1234!"}'
```

#### 2. Crear una visita
```bash
curl -X POST http://localhost:3001/visitas \
  -H "Content-Type: application/json" \
  -d '{
    "contrato": "CONT-2024-001",
    "vereda": "San Fernando",
    "municipio": "Bogotá",
    "tecnico_id": "tech-001",
    "fecha": "2024-07-15"
  }'
```

#### 3. Registrar un apoyo
El número de apoyo lo asigna el backend automáticamente (consecutivo por visita); no se envía desde el cliente.
```bash
curl -X POST http://localhost:3001/apoyos \
  -H "Content-Type: application/json" \
  -d '{
    "visita_id": "uuid-de-visita",
    "nivel_tension": "BT",
    "poste_nuevo": true,
    "perchas": 2,
    "templetes_bt": 4,
    "estructuras": [{"codigo": "EST-001", "cantidad": 2}]
  }'
```

#### 4. Registrar un tramo
```bash
curl -X POST http://localhost:3001/tramos \
  -H "Content-Type: application/json" \
  -d '{
    "visita_id": "uuid-de-visita",
    "apoyo_origen_id": "uuid-apoyo-1",
    "apoyo_destino_id": "uuid-apoyo-2",
    "nivel_tension": "BT",
    "tipo_cable": "DUPLEX",
    "longitud_ml": 45
  }'
```

#### 5. Ejecutar validaciones
```bash
curl -X POST http://localhost:3001/validaciones/validar/uuid-de-visita
```

#### 6. Generar informe de una visita
```bash
curl http://localhost:3001/informe-tecnico/uuid-de-visita
```

#### 7. Generar informe total (todas las visitas)
```bash
curl http://localhost:3001/informe-tecnico/total
```

#### 8. Descargar Excel
```bash
curl http://localhost:3001/exportacion-excel/descargar/uuid-de-visita \
  --output informe.xlsx
```

## 🗂️ Estructura del Proyecto

```
src/
├── app.controller.ts / app.module.ts / app.service.ts / main.ts
├── auth/                      # Login, registro, JWT
├── users/                     # Usuarios del sistema (técnicos)
├── visitas/                   # Módulo de visitas (borrado en cascada)
├── usuarios-beneficiarios/    # Módulo de usuarios beneficiarios
├── apoyos/                    # Módulo de apoyos (postes) y estructuras
├── tramos/                    # Módulo de tramos y tipo de cable
├── validaciones/               # Motor de reglas (2 reglas)
├── consolidado/                # Cálculo de totales
├── informe-tecnico/            # Informe por visita e informe total
└── exportacion-excel/          # Exportación a Excel
```

## 🔧 Características Técnicas

### Base de Datos
- **ORM**: TypeORM
- **Base de datos**: PostgreSQL
- **Esquema**: sincronización automática (`synchronize: true`) o script manual en `db/init.sql`

### Validación
- **Validadores**: class-validator
- **Transformadores**: class-transformer

### Exportación
- **Librería Excel**: xlsx
- **Formato**: XLSX (Excel 2007+)

### Motor de Validación (2 reglas activas)
1. ✅ **Apoyo BT sin tierras**: alerta si un apoyo en baja tensión no reporta tierras BT.
2. ✅ **Usuario sin medidor**: alerta si un usuario beneficiario no tiene número de medidor registrado.

Las alertas son informativas y nunca bloquean el guardado ni la generación de informes.

### Cálculo de Replanteo Total
- Fórmula: `Replanteo Total (m) = suma de metros de cable dúplex + suma de metros de cable triplex de todos los tramos` (sin multiplicar; equivale a la longitud total instalada).

### Consolidado de Cantidades
- Totales por componente (perchas, templetes BT, tierras BT, conectores)
- Totales por nivel de tensión
- Resumen ejecutivo completo (incluye medidores tipo A1/A3, postes nuevos/existentes, metros de cable dúplex/triplex)

## 📊 Esquema de Base de Datos

```
VISITA
├── USUARIO_BENEFICIARIO (1:N)
├── APOYO (1:N)
│   └── ESTRUCTURA_APOYO (1:N, borrado en cascada)
├── TRAMO (1:N)
│   ├── references APOYO (origen)
│   └── references APOYO (destino)
└── INCONSISTENCIA (1:N)

USER (independiente, usuarios del sistema/técnicos)
```

Al eliminar una visita, el backend borra en cascada (en orden) sus inconsistencias, tramos, usuarios beneficiarios y apoyos antes de eliminar el registro raíz.

## 🔐 Consideraciones de Seguridad

- Las IDs de todos los recursos se generan automáticamente como UUID; no se aceptan IDs del cliente.
- Autenticación con JWT; contraseñas de usuarios hasheadas con bcrypt.
- Validación completa de entrada (DTO + class-validator) en todos los endpoints.
- Códigos HTTP apropiados para todos los escenarios.

## 📝 Notas Importantes

⚠️ **Estado de Visita**: una visita NO tiene estado "cerrada". Se puede editar en cualquier momento.

⚠️ **Alertas**: las inconsistencias detectadas son INFORMATIVAS. No bloquean el guardado de datos.

⚠️ **Datos Faltantes**: se marcan como "por confirmar", nunca se inventan valores.

⚠️ **Cantidades**: no pueden ser negativas. Deben ser números enteros ≥ 0.

⚠️ **Alcance**: el sistema opera únicamente sobre redes de baja tensión (BT); no existe soporte para media tensión (MT).

## 🤝 Contribuir

Este proyecto sigue estándares de NestJS.

```bash
npm run lint      # Verificar
npm run format    # Formatear automáticamente
```

## 📄 Licencia

UNLICENSED

---

Para más información, consulta la [Documentación de API](./API_DOCUMENTATION.md) y el [documento técnico completo del proyecto](../DOCS/Documento_Tecnico_SEPE_Campo.docx).
