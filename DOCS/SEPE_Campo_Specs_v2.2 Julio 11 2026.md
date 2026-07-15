# SEPE-CAMPO — Sistema de captura y consolidación de actas de electrificación rural

**Anatomía del documento técnico — Versión 2.2 (redimensionada para seminario de IA)**

Fecha: Julio de 2026 · Stack: Next.js (frontend) · NestJS (backend, arquitectura MVC) · PostgreSQL (base de datos)

---

## 1. Problemática

En los proyectos de electrificación rural, los técnicos verifican en campo las cantidades de obra instaladas por el contratista (postes, estructuras, templetes, transformadores, medidores, etc.) y registran la información en formatos físicos. De regreso, la transcripción manual, la elaboración del informe técnico y la consolidación del acta de cantidades pueden tardar días, lo que retrasa la validación de actas de obra, los pagos al contratista y la toma de decisiones del administrador del contrato. A esto se suman errores de digitación y falta de trazabilidad (quién midió qué, dónde y cuándo).

El cuello de botella no es la captura en sí (el técnico ya trae sus notas de campo completas), sino todo lo que ocurre después: pasar esas notas a un sistema estructurado, calcular los totales correctamente y redactar el informe en el formato exigido.

## 2. Solución propuesta

Una aplicación web con arquitectura cliente-servidor: el técnico digita en Next.js, en el orden de sus notas de campo, la información de la visita (usuarios, apoyos, estructuras y tramos). Los datos se guardan directamente en PostgreSQL a través de la API de NestJS, sin pasos de sincronización. A partir de ahí, el sistema entrega automáticamente tres resultados:

- El consolidado de cantidades, calculado con consultas SQL de agregación.
- El informe técnico, armado con una plantilla fija rellenada con esos mismos datos consultados.
- El archivo Excel en el formato corporativo de la empresa, generado con fórmulas que referencian los totales.

El componente de inteligencia artificial del proyecto es un motor de reglas (sistema experto) que revisa los datos capturados y genera alertas de inconsistencias — por ejemplo, un transformador sin tierras de MT registradas — sin bloquear el guardado ni intervenir en la redacción del informe.

## 3. Metodología: los tres ingredientes de cada spec

Cada spec de este documento se construye con tres ingredientes, en este orden:

- **Requisitos** — qué debe hacer el sistema, expresado como una capacidad concreta (equivalente a un RF).
- **Criterios de aceptación** — cómo se verifica, de forma objetiva, que ese requisito quedó bien implementado.
- **Modelado de datos** — qué entidades y campos soportan ese requisito en la base de datos.

Este orden no es arbitrario: el requisito define el qué, el criterio de aceptación define el cómo se prueba, y el modelo de datos define dónde vive la información. Sin los tres, una spec queda incompleta — por ejemplo, un requisito sin criterio de aceptación no se puede dar por terminado, y un requisito sin modelo de datos no se puede implementar.

## 4. Requisitos funcionales — vista consolidada

| ID | Capacidad | Spec donde se desarrolla |
|---|---|---|
| RF-01 | Registrar visitas | Spec 2 |
| RF-02 | Registrar usuarios beneficiarios | Spec 3 |
| RF-03 | Registrar apoyos y estructuras | Spec 4 |
| RF-04 | Registrar tramos y calcular conductor | Spec 5 |
| RF-05 | Detectar inconsistencias (motor de reglas) | Spec 6 |
| RF-06 | Generar consolidado de cantidades | Spec 7 |
| RF-07 | Generar informe técnico | Spec 8 |
| RF-08 | Exportar Excel corporativo | Spec 9 |

## 5. Resumen de los cambios frente a la versión 1.0

Este documento reemplaza la versión anterior (app móvil offline-first tipo PWA). Los cambios principales son:

- La app deja de ser offline: es una aplicación web cliente-servidor (Next.js + NestJS + PostgreSQL). No hay sincronización ni almacenamiento local en el dispositivo.
- El técnico digita la información en orden, tal como la registró en campo en su formato físico. Ya no se exige soportar captura desordenada.
- Se elimina el croquis/plano gráfico del ramal. Los tramos se registran como datos (origen, destino, longitud), sin edición visual de nodos.
- El informe técnico y el consolidado de cantidades ya NO se generan con inteligencia artificial (API de un LLM). Se generan con consultas SQL y una plantilla fija.
- El componente de inteligencia artificial del proyecto pasa a ser un motor de reglas (sistema experto basado en lógica IF-ENTONCES) que detecta inconsistencias en los datos capturados y las muestra como alertas, sin bloquear el guardado.
- Las visitas las crea el técnico que realiza la salida de campo; solo esa misma persona puede editarla después. No hay edición concurrente ni roles de aprobación en el MVP.

## 6. Lista de specs, ordenadas por dependencia

| # | Spec | Depende de |
|---|---|---|
| 1 | Modelo de datos | — |
| 2 | Gestión de visitas | Spec 1 |
| 3 | Registro de usuarios beneficiarios | Spec 2 |
| 4 | Registro de apoyos y estructuras | Spec 2 |
| 5 | Registro de tramos y cálculo de conductor | Spec 4 |
| 6 | Motor de validación de inconsistencias | Specs 3, 4, 5 |
| 7 | Consolidado de cantidades | Specs 3, 4, 5 |
| 8 | Informe técnico | Specs 6, 7 |
| 9 | Exportación a Excel corporativo | Spec 7 |

## 7. Modelo de datos general

Entidades del sistema y sus campos principales. Relaciones: una VISITA tiene muchos USUARIO_BENEFICIARIO, APOYO y TRAMO (1:N); un APOYO tiene muchas ESTRUCTURA_APOYO (1:N); un TRAMO conecta dos APOYO (origen y destino).

| Entidad | Campos principales | Relación |
|---|---|---|
| VISITA | id, contrato, vereda, municipio, tecnico_id, fecha | Raíz — 1:N con las demás |
| USUARIO_BENEFICIARIO | id, visita_id, nombre, num_medidor, tipo_medidor, acometida, observaciones | N:1 con VISITA |
| APOYO | id, visita_id, numero, nivel_tension, tipo_poste, perchas, templetes_bt/mt, tierras_bt/mt, conectores, transformador, coord_x/y/z, observaciones | N:1 con VISITA · 1:N con ESTRUCTURA_APOYO |
| ESTRUCTURA_APOYO | id, apoyo_id, codigo, cantidad | N:1 con APOYO |
| TRAMO | id, visita_id, apoyo_origen_id, apoyo_destino_id, nivel_tension, longitud_ml, observaciones | N:1 con VISITA · referencia 2 APOYO |

## 8. Desarrollo de cada spec

### SPEC-01 — Modelo de datos

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

---

### SPEC-02 — Gestión de visitas

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

---

### SPEC-03 — Registro de usuarios beneficiarios

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

---

### SPEC-04 — Registro de apoyos y estructuras

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

---

### SPEC-05 — Registro de tramos y cálculo de conductor

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

---

### SPEC-06 — Motor de validación de inconsistencias

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

---

### SPEC-07 — Consolidado de cantidades

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

---

### SPEC-08 — Informe técnico

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

---

### SPEC-09 — Exportación a Excel corporativo

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
