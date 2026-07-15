# SPEC-07 — Consolidado de cantidades

**Objetivo**
Calcular, mediante consultas SQL, los totales de cantidades de obra de una visita.

**Contexto**
Es la base numérica tanto del informe técnico como del Excel corporativo; se genera con agregaciones sobre las tablas existentes, sin ningún componente de IA.

**Entradas / Salidas**

Entradas:
- Datos de usuarios, apoyos, estructuras y tramos de la visita

Salidas:
- Totales por ítem: postes por tipo, estructuras por código, templetes, tierras, conductor ACSR en metros, transformadores, medidores

**Reglas**
- Cada total se calcula exclusivamente con consultas de agregación (SUM, COUNT) sobre las tablas de la visita.
- Ningún total se redondea o ajusta manualmente; refleja exactamente los datos capturados.

**Criterios de aceptación**
- El consolidado generado coincide con el cálculo manual de los mismos datos verificado contra el acta real de referencia.

**Fuera de alcance**
- Comparación contra presupuesto o precios contractuales.

## Fases de implementación

### Configuración del entorno local
- Preparar el entorno de desarrollo para ejecutar consultas SQL y pruebas de agregación.
- Configurar el proyecto para exponer endpoints de reportes.
- Crear datos de prueba representativos para validar cálculos.

### Construcción del backend
- Implementar servicios de agregación que calculen totales por ítem a partir de las tablas de la visita.
- Añadir endpoints para obtener el consolidado de cantidades.
- Verificar que los resultados coinciden con cálculos manuales.

### Construcción del frontend
- Crear la vista de consolidado de cantidades.
- Mostrar los totales por postes, estructuras, templetes, tierras, conductor, transformadores y medidores.
- Añadir controles para refrescar y validar el reporte.
