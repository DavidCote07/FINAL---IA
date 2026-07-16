# SEPE Campo - Backend API

Backend del sistema de gestión de visitas de verificación de obra eléctrica.

## 🚀 Descripción General

Este proyecto es un backend construido con **NestJS** que implementa todas las especificaciones técnicas (SPEC-01 a SPEC-09) del proyecto SEPE Campo. Proporciona una API REST completa para:

- ✅ Gestión de visitas de verificación
- ✅ Registro de usuarios beneficiarios
- ✅ Captura de apoyos (postes) y estructuras
- ✅ Registro de tramos y cálculo de conductor ACSR
- ✅ Motor de validación de inconsistencias (Sistema Experto)
- ✅ Consolidado de cantidades
- ✅ Generación de informes técnicos
- ✅ Exportación a Excel corporativo

## 📋 Módulos Implementados

| Módulo | Descripción | Endpoint |
|--------|-------------|----------|
| **Visitas** | Gestión de visitas de campo | `/visitas` |
| **Usuarios Beneficiarios** | Registro de beneficiarios | `/usuarios-beneficiarios` |
| **Apoyos** | Registro de postes y estructuras | `/apoyos` |
| **Tramos** | Conexiones entre apoyos | `/tramos` |
| **Validaciones** | Motor de reglas (3 reglas) | `/validaciones` |
| **Consolidado** | Cálculo de totales | `/consolidado` |
| **Informe Técnico** | Generación de reportes | `/informe-tecnico` |
| **Exportación Excel** | Generación de archivos XLSX | `/exportacion-excel` |

## 🛠️ Configuración del Proyecto

### Requisitos Previos
- Node.js 18+
- PostgreSQL 12+
- npm o yarn

### Instalación de Dependencias

```bash
npm install
```

### Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
# Base de datos
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=tu_password
DATABASE_NAME=sepe_campo

# API
NODE_ENV=development
PORT=3000
```

## 🚀 Ejecución

### Desarrollo (con auto-reload)
```bash
npm run start:dev
```

### Producción
```bash
npm run build
npm run start:prod
```

### Pruebas
```bash
# Tests unitarios
npm run test

# Tests E2E
npm run test:e2e

# Cobertura
npm run test:cov
```

## 📚 Documentación de API

Para documentación detallada de todos los endpoints, consulta [API_DOCUMENTATION.md](./API_DOCUMENTATION.md).

### Ejemplos Rápidos

#### 1. Crear una visita
```bash
curl -X POST http://localhost:3000/visitas \
  -H "Content-Type: application/json" \
  -d '{
    "contrato": "CONT-2024-001",
    "vereda": "San Fernando",
    "municipio": "Bogotá",
    "tecnico_id": "tech-001",
    "fecha": "2024-07-15"
  }'
```

#### 2. Registrar un apoyo
```bash
curl -X POST http://localhost:3000/apoyos \
  -H "Content-Type: application/json" \
  -d '{
    "visita_id": "uuid-de-visita",
    "numero": 1,
    "nivel_tension": "BT",
    "perchas": 2,
    "templetes_bt": 4,
    "estructuras": [
      {"codigo": "EST-001", "cantidad": 2}
    ]
  }'
```

#### 3. Ejecutar validaciones
```bash
curl -X POST http://localhost:3000/validaciones/validar/uuid-de-visita
```

#### 4. Generar informe
```bash
curl http://localhost:3000/informe-tecnico/uuid-de-visita
```

#### 5. Descargar Excel
```bash
curl http://localhost:3000/exportacion-excel/descargar/uuid-de-visita \
  --output informe.xlsx
```

## 🗂️ Estructura del Proyecto

```
src/
├── app.controller.ts          # Controlador principal
├── app.module.ts              # Módulo raíz
├── app.service.ts             # Servicio principal
├── main.ts                    # Punto de entrada
├── visitas/                   # Módulo de visitas
│   ├── dto/
│   ├── entities/
│   ├── visitas.controller.ts
│   ├── visitas.module.ts
│   └── visitas.service.ts
├── usuarios-beneficiarios/    # Módulo de usuarios
├── apoyos/                    # Módulo de apoyos (postes)
├── tramos/                    # Módulo de tramos
├── validaciones/              # Motor de reglas
├── consolidado/               # Cálculo de totales
├── informe-tecnico/           # Generación de informes
└── exportacion-excel/         # Exportación a Excel
```

## 🔧 Características Técnicas

### Base de Datos
- **ORM**: TypeORM
- **Base de datos**: PostgreSQL
- **Migraciones**: Automáticas con `synchronize: true`

### Validación
- **Validadores**: class-validator
- **Transformadores**: class-transformer

### Exportación
- **Librería Excel**: xlsx
- **Formato**: XLSX (Excel 2007+)

### Características de Negocio

#### Motor de Validación (3 Reglas)
1. ✅ **Transformador sin tierras MT**: Alerta si un apoyo tiene transformador pero no tierras de MT
2. ✅ **Estructura MT en BT**: Alerta si hay estructuras MT en un nivel BT
3. ✅ **Usuario sin medidor**: Alerta si un usuario no tiene medidor registrado

#### Cálculo de ACSR
- Formula: `Total ACSR = Suma(longitud_tramos) × 2 conductores`

#### Consolidado de Cantidades
- Totales por componente (perchas, templetes, tierras, conectores, transformadores)
- Totales por nivel de tensión
- Resumen ejecutivo completo

## 📊 Esquema de Base de Datos

```
VISITA
├── USUARIO_BENEFICIARIO (1:N)
├── APOYO (1:N)
│   └── ESTRUCTURA_APOYO (1:N)
├── TRAMO (1:N)
│   ├── references APOYO (origen)
│   └── references APOYO (destino)
└── INCONSISTENCIA (1:N)
```

## 🔐 Consideraciones de Seguridad

- Las IDs de todos los recursos se generan automáticamente como UUID
- No se aceptan IDs del cliente
- Las operaciones son atómicas a nivel de base de datos
- Validación completa de entrada en todos los endpoints
- Códigos HTTP apropiados para todos los escenarios

## 📝 Notas Importantes

⚠️ **Estado de Visita**: Una visita NO tiene estado "cerrada". Se puede editar en cualquier momento.

⚠️ **Alertas**: Las inconsistencias detectadas son INFORMATIVAS. No bloquean el guardado de datos.

⚠️ **Datos Faltantes**: Se marcan como "por confirmar", nunca se inventan valores.

⚠️ **Cantidades**: No pueden ser negativas. Deben ser números enteros ≥ 0.

## 🤝 Contribuir

Este proyecto sigue estándares de NestJS y clean architecture.

### Estándares de Código
- ESLint configurado
- Prettier para formato
- TypeScript strict mode

### Lint y Formato
```bash
npm run lint           # Verificar
npm run format         # Formatear automáticamente
```

## 📄 Licencia

UNLICENSED

## 👨‍💻 Autor

SEPE Campo - Proyecto de Verificación de Obra Eléctrica

---

Para más información, consulta la [Documentación de API](./API_DOCUMENTATION.md).

$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
