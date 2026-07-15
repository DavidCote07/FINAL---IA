# SPEC-05 — Registro de tramos y cálculo de conductor

**Objetivo**
Registrar la conexión entre dos apoyos consecutivos y su longitud, como base para calcular el conductor instalado.

**Contexto**
Reemplaza el antiguo croquis gráfico: el tramo ahora es un dato tabular (apoyo origen, apoyo destino, longitud), sin edición visual de nodos.

**Entradas / Salidas**

Entradas:
- Apoyo de origen, apoyo de destino, nivel de tensión, longitud en metros, observaciones

Salidas:
- Registro de tramo, usado en el cálculo del total de conductor ACSR

**Reglas**
- El total de conductor ACSR de la visita se calcula como la suma de los metros de todos los tramos, multiplicada por 2 (dos conductores por metro de tramo).
- Un tramo siempre conecta dos apoyos distintos de la misma visita.

**Criterios de aceptación**
- El total de ACSR calculado coincide con la suma de longitudes de tramo × 2.
- No es posible guardar un tramo cuyo apoyo origen sea igual al apoyo destino.

**Fuera de alcance**
- Visualización gráfica o edición de nodos en un plano.
- Cálculo de conductor para tecnologías distintas a ACSR.

## Fases de implementación

### Configuración del entorno local
- Configurar el proyecto para ejecutar rutas y pruebas end-to-end.
- Verificar el acceso a la base de datos desde el backend.
- Preparar datos de prueba de apoyos para validar el cálculo.

### Construcción del backend
- Definir la entidad TRAMO con referencias a apoyo_origen y apoyo_destino.
- Implementar la lógica de cálculo del conductor ACSR en el servicio de tramos.
- Añadir validaciones de integridad para impedir tramos con el mismo apoyo en origen y destino.

### Construcción del frontend
- Crear formularios para registrar tramos entre dos apoyos de la misma visita.
- Mostrar el total de conductor calculado y retroalimentación inmediata.
- Verificar que los tramos se guardan correctamente y pertenecen a la visita.
