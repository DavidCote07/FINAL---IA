# Script para probar endpoints en Windows PowerShell
# Ejecutar: .\test-endpoints.ps1
# Requisito: npm run start:dev en otra terminal

$BASE_URL = "http://localhost:3000"

Write-Host "======================================" -ForegroundColor Cyan
Write-Host "PRUEBAS DE ENDPOINTS - SEPE CAMPO" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan

# 1. CREAR VISITA
Write-Host "`n1️⃣ CREAR VISITA..." -ForegroundColor Yellow

$visitaBody = @{
    contrato = "CONT-2024-001"
    vereda = "San Fernando"
    municipio = "Bogotá"
    tecnico_id = "tech-001"
    fecha = "2024-07-15"
} | ConvertTo-Json

$visitaResponse = Invoke-WebRequest -Uri "$BASE_URL/visitas" `
    -Method POST `
    -Headers @{"Content-Type"="application/json"} `
    -Body $visitaBody

$VISITA_ID = ($visitaResponse.Content | ConvertFrom-Json).id
Write-Host "✅ Visita creada: $VISITA_ID" -ForegroundColor Green

# 2. OBTENER VISITA
Write-Host "`n2️⃣ OBTENER VISITA..." -ForegroundColor Yellow
$visitaGet = Invoke-WebRequest -Uri "$BASE_URL/visitas/$VISITA_ID" -Method GET
Write-Host ($visitaGet.Content | ConvertFrom-Json | ConvertTo-Json -Depth 10) -ForegroundColor White

# 3. CREAR USUARIO BENEFICIARIO
Write-Host "`n3️⃣ CREAR USUARIO BENEFICIARIO..." -ForegroundColor Yellow

$usuarioBody = @{
    visita_id = $VISITA_ID
    nombre = "Juan García"
    num_medidor = "123456789"
    tipo_medidor = "Monofásico"
    acometida = "Aérea"
    observaciones = "Cliente frecuente"
} | ConvertTo-Json

$usuarioResponse = Invoke-WebRequest -Uri "$BASE_URL/usuarios-beneficiarios" `
    -Method POST `
    -Headers @{"Content-Type"="application/json"} `
    -Body $usuarioBody

$USUARIO_ID = ($usuarioResponse.Content | ConvertFrom-Json).id
Write-Host "✅ Usuario creado: $USUARIO_ID" -ForegroundColor Green

# 4. CREAR PRIMER APOYO
Write-Host "`n4️⃣ CREAR PRIMER APOYO..." -ForegroundColor Yellow

$apoyo1Body = @{
    visita_id = $VISITA_ID
    numero = 1
    nivel_tension = "BT"
    tipo_poste = "Concreto"
    perchas = 2
    templetes_bt = 4
    templetes_mt = 0
    tierras_bt = 2
    tierras_mt = 0
    conectores = 3
    transformador = $false
    coord_x = 4.7124
    coord_y = -74.0055
    observaciones = "Apoyo en buen estado"
    estructuras = @(
        @{codigo = "EST-001"; cantidad = 2}
    )
} | ConvertTo-Json

$apoyo1Response = Invoke-WebRequest -Uri "$BASE_URL/apoyos" `
    -Method POST `
    -Headers @{"Content-Type"="application/json"} `
    -Body $apoyo1Body

$APOYO_1_ID = ($apoyo1Response.Content | ConvertFrom-Json).id
Write-Host "✅ Apoyo 1 creado: $APOYO_1_ID" -ForegroundColor Green

# 5. CREAR SEGUNDO APOYO
Write-Host "`n5️⃣ CREAR SEGUNDO APOYO..." -ForegroundColor Yellow

$apoyo2Body = @{
    visita_id = $VISITA_ID
    numero = 2
    nivel_tension = "BT"
    tipo_poste = "Concreto"
    perchas = 2
    templetes_bt = 4
    templetes_mt = 0
    tierras_bt = 2
    tierras_mt = 0
    conectores = 3
    transformador = $false
    estructuras = @()
} | ConvertTo-Json

$apoyo2Response = Invoke-WebRequest -Uri "$BASE_URL/apoyos" `
    -Method POST `
    -Headers @{"Content-Type"="application/json"} `
    -Body $apoyo2Body

$APOYO_2_ID = ($apoyo2Response.Content | ConvertFrom-Json).id
Write-Host "✅ Apoyo 2 creado: $APOYO_2_ID" -ForegroundColor Green

# 6. CREAR TRAMO
Write-Host "`n6️⃣ CREAR TRAMO..." -ForegroundColor Yellow

$tramoBody = @{
    visita_id = $VISITA_ID
    apoyo_origen_id = $APOYO_1_ID
    apoyo_destino_id = $APOYO_2_ID
    nivel_tension = "BT"
    longitud_ml = 45.5
    observaciones = "Tramo en buen estado"
} | ConvertTo-Json

$tramoResponse = Invoke-WebRequest -Uri "$BASE_URL/tramos" `
    -Method POST `
    -Headers @{"Content-Type"="application/json"} `
    -Body $tramoBody

$TRAMO_ID = ($tramoResponse.Content | ConvertFrom-Json).id
Write-Host "✅ Tramo creado: $TRAMO_ID" -ForegroundColor Green

# 7. CALCULAR ACSR TOTAL
Write-Host "`n7️⃣ CALCULAR CONDUCTOR ACSR TOTAL..." -ForegroundColor Yellow
$acsrResponse = Invoke-WebRequest -Uri "$BASE_URL/tramos/$VISITA_ID/acsr-total" -Method GET
Write-Host ($acsrResponse.Content | ConvertFrom-Json | ConvertTo-Json) -ForegroundColor White

# 8. EJECUTAR VALIDACIONES
Write-Host "`n8️⃣ EJECUTAR VALIDACIONES..." -ForegroundColor Yellow
$validacionResponse = Invoke-WebRequest -Uri "$BASE_URL/validaciones/validar/$VISITA_ID" `
    -Method POST
Write-Host ($validacionResponse.Content | ConvertFrom-Json | ConvertTo-Json -Depth 3) -ForegroundColor White

# 9. OBTENER CONSOLIDADO
Write-Host "`n9️⃣ OBTENER CONSOLIDADO DE CANTIDADES..." -ForegroundColor Yellow
$consolidadoResponse = Invoke-WebRequest -Uri "$BASE_URL/consolidado/$VISITA_ID" -Method GET
Write-Host ($consolidadoResponse.Content | ConvertFrom-Json | ConvertTo-Json -Depth 3) -ForegroundColor White

# 10. OBTENER INFORME TÉCNICO
Write-Host "`n🔟 OBTENER INFORME TÉCNICO (primeras líneas)..." -ForegroundColor Yellow
$informeResponse = Invoke-WebRequest -Uri "$BASE_URL/informe-tecnico/$VISITA_ID" -Method GET
$informe = $informeResponse.Content | ConvertFrom-Json
Write-Host "Visita: $($informe.visita.contrato)" -ForegroundColor White
Write-Host "Resumen Ejecutivo:" -ForegroundColor White
Write-Host ($informe.resumen_ejecutivo | ConvertTo-Json) -ForegroundColor White

# 11. OBTENER RESUMEN EJECUTIVO
Write-Host "`n1️⃣1️⃣ OBTENER RESUMEN EJECUTIVO..." -ForegroundColor Yellow
$resumenResponse = Invoke-WebRequest -Uri "$BASE_URL/informe-tecnico/$VISITA_ID/resumen" -Method GET
Write-Host ($resumenResponse.Content | ConvertFrom-Json | ConvertTo-Json -Depth 2) -ForegroundColor White

# 12. DESCARGAR EXCEL
Write-Host "`n1️⃣2️⃣ DESCARGAR EXCEL..." -ForegroundColor Yellow
$outputFile = "informe_$VISITA_ID.xlsx"
Invoke-WebRequest -Uri "$BASE_URL/exportacion-excel/descargar/$VISITA_ID" `
    -OutFile $outputFile
Write-Host "✅ Excel descargado: $outputFile" -ForegroundColor Green

Write-Host "`n======================================" -ForegroundColor Cyan
Write-Host "✅ TODAS LAS PRUEBAS COMPLETADAS" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
