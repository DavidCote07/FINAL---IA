# Documentación de la API - SEPE Campo Backend

## Módulos Implementados

Este backend implementa 7 módulos especializados basados en las especificaciones técnicas del proyecto SEPE Campo.

### 1. **Visitas** (`/visitas`)
Gestiona el registro de visitas de verificación de obra.

**Endpoints:**
- `POST /visitas` - Crear nueva visita
- `GET /visitas` - Listar todas las visitas (con opción `?tecnico_id=` para filtrar)
- `GET /visitas/:id` - Obtener una visita específica
- `PATCH /visitas/:id` - Actualizar una visita
- `DELETE /visitas/:id` - Eliminar una visita

**Ejemplo de creación:**
```json
{
  "contrato": "CONT-2024-001",
  "vereda": "San Fernando",
  "municipio": "Bogotá",
  "tecnico_id": "tech-001",
  "fecha": "2024-07-15"
}
```

---

### 2. **Usuarios Beneficiarios** (`/usuarios-beneficiarios`)
Registra los usuarios beneficiarios del ramal verificado.

**Endpoints:**
- `POST /usuarios-beneficiarios` - Crear usuario
- `GET /usuarios-beneficiarios?visita_id=` - Listar usuarios de una visita
- `GET /usuarios-beneficiarios/:id` - Obtener usuario específico
- `PATCH /usuarios-beneficiarios/:id` - Actualizar usuario
- `DELETE /usuarios-beneficiarios/:id` - Eliminar usuario

**Ejemplo:**
```json
{
  "visita_id": "uuid-visita",
  "nombre": "Juan García",
  "num_medidor": "123456789",
  "tipo_medidor": "Monofásico",
  "acometida": "Aérea",
  "observaciones": "Medidor sin tapa"
}
```

---

### 3. **Apoyos (Postes)** (`/apoyos`)
Registra cada apoyo (poste) verificado con sus estructuras asociadas.

**Endpoints:**
- `POST /apoyos` - Crear apoyo
- `GET /apoyos?visita_id=` - Listar apoyos de una visita
- `GET /apoyos/:id` - Obtener apoyo específico
- `PATCH /apoyos/:id` - Actualizar apoyo
- `DELETE /apoyos/:id` - Eliminar apoyo

**Ejemplo:**
```json
{
  "visita_id": "uuid-visita",
  "numero": 1,
  "nivel_tension": "BT",
  "tipo_poste": "Concreto",
  "perchas": 2,
  "templetes_bt": 4,
  "templetes_mt": 0,
  "tierras_bt": 2,
  "tierras_mt": 0,
  "conectores": 3,
  "transformador": false,
  "coord_x": 4.7124,
  "coord_y": -74.0055,
  "coord_z": 2600,
  "observaciones": "Apoyo en buen estado",
  "estructuras": [
    { "codigo": "EST-001", "cantidad": 2 },
    { "codigo": "EST-002", "cantidad": 1 }
  ]
}
```

**Validaciones:**
- Las cantidades deben ser números ≥ 0
- Los campos de cantidades no pueden ser negativos

---

### 4. **Tramos** (`/tramos`)
Registra la conexión entre dos apoyos consecutivos.

**Endpoints:**
- `POST /tramos` - Crear tramo
- `GET /tramos?visita_id=` - Listar tramos de una visita
- `GET /tramos/:id` - Obtener tramo específico
- `GET /tramos/:visita_id/acsr-total` - Calcular conductor ACSR total
- `PATCH /tramos/:id` - Actualizar tramo
- `DELETE /tramos/:id` - Eliminar tramo

**Ejemplo:**
```json
{
  "visita_id": "uuid-visita",
  "apoyo_origen_id": "uuid-apoyo-1",
  "apoyo_destino_id": "uuid-apoyo-2",
  "nivel_tension": "BT",
  "longitud_ml": 45.5,
  "observaciones": "Tramo en buen estado"
}
```

**Fórmula ACSR:**
- Total ACSR = Suma de longitudes (ml) × 2 conductores

---

### 5. **Validaciones (Motor de Reglas)** (`/validaciones`)
Sistema experto que detecta inconsistencias automáticamente.

**Endpoints:**
- `POST /validaciones/validar/:visita_id` - Ejecutar validación en una visita
- `GET /validaciones/inconsistencias?visita_id=` - Listar inconsistencias
- `POST /validaciones/limpiar/:visita_id` - Limpiar inconsistencias

**Reglas Implementadas:**

1. **Regla 1**: Transformador sin tierras MT
   - Si un apoyo tiene transformador pero `tierras_mt = 0`

2. **Regla 2**: Estructura MT en nivel BT
   - Si un apoyo tiene `nivel_tension = BT` pero tiene estructuras MT

3. **Regla 3**: Usuario sin medidor
   - Si un usuario no tiene `num_medidor` registrado

**Ejemplo de respuesta:**
```json
{
  "visita_id": "uuid-visita",
  "total_inconsistencias": 2,
  "inconsistencias": [
    {
      "id": "uuid",
      "numero_regla": 1,
      "descripcion": "Transformador sin tierras MT",
      "mensaje": "Apoyo 3: Tiene transformador pero no reporta tierras de media tensión",
      "severidad": "WARNING"
    }
  ]
}
```

---

### 6. **Consolidado de Cantidades** (`/consolidado`)
Calcula y resume todas las cantidades de una visita.

**Endpoints:**
- `GET /consolidado/:visita_id` - Obtener consolidado completo
- `GET /consolidado/:visita_id/estructuras` - Resumen de estructuras por código

**Ejemplo de respuesta:**
```json
{
  "total_apoyos": 15,
  "total_usuarios": 20,
  "total_tramos": 14,
  "total_acsr": 1260,
  "total_perchas": 30,
  "total_templetes_bt": 60,
  "total_templetes_mt": 20,
  "total_tierras_bt": 30,
  "total_tierras_mt": 15,
  "total_conectores": 45,
  "total_transformadores": 3,
  "total_longitud_ml": 630,
  "by_nivel_tension": {
    "BT": { "apoyos": 10, "tramos": 9, "longitud_ml": 400 },
    "MT": { "apoyos": 5, "tramos": 5, "longitud_ml": 230 }
  }
}
```

---

### 7. **Informe Técnico** (`/informe-tecnico`)
Genera un informe completo con todos los datos de la visita.

**Endpoints:**
- `GET /informe-tecnico/:visita_id` - Informe técnico completo
- `GET /informe-tecnico/:visita_id/resumen` - Resumen ejecutivo

**Estructura del informe:**
```json
{
  "visita": { ...datos de visita },
  "resumen_ejecutivo": { ...totales principales },
  "usuarios_beneficiarios": [...],
  "apoyos": [...],
  "tramos": [...],
  "consolidado": { ...totales detallados },
  "inconsistencias": [...]
}
```

---

### 8. **Exportación a Excel** (`/exportacion-excel`)
Genera archivos Excel corporativos con el formato requerido.

**Endpoints:**
- `GET /exportacion-excel/descargar/:visita_id` - Descargar Excel directamente
- `GET /exportacion-excel/generar/:visita_id` - Generar y guardar en servidor

**Hojas generadas:**
1. Portada - Información general
2. Resumen - Totales por nivel de tensión
3. Usuarios BT - Lista de beneficiarios
4. Apoyos - Detalle de postes
5. Estructuras - Estructuras por apoyo
6. Tramos - Conexiones entre apoyos
7. Consolidado - Totales de componentes
8. Inconsistencias - Alertas generadas

---

## Flujo de Trabajo Típico

1. **Crear una visita**
   ```bash
   POST /visitas
   ```

2. **Registrar usuarios beneficiarios**
   ```bash
   POST /usuarios-beneficiarios (con visita_id)
   ```

3. **Registrar apoyos y estructuras**
   ```bash
   POST /apoyos (con visita_id y estructuras)
   ```

4. **Registrar tramos**
   ```bash
   POST /tramos (con visita_id y referencias a apoyos)
   ```

5. **Ejecutar validaciones**
   ```bash
   POST /validaciones/validar/:visita_id
   ```

6. **Obtener consolidado**
   ```bash
   GET /consolidado/:visita_id
   ```

7. **Generar informe**
   ```bash
   GET /informe-tecnico/:visita_id
   ```

8. **Exportar a Excel**
   ```bash
   GET /exportacion-excel/descargar/:visita_id
   ```

---

## Variables de Entorno

```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=password
DATABASE_NAME=sepe_campo
```

---

## Instalación y Ejecución

### Instalación de dependencias
```bash
npm install
```

### Desarrollo
```bash
npm run start:dev
```

### Producción
```bash
npm run build
npm run start:prod
```

### Pruebas
```bash
npm run test
npm run test:e2e
```

---

## Estructura de Carpetas

```
src/
├── app.module.ts
├── visitas/
├── usuarios-beneficiarios/
├── apoyos/
├── tramos/
├── validaciones/
├── consolidado/
├── informe-tecnico/
└── exportacion-excel/
```

Cada módulo contiene:
- `entities/` - Modelos de base de datos
- `dto/` - Data Transfer Objects
- `*.service.ts` - Lógica de negocio
- `*.controller.ts` - Endpoints
- `*.module.ts` - Configuración del módulo

---

## Errores Comunes

| Error | Solución |
|-------|----------|
| `visita_id es requerido` | Asegúrate de enviar el parámetro `visita_id` en la query o body |
| `Apoyo no encontrado` | Verifica que el ID existe y pertenece a la visita |
| `El apoyo de origen no puede ser igual al apoyo de destino` | Un tramo debe conectar dos apoyos distintos |
| `Debe ser un número entero >= 0` | Las cantidades no pueden ser negativas |

---

## Notas Importantes

- ✅ Todas las transacciones se manejan automáticamente
- ✅ Los IDs se generan automáticamente (UUID)
- ✅ Las alertas de validación son informativas (no bloquean el guardado)
- ✅ El cálculo de ACSR es automático basado en tramos
- ✅ Los datos "por confirmar" se marcan explícitamente, no se inventan
