# SPEC-09 — Exportación a Excel corporativo

**Objetivo**
Producir el archivo Excel en el formato corporativo existente, con los totales de la visita.

**Contexto**
Reutiliza la estructura del libro corporativo ya validada contra el acta real de la vereda El Otoval.

**Entradas / Salidas**

Entradas:
- Consolidado de cantidades (Spec 7)
- Catálogo de ítems contractuales y su mapeo (configuración)

Salidas:
- Archivo .xlsx con hoja BT, hoja MT y hoja resumen del acta

**Reglas**
- En la hoja BT, la primera fila de cada grupo lleva los datos del usuario; las filas siguientes son los postes de su ramal.
- En la hoja MT, la primera fila de cada grupo lleva el transformador; las filas siguientes son los apoyos del ramal.
- La hoja resumen del acta se llena únicamente mediante fórmulas que referencian los totales de las hojas BT y MT.

**Criterios de aceptación**
- El Excel exportado abre correctamente y sus totales coinciden al 100% con el consolidado de la visita.

**Fuera de alcance**
- Gestión de precios o presupuesto dentro del Excel.

## Fases de implementación

### Configuración del entorno local
- Instalar bibliotecas para generar archivos Excel (.xlsx) en el backend.
- Configurar la conexión al consolidado para obtener los datos a exportar.
- Verificar el entorno con una plantilla de Excel base.

### Construcción del backend
- Implementar el servicio de exportación que construye el libro Excel con las hojas BT, MT y resumen.
- Asegurar que las fórmulas del resumen referencian los totales correctamente.
- Crear el endpoint para descargar el archivo .xlsx.

### Construcción del frontend
- Añadir un botón de exportación a Excel en la vista de la visita.
- Mostrar el estado de generación y permitir descargar el archivo.
- Validar que el Excel abre correctamente y sus totales coinciden con el consolidado.
