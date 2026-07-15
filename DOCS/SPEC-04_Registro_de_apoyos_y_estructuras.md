# SPEC-04 — Registro de apoyos y estructuras

**Objetivo**
Registrar cada apoyo (poste) verificado en el ramal, con sus estructuras de media tensión asociadas.

**Contexto**
El técnico digita los apoyos en el orden en que los tiene anotados en su formato físico de campo; ya no se exige soportar captura desordenada.

**Entradas / Salidas**

Entradas:
- Número de apoyo, nivel de tensión, tipo de poste, perchas, templetes BT/MT, tierras BT/MT, conectores, transformador, observaciones
- Estructuras MT del apoyo: código y cantidad (un apoyo puede tener varias)
- Coordenadas X, Y, Z (opcionales)

Salidas:
- Registro de apoyo y sus estructuras asociadas, disponibles para el motor de validación y el consolidado

**Reglas**
- Los campos de cantidades solo aceptan números mayores o iguales a cero.
- Un apoyo puede tener cero o varias estructuras MT asociadas.
- Las coordenadas pueden dejarse vacías y completarse después sin afectar el resto del registro.

**Criterios de aceptación**
- Los campos de cantidades rechazan valores negativos o no numéricos.
- Se puede completar la coordenada de un apoyo días después sin alterar sus demás datos.

**Fuera de alcance**
- Croquis o representación gráfica del ramal.
- Captura automática de coordenadas por GPS del dispositivo.

## Fases de implementación

### Configuración del entorno local
- Instalar y configurar las bibliotecas de validación de datos para backend y frontend.
- Asegurar que el proyecto pueda ejecutar migraciones y compilar los componentes de UI.
- Probar la conexión de la API con el cliente local.

### Construcción del backend
- Definir la entidad APOYO y la entidad ESTRUCTURA_APOYO con su relación 1:N.
- Implementar validaciones de cantidades y las reglas de negocio de estructuras.
- Añadir endpoints para crear, editar y listar apoyos con sus estructuras.

### Construcción del frontend
- Crear la interfaz de captura de apoyos y sus estructuras MT.
- Implementar validaciones en el formulario para números, niveles de tensión y cantidades.
- Permitir edición posterior de coordenadas sin modificar otros datos.
