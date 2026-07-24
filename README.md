# SEPE Campo — Proyecto Final SEMINARIO IA

Sistema de captura y consolidación de actas de electrificación rural en baja tensión (BT). Un técnico registra en campo los datos de cada visita (usuarios beneficiarios, apoyos y tramos), y el sistema genera automáticamente el consolidado de cantidades, el informe técnico y el archivo Excel corporativo, además de un motor de reglas que detecta inconsistencias.

Repositorio: https://github.com/DavidCote07/FINAL---IA

## Estructura del repositorio

- `sepe-campo-backend/` — API REST construida con NestJS + TypeORM + PostgreSQL.
- `sepe-campo-frontend/` — aplicación web construida con Next.js 16 + React 19 + Tailwind CSS.
- `DOCS/` — especificaciones funcionales del proyecto (SPEC-01 a SPEC-09) y el documento técnico completo (`Documento_Tecnico_SEPE_Campo.docx`).

Cada carpeta de aplicación tiene su propio README con detalle de módulos, variables de entorno y comandos.

## Arquitectura

Cliente-servidor de tres capas: el navegador (Next.js) consume la API REST del backend (NestJS) vía HTTP/JSON, y el backend persiste en PostgreSQL a través de TypeORM. No hay sincronización offline ni almacenamiento local de datos de negocio.

```
Navegador (Next.js :3000)  →  API REST (NestJS :3001)  →  PostgreSQL (:5432)
```

## Puesta en marcha rápida

Requisitos: Node.js 18+ y PostgreSQL 12+ corriendo localmente.

```bash
# 1) Crear la base de datos (o dejar que TypeORM la sincronice al arrancar)
psql -U postgres -f sepe-campo-backend/db/init.sql

# 2) Backend (puerto 3001)
cd sepe-campo-backend
npm install
# crear .env — ver sepe-campo-backend/README.md
npm run start:dev
npm run create:admin   # crea el primer usuario (admin / Admin1234! por defecto)

# 3) Frontend (puerto 3000)
cd ../sepe-campo-frontend
npm install
npm run dev
```

Abrir http://localhost:3000, iniciar sesión y verificar que aparece la pantalla "Informe Total".

## Documentación

- Especificaciones funcionales: `DOCS/SEPE_Campo_Specs_v2.2 Julio 11 2026.md`
- Documento técnico completo (problema, arquitectura, modelo de datos, funcionalidades, ejecución local): `DOCS/Documento_Tecnico_SEPE_Campo.docx`
- API del backend: `sepe-campo-backend/README.md` y `sepe-campo-backend/API_DOCUMENTATION.md`
