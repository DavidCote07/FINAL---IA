import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inconsistencia } from './entities/inconsistencia.entity';
import { CreateInconsistenciaDto } from './dto/create-inconsistencia.dto';
import { ApoyosService } from '../apoyos/apoyos.service';
import { UsuariosBeneficiariosService } from '../usuarios-beneficiarios/usuarios-beneficiarios.service';

@Injectable()
export class ValidacionesService {
  constructor(
    @InjectRepository(Inconsistencia)
    private inconsistenciasRepository: Repository<Inconsistencia>,
    private apoyosService: ApoyosService,
    private usuariosService: UsuariosBeneficiariosService,
  ) {}

  /**
   * Crea una nueva inconsistencia
   */
  async create(
    createInconsistenciaDto: CreateInconsistenciaDto,
  ): Promise<Inconsistencia> {
    const inconsistencia = this.inconsistenciasRepository.create({
      ...createInconsistenciaDto,
      severidad: createInconsistenciaDto.severidad || 'INFO',
    });
    return this.inconsistenciasRepository.save(inconsistencia);
  }

  /**
   * Obtiene todas las inconsistencias de una visita
   */
  async findByVisita(visitaId: string): Promise<Inconsistencia[]> {
    return this.inconsistenciasRepository.find({
      where: { visita_id: visitaId },
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Limpia todas las inconsistencias de una visita
   */
  async clearByVisita(visitaId: string): Promise<void> {
    await this.inconsistenciasRepository.delete({ visita_id: visitaId });
  }

  /**
   * Ejecuta todas las reglas de validación para una visita
   */
  async validarVisita(visitaId: string): Promise<Inconsistencia[]> {
    // Limpiar inconsistencias previas
    await this.clearByVisita(visitaId);

    // Ejecutar todas las reglas
    await this.regla1_TransformadorSinTierrasMT(visitaId);
    await this.regla2_EstructuraMTEnBT(visitaId);
    await this.regla3_ApoyoBTSinTierras(visitaId);
    await this.regla4_UsuarioSinMedidor(visitaId);

    // Retornar inconsistencias generadas
    return this.findByVisita(visitaId);
  }

  /**
   * REGLA 1: Si un apoyo reporta transformador pero no reporta tierras de MT,
   * se genera una alerta.
   */
  private async regla1_TransformadorSinTierrasMT(
    visitaId: string,
  ): Promise<void> {
    const apoyos = await this.apoyosService.findAll(visitaId);

    for (const apoyo of apoyos) {
      if (apoyo.transformador && apoyo.tierras_mt === 0) {
        await this.create({
          visita_id: visitaId,
          apoyo_id: apoyo.id,
          numero_regla: 1,
          descripcion: 'Transformador sin tierras MT',
          mensaje: `Apoyo ${apoyo.numero}: Tiene transformador pero no reporta tierras de media tensión`,
          severidad: 'WARNING',
        });
      }
    }
  }

  /**
   * REGLA 2: Si un apoyo reporta estructura MT pero su nivel de tensión registrado es BT,
   * se genera una alerta.
   */
  private async regla2_EstructuraMTEnBT(visitaId: string): Promise<void> {
    const apoyos = await this.apoyosService.findAll(visitaId);

    for (const apoyo of apoyos) {
      if (
        apoyo.nivel_tension === 'BT' &&
        apoyo.estructuras &&
        apoyo.estructuras.length > 0
      ) {
        await this.create({
          visita_id: visitaId,
          apoyo_id: apoyo.id,
          numero_regla: 2,
          descripcion: 'Estructura MT en nivel BT',
          mensaje: `Apoyo ${apoyo.numero}: Nivel de tensión es BT pero tiene estructuras MT asociadas`,
          severidad: 'WARNING',
        });
      }
    }
  }

  /**
   * REGLA 3: Si un apoyo tiene nivel de tensión Baja Tensión (BT) y no reporta tierras BT,
   * se genera una alerta de advertencia.
   */
  private async regla3_ApoyoBTSinTierras(visitaId: string): Promise<void> {
    const apoyos = await this.apoyosService.findAll(visitaId);

    for (const apoyo of apoyos) {
      const nivelTension = String(apoyo.nivel_tension ?? '')
        .trim()
        .toLowerCase();
      const esBT =
        nivelTension === 'baja tensión (bt)' ||
        nivelTension === 'baja tension (bt)' ||
        nivelTension === 'bt';

      if (esBT && Number(apoyo.tierras_bt ?? 0) === 0) {
        await this.create({
          visita_id: visitaId,
          apoyo_id: apoyo.id,
          numero_regla: 3,
          descripcion: 'Apoyo BT sin tierras de puesta a tierra',
          mensaje: `El apoyo N° ${apoyo.numero} requiere sistema de puesta a tierra en Baja Tensión`,
          severidad: 'WARNING',
        });
      }
    }
  }

  /**
   * REGLA 4: Si un usuario beneficiario no tiene número de medidor registrado,
   * se genera una alerta.
   */
  private async regla4_UsuarioSinMedidor(visitaId: string): Promise<void> {
    const usuarios = await this.usuariosService.findAll(visitaId);

    for (const usuario of usuarios) {
      if (!usuario.num_medidor || usuario.num_medidor.trim() === '') {
        await this.create({
          visita_id: visitaId,
          usuario_id: usuario.id,
          numero_regla: 4,
          descripcion: 'Usuario sin número de medidor',
          mensaje: `Usuario ${usuario.nombre || 'sin nombre'}: No tiene número de medidor registrado`,
          severidad: 'INFO',
        });
      }
    }
  }
}
