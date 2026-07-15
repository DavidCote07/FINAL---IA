# SPEC-02 — Gestión de visitas

**Objetivo**
Permitir que el técnico registre y edite las visitas de verificación de obra que realiza en campo.

**Contexto**
Es el registro raíz: toda la demás información (usuarios, apoyos, tramos) se asocia a una visita. La visita la crea el técnico responsable y solo él puede editarla después.

**Entradas / Salidas**

Entradas:
- Contrato, vereda, municipio, técnico responsable, fecha de la visita

Salidas:
- Registro de visita disponible para asociarle usuarios, apoyos y tramos

**Reglas**
- Solo el técnico que creó la visita puede editarla o eliminarla.
- Una visita puede editarse en cualquier momento después de creada; no existe un estado "cerrada" que la bloquee.
- No se contempla edición simultánea por dos personas sobre la misma visita.

**Criterios de aceptación**
- Al guardar una visita y volver a abrirla, todos sus datos generales aparecen completos y sin alteración.
- Un técnico distinto al creador no puede ver el botón de editar/eliminar sobre esa visita.

**Fuera de alcance**
- Aprobación o revisión de la visita por un segundo rol.
- Gestión de múltiples contratos simultáneos.

## Fases de implementación

### Configuración del entorno local
- Configurar el proyecto NestJS y el frontend Next.js con un entorno compartido.
- Asegurar que la autenticación básica y las variables de entorno funcionen en local.
- Crear la base de datos y probar la conexión inicial.

### Construcción del backend
- Implementar la entidad VISITA y el controlador para creación, edición y consulta.
- Añadir reglas de autorización para que solo el creador pueda editar o eliminar.
- Implementar pruebas unitarias del servicio de visitas.

### Construcción del frontend
- Crear las pantallas de registro y edición de visitas.
- Añadir validaciones de formulario para contrato, vereda, municipio, técnico y fecha.
- Mostrar la lista de visitas propias y los botones de acción según permisos.
