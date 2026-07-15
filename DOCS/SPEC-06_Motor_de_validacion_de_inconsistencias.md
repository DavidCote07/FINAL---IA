# SPEC-06 — Motor de validación de inconsistencias

**Objetivo**
Detectar automáticamente inconsistencias en los datos capturados mediante un conjunto de reglas lógicas (sistema experto), y mostrarlas como alertas.

**Contexto**
Es el componente de inteligencia artificial del proyecto: un motor de inferencia basado en reglas IF-ENTONCES, sin dependencia de ninguna API externa. Corre sobre los datos ya guardados de la visita.

**Entradas / Salidas**

Entradas:
- Datos de apoyos, estructuras y tramos de una visita

Salidas:
- Lista de alertas por visita, cada una con el apoyo/tramo afectado y la regla que la generó

**Reglas**
- Regla 1: si un apoyo reporta transformador pero no reporta tierras de MT, se genera una alerta.
- Regla 2: si un apoyo reporta estructura MT pero su nivel de tensión registrado es BT, se genera una alerta.
- Regla 3: si un usuario beneficiario no tiene número de medidor registrado, se genera una alerta.
- Las alertas son informativas: nunca bloquean el guardado ni impiden generar el informe o el Excel.

**Criterios de aceptación**
- Al guardar un apoyo que cumple alguna condición de alerta, esta aparece listada para esa visita.
- Guardar un apoyo con alerta pendiente se realiza sin error ni bloqueo.

**Fuera de alcance**
- Detección estadística de anomalías.
- Aprendizaje automático o modelos entrenados.
- Resolución automática de las inconsistencias detectadas.

## Fases de implementación

### Configuración del entorno local
- Instalar dependencias adicionales para reglas de negocio y pruebas.
- Asegurar que el backend puede ejecutar scripts de validación localmente.
- Configurar la visualización de alertas en el frontend.

### Construcción del backend
- Implementar el motor de reglas y los servicios que evalúan inconsistencias por visita.
- Crear reglas específicas para transformador sin tierras MT, estructura MT en nivel BT y usuario sin medidor.
- Añadir endpoints para consultar alertas de una visita.

### Construcción del frontend
- Mostrar las alertas generadas dentro de la vista de la visita.
- Permitir ver el detalle de cada inconsistencia sin bloquear la captura de datos.
- Verificar que las alertas actualizan tras guardar apoyos o usuarios.
