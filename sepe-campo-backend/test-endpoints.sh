#!/bin/bash
# Script para probar todos los endpoints de SEPE Campo Backend
# Antes de ejecutar: npm run start:dev

BASE_URL="http://localhost:3000"

echo "======================================"
echo "PRUEBAS DE ENDPOINTS - SEPE CAMPO"
echo "======================================"

# 1. CREAR VISITA
echo -e "\n1️⃣ CREAR VISITA..."
VISITA_ID=$(curl -s -X POST $BASE_URL/visitas \
  -H "Content-Type: application/json" \
  -d '{
    "contrato": "CONT-2024-001",
    "vereda": "San Fernando",
    "municipio": "Bogotá",
    "tecnico_id": "tech-001",
    "fecha": "2024-07-15"
  }' | jq -r '.id')

echo "✅ Visita creada: $VISITA_ID"

# 2. OBTENER VISITA
echo -e "\n2️⃣ OBTENER VISITA..."
curl -s -X GET "$BASE_URL/visitas/$VISITA_ID" | jq '.'

# 3. CREAR USUARIO BENEFICIARIO
echo -e "\n3️⃣ CREAR USUARIO BENEFICIARIO..."
USUARIO_ID=$(curl -s -X POST $BASE_URL/usuarios-beneficiarios \
  -H "Content-Type: application/json" \
  -d "{
    \"visita_id\": \"$VISITA_ID\",
    \"nombre\": \"Juan García\",
    \"num_medidor\": \"123456789\",
    \"tipo_medidor\": \"Monofásico\",
    \"acometida\": \"Aérea\",
    \"observaciones\": \"Cliente frecuente\"
  }" | jq -r '.id')

echo "✅ Usuario creado: $USUARIO_ID"

# 4. CREAR PRIMER APOYO
echo -e "\n4️⃣ CREAR PRIMER APOYO..."
APOYO_1_ID=$(curl -s -X POST $BASE_URL/apoyos \
  -H "Content-Type: application/json" \
  -d "{
    \"visita_id\": \"$VISITA_ID\",
    \"numero\": 1,
    \"nivel_tension\": \"BT\",
    \"tipo_poste\": \"Concreto\",
    \"perchas\": 2,
    \"templetes_bt\": 4,
    \"templetes_mt\": 0,
    \"tierras_bt\": 2,
    \"tierras_mt\": 0,
    \"conectores\": 3,
    \"transformador\": false,
    \"coord_x\": 4.7124,
    \"coord_y\": -74.0055,
    \"observaciones\": \"Apoyo en buen estado\",
    \"estructuras\": [
      {\"codigo\": \"EST-001\", \"cantidad\": 2}
    ]
  }" | jq -r '.id')

echo "✅ Apoyo 1 creado: $APOYO_1_ID"

# 5. CREAR SEGUNDO APOYO
echo -e "\n5️⃣ CREAR SEGUNDO APOYO..."
APOYO_2_ID=$(curl -s -X POST $BASE_URL/apoyos \
  -H "Content-Type: application/json" \
  -d "{
    \"visita_id\": \"$VISITA_ID\",
    \"numero\": 2,
    \"nivel_tension\": \"BT\",
    \"tipo_poste\": \"Concreto\",
    \"perchas\": 2,
    \"templetes_bt\": 4,
    \"templetes_mt\": 0,
    \"tierras_bt\": 2,
    \"tierras_mt\": 0,
    \"conectores\": 3,
    \"transformador\": false,
    \"estructuras\": []
  }" | jq -r '.id')

echo "✅ Apoyo 2 creado: $APOYO_2_ID"

# 6. CREAR TRAMO
echo -e "\n6️⃣ CREAR TRAMO..."
TRAMO_ID=$(curl -s -X POST $BASE_URL/tramos \
  -H "Content-Type: application/json" \
  -d "{
    \"visita_id\": \"$VISITA_ID\",
    \"apoyo_origen_id\": \"$APOYO_1_ID\",
    \"apoyo_destino_id\": \"$APOYO_2_ID\",
    \"nivel_tension\": \"BT\",
    \"longitud_ml\": 45.5,
    \"observaciones\": \"Tramo en buen estado\"
  }" | jq -r '.id')

echo "✅ Tramo creado: $TRAMO_ID"

# 7. CALCULAR ACSR TOTAL
echo -e "\n7️⃣ CALCULAR CONDUCTOR ACSR TOTAL..."
curl -s -X GET "$BASE_URL/tramos/$VISITA_ID/acsr-total" | jq '.'

# 8. EJECUTAR VALIDACIONES
echo -e "\n8️⃣ EJECUTAR VALIDACIONES..."
curl -s -X POST "$BASE_URL/validaciones/validar/$VISITA_ID" | jq '.'

# 9. OBTENER CONSOLIDADO
echo -e "\n9️⃣ OBTENER CONSOLIDADO DE CANTIDADES..."
curl -s -X GET "$BASE_URL/consolidado/$VISITA_ID" | jq '.'

# 10. OBTENER INFORME TÉCNICO
echo -e "\n🔟 OBTENER INFORME TÉCNICO..."
curl -s -X GET "$BASE_URL/informe-tecnico/$VISITA_ID" | jq '.' | head -50

# 11. OBTENER RESUMEN EJECUTIVO
echo -e "\n1️⃣1️⃣ OBTENER RESUMEN EJECUTIVO..."
curl -s -X GET "$BASE_URL/informe-tecnico/$VISITA_ID/resumen" | jq '.'

# 12. DESCARGAR EXCEL
echo -e "\n1️⃣2️⃣ DESCARGAR EXCEL..."
curl -s -X GET "$BASE_URL/exportacion-excel/descargar/$VISITA_ID" \
  --output "informe_$VISITA_ID.xlsx"
echo "✅ Excel descargado: informe_$VISITA_ID.xlsx"

echo -e "\n======================================"
echo "✅ TODAS LAS PRUEBAS COMPLETADAS"
echo "======================================"
