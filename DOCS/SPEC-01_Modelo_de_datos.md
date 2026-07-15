# SPEC-01 — Modelo de datos

**Objetivo**
Definir las entidades, campos y relaciones que soportan todo el sistema.

**Contexto**
Es la base sobre la que se construyen los módulos de captura, validación y reportería. No depende de ningún otro spec.

**Entradas / Salidas**

Salidas:
- VISITA (id, contrato, vereda, municipio, tecnico_id, fecha)
- USUARIO_BENEFICIARIO (id, visita_id, nombre, num_medidor, tipo_medidor, acometida, observaciones)
- APOYO (id, visita_id, numero, nivel_tension, tipo_poste, perchas, templetes_bt, templetes_mt, tierras_bt, tierras_mt, conectores, transformador, coord_x, coord_y, coord_z, observaciones)
- ESTRUCTURA_APOYO (id, apoyo_id, codigo, cantidad)
- TRAMO (id, visita_id, apoyo_origen_id, apoyo_destino_id, nivel_tension, longitud_ml, observaciones)

**Reglas**
- Todos los identificadores son autogenerados por PostgreSQL (uuid o serial), no por el cliente.
- Un TRAMO siempre referencia dos APOYO existentes de la misma visita.
- Las coordenadas X, Y, Z son opcionales y editables en cualquier momento.

**Criterios de aceptación**
- Toda tabla hija (usuario, apoyo, estructura, tramo) queda asociada correctamente a su visita mediante clave foránea.
- No es posible crear un TRAMO que referencie un apoyo de otra visita.

**Fuera de alcance**
- Versionamiento histórico de cambios sobre los registros (auditoría de ediciones).

## Fases de implementación

### Configuración del entorno local
- Instalar Node.js y PostgreSQL.
- Crear el proyecto NestJS y configurar la conexión a la base de datos.
- Configurar TypeORM/Prisma y validar el acceso a la base de datos local.

### Construcción del backend
- Definir entidades/tablas y relaciones en migraciones SQL o esquema ORM.
- Implementar repositorios y servicios para las entidades VISITA, USUARIO_BENEFICIARIO, APOYO, ESTRUCTURA_APOYO y TRAMO.
- Añadir validaciones de integridad referencial y reglas de negocio para el modelo de datos.

### Construcción del frontend
- Crear las interfaces de tipos y modelos de datos para las entidades en el cliente Next.js.
- Implementar formularios y validaciones para el ingreso de datos básicos de visita y sus entidades relacionadas.
- Configurar llamadas a la API del backend para consultar y mostrar la estructura de datos del sistema.
