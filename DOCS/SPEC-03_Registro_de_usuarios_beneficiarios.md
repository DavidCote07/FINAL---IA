# SPEC-03 — Registro de usuarios beneficiarios

**Objetivo**
Registrar, por visita, los usuarios beneficiarios del ramal verificado.

**Contexto**
Cada visita puede tener varios usuarios; esta información alimenta luego la hoja BT del Excel corporativo.

**Entradas / Salidas**

Entradas:
- Nombre, número y tipo de medidor, acometida, observaciones

Salidas:
- Lista de usuarios asociados a la visita

**Reglas**
- Un usuario siempre pertenece a una única visita.
- Los datos faltantes se marcan como "por confirmar", nunca se inventan.

**Criterios de aceptación**
- Cada usuario queda asociado a su visita y es editable de forma independiente.

**Fuera de alcance**
- Registro o adjunto de fotografías del medidor o la vivienda.

## Fases de implementación

### Configuración del entorno local
- Verificar la conexión a la base de datos y la configuración de migraciones.
- Asegurar la carga del proyecto Next.js y la comunicación con el backend.
- Configurar herramientas de desarrollo para pruebas de API y frontend.

### Construcción del backend
- Implementar la entidad USUARIO_BENEFICIARIO y su relación con VISITA.
- Crear endpoints CRUD para registro y edición de usuarios beneficiarios.
- Validar que los usuarios se almacenan correctamente junto a la visita.

### Construcción del frontend
- Añadir un formulario para crear y editar usuarios beneficiarios dentro de la visita.
- Mostrar la lista de usuarios asociados a una visita con edición independiente.
- Implementar el estado "por confirmar" para datos faltantes sin inventarlos.
