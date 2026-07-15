# SPEC-08 — Informe técnico

**Objetivo**
Generar el informe técnico de la visita a partir de una plantilla fija, rellenada con los datos consultados en PostgreSQL.

**Contexto**
Reemplaza la generación por IA: el informe se arma con una plantilla de 6 secciones y los datos obtenidos por consulta directa a la base de datos, incluyendo las alertas del motor de validación.

**Entradas / Salidas**

Entradas:
- Datos generales de la visita, consolidado de cantidades (Spec 7), alertas de inconsistencias (Spec 6)

Salidas:
- Documento del informe técnico con 6 secciones: datos generales, objeto, desarrollo de la visita, cantidades verificadas, observaciones y hallazgos, conclusiones y recomendaciones

**Reglas**
- Cada cifra del informe debe ser trazable a una consulta SQL específica sobre las tablas de la visita.
- La sección de observaciones y hallazgos incluye las alertas generadas por el motor de validación (Spec 6).
- Los datos faltantes se marcan como "por confirmar", nunca se completan automáticamente.

**Criterios de aceptación**
- El informe generado contiene las seis secciones estándar y solo usa datos capturados.
- Las alertas activas de la visita aparecen listadas en la sección de hallazgos.

**Fuera de alcance**
- Redacción en lenguaje natural generada por un modelo de lenguaje.
- Edición del informe dentro de la misma pantalla (se genera de una vez).

## Fases de implementación

### Configuración del entorno local
- Instalar librerías de plantillas o generación de documentos PDF/Word si se requiere.
- Configurar el proyecto para acceder al consolidado y a las alertas desde el backend.
- Preparar un entorno de pruebas con datos reales para validar la plantilla.

### Construcción del backend
- Implementar el servicio que arma el informe técnico usando una plantilla fija y datos del sistema.
- Añadir endpoint para generar y devolver el documento del informe.
- Incluir las alertas del motor de validación en la sección de hallazgos.

### Construcción del frontend
- Crear la vista para generar y descargar el informe técnico.
- Mostrar un resumen previo antes de exportar el documento.
- Validar que el informe contiene los seis apartados y los datos correctos por visita.
