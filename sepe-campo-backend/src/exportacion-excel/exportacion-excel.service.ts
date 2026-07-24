import { Injectable, NotFoundException } from '@nestjs/common';
import { InformeTecnicoService } from '../informe-tecnico/informe-tecnico.service';
import * as XLSX from 'xlsx';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ExportacionExcelService {
  constructor(private informeTecnicoService: InformeTecnicoService) {}

  /**
   * Genera el archivo Excel corporativo completo para una visita
   */
  async generateExcel(visitaId: string): Promise<Buffer> {
    // Obtener informe técnico
    const informe = await this.informeTecnicoService.generateInforme(visitaId);

    // Crear workbook
    const workbook = XLSX.utils.book_new();

    // Hoja 1: Portada / Información General
    this.addPortadaSheet(workbook, informe);

    // Hoja 2: Resumen Ejecutivo
    this.addResumenSheet(workbook, informe);

    // Hoja 3: Usuarios Beneficiarios
    this.addUsuariosSheet(workbook, informe);

    // Hoja 4: Apoyos (Postes)
    this.addApoyosSheet(workbook, informe);

    // Hoja 5: Estructuras por Apoyo
    this.addEstructurasSheet(workbook, informe);

    // Hoja 6: Tramos
    this.addTramosSheet(workbook, informe);

    // Hoja 7: Consolidado de Cantidades
    this.addConsolidadoSheet(workbook, informe);

    // Hoja 8: Inconsistencias / Alertas
    this.addInconsistenciasSheet(workbook, informe);

    // Generar buffer
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    return buffer;
  }

  /**
   * Guarda el Excel en el sistema de archivos
   */
  async saveExcelFile(visitaId: string, outputPath?: string): Promise<string> {
    const buffer = await this.generateExcel(visitaId);

    const fileName = `Informe_${visitaId}_${new Date().toISOString().split('T')[0]}.xlsx`;
    const filePath = outputPath || path.join(process.cwd(), 'exports', fileName);

    // Crear directorio si no existe
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(filePath, buffer);
    return filePath;
  }

  // ===== Métodos privados para generar hojas =====

  private addPortadaSheet(workbook: XLSX.WorkBook, informe: any): void {
    const data = [
      ['INFORME TÉCNICO DE VERIFICACIÓN DE OBRA ELÉCTRICA'],
      [''],
      ['INFORMACIÓN GENERAL'],
      ['Contrato', informe.visita.contrato],
      ['Vereda', informe.visita.vereda],
      ['Municipio', informe.visita.municipio],
      ['Técnico Responsable', informe.visita.tecnico_id],
      ['Fecha Visita', informe.visita.fecha],
      ['Fecha Informe', new Date().toLocaleDateString('es-ES')],
    ];

    const sheet = XLSX.utils.aoa_to_sheet(data);
    sheet['!cols'] = [{ wch: 25 }, { wch: 40 }];
    XLSX.utils.book_append_sheet(workbook, sheet, 'Portada');
  }

  private addResumenSheet(workbook: XLSX.WorkBook, informe: any): void {
    const resumen = informe.resumen_ejecutivo;

    const data = [
      ['RESUMEN EJECUTIVO'],
      [''],
      ['Métrica', 'Valor'],
      ['Total de Apoyos', resumen.total_apoyos],
      ['Total de Usuarios Beneficiarios', resumen.total_usuarios],
      ['Total de Tramos', resumen.total_tramos],
      ['Longitud Total (metros)', resumen.total_longitud_ml],
      ['Conductor ACSR Total (metros)', resumen.total_acsr],
      [''],
      ['Total Perchas', resumen.total_perchas],
      ['Total Templetes BT', resumen.total_templetes_bt],
      ['Medidores Tipo A1', resumen.total_medidores_a1],
      ['Medidores Tipo A3', resumen.total_medidores_a3],
      ['Cable Dúplex Total (metros)', resumen.total_cable_duplex_ml],
      ['Cable Triplex Total (metros)', resumen.total_cable_triplex_ml],
      ['Postes Nuevos', resumen.total_postes_nuevos],
      ['Postes Existentes', resumen.total_postes_existentes],
      [''],
      ['CONSOLIDADO POR NIVEL DE TENSIÓN'],
      ['Nivel', 'Apoyos', 'Tramos', 'Longitud (ml)'],
    ];

    // Agregar datos por nivel de tensión
    const byNivel = informe.consolidado.by_nivel_tension;
    for (const nivel in byNivel) {
      data.push([nivel, byNivel[nivel].apoyos, byNivel[nivel].tramos, byNivel[nivel].longitud_ml]);
    }

    const sheet = XLSX.utils.aoa_to_sheet(data);
    sheet['!cols'] = [{ wch: 25 }, { wch: 15 }, { wch: 15 }, { wch: 15 }];
    XLSX.utils.book_append_sheet(workbook, sheet, 'Resumen');
  }

  private addUsuariosSheet(workbook: XLSX.WorkBook, informe: any): void {
    const data = [
      [
        'ID Usuario',
        'Nombre',
        'Número Medidor',
        'Tipo Medidor',
        'Observaciones',
      ],
    ];

    for (const usuario of informe.usuarios_beneficiarios) {
      data.push([
        usuario.id,
        usuario.nombre,
        usuario.num_medidor,
        usuario.tipo_medidor,
        usuario.observaciones || '',
      ]);
    }

    const sheet = XLSX.utils.aoa_to_sheet(data);
    sheet['!cols'] = [
      { wch: 20 },
      { wch: 25 },
      { wch: 15 },
      { wch: 15 },
      { wch: 30 },
    ];
    XLSX.utils.book_append_sheet(workbook, sheet, 'Usuarios BT');
  }

  private addApoyosSheet(workbook: XLSX.WorkBook, informe: any): void {
    const data = [
      [
        'ID',
        'Número',
        'Nivel Tensión',
        'Tipo Poste',
        'Estado',
        'Perchas',
        'Templetes BT',
        'Tierras BT',
        'Conectores',
        'Coord X',
        'Coord Y',
        'Coord Z',
        'Observaciones',
      ],
    ];

    for (const apoyo of informe.apoyos) {
      data.push([
        apoyo.id,
        apoyo.numero,
        apoyo.nivel_tension,
        apoyo.tipo_poste || '',
        apoyo.poste_nuevo ? 'Nuevo' : 'Existente',
        apoyo.componentes.perchas,
        apoyo.componentes.templetes_bt,
        apoyo.componentes.tierras_bt,
        apoyo.componentes.conectores,
        apoyo.coordenadas.x || '',
        apoyo.coordenadas.y || '',
        apoyo.coordenadas.z || '',
        apoyo.observaciones || '',
      ]);
    }

    const sheet = XLSX.utils.aoa_to_sheet(data);
    sheet['!cols'] = Array(13).fill({ wch: 15 });
    XLSX.utils.book_append_sheet(workbook, sheet, 'Apoyos');
  }

  private addEstructurasSheet(workbook: XLSX.WorkBook, informe: any): void {
    const data = [['Apoyo Número', 'Código Estructura', 'Cantidad']];

    for (const apoyo of informe.apoyos) {
      if (apoyo.estructuras && apoyo.estructuras.length > 0) {
        for (const estructura of apoyo.estructuras) {
          data.push([apoyo.numero, estructura.codigo, estructura.cantidad]);
        }
      }
    }

    const sheet = XLSX.utils.aoa_to_sheet(data);
    sheet['!cols'] = [{ wch: 15 }, { wch: 20 }, { wch: 10 }];
    XLSX.utils.book_append_sheet(workbook, sheet, 'Estructuras');
  }

  private addTramosSheet(workbook: XLSX.WorkBook, informe: any): void {
    const data = [
      [
        'ID',
        'Apoyo Origen',
        'Apoyo Destino',
        'Nivel Tensión',
        'Tipo de Cable',
        'Longitud (m)',
        'Observaciones',
      ],
    ];

    for (const tramo of informe.tramos) {
      data.push([
        tramo.id,
        tramo.apoyo_origen,
        tramo.apoyo_destino,
        tramo.nivel_tension,
        tramo.tipo_cable,
        tramo.longitud_ml,
        tramo.observaciones || '',
      ]);
    }

    const sheet = XLSX.utils.aoa_to_sheet(data);
    sheet['!cols'] = [
      { wch: 20 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 30 },
    ];
    XLSX.utils.book_append_sheet(workbook, sheet, 'Tramos');
  }

  private addConsolidadoSheet(workbook: XLSX.WorkBook, informe: any): void {
    const consolidado = informe.consolidado;

    const data = [
      ['CONSOLIDADO DE CANTIDADES'],
      [''],
      ['Concepto', 'Cantidad'],
      ['Total Apoyos', consolidado.total_apoyos],
      ['Total Usuarios', consolidado.total_usuarios],
      ['Total Tramos', consolidado.total_tramos],
      [''],
      ['COMPONENTES TOTALES'],
      ['Perchas', consolidado.total_perchas],
      ['Templetes BT', consolidado.total_templetes_bt],
      ['Tierras BT', consolidado.total_tierras_bt],
      ['Conectores', consolidado.total_conectores],
      [''],
      ['CONDUCTOR'],
      ['Longitud Total (ml)', consolidado.total_longitud_ml],
      ['Conductor ACSR Total (ml)', consolidado.total_acsr],
    ];

    const sheet = XLSX.utils.aoa_to_sheet(data);
    sheet['!cols'] = [{ wch: 25 }, { wch: 15 }];
    XLSX.utils.book_append_sheet(workbook, sheet, 'Consolidado');
  }

  private addInconsistenciasSheet(workbook: XLSX.WorkBook, informe: any): void {
    const data = [
      ['Número Regla', 'Descripción', 'Mensaje', 'Severidad', 'Apoyo', 'Usuario'],
    ];

    for (const inconsistencia of informe.inconsistencias) {
      data.push([
        inconsistencia.numero_regla,
        inconsistencia.descripcion,
        inconsistencia.mensaje,
        inconsistencia.severidad,
        inconsistencia.apoyo_numero || '',
        inconsistencia.usuario_nombre || '',
      ]);
    }

    const sheet = XLSX.utils.aoa_to_sheet(data);
    sheet['!cols'] = [
      { wch: 10 },
      { wch: 25 },
      { wch: 40 },
      { wch: 12 },
      { wch: 10 },
      { wch: 25 },
    ];
    XLSX.utils.book_append_sheet(workbook, sheet, 'Inconsistencias');
  }
}
