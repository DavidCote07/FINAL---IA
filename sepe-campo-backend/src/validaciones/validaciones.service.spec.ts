import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ValidacionesService } from './validaciones.service';
import { Inconsistencia } from './entities/inconsistencia.entity';
import { ApoyosService } from '../apoyos/apoyos.service';
import { UsuariosBeneficiariosService } from '../usuarios-beneficiarios/usuarios-beneficiarios.service';

describe('ValidacionesService', () => {
  let service: ValidacionesService;
  let inconsistenciasRepository: { create: jest.Mock; save: jest.Mock; delete: jest.Mock; find: jest.Mock };
  let apoyosService: { findAll: jest.Mock };
  let usuariosService: { findAll: jest.Mock };

  beforeEach(async () => {
    inconsistenciasRepository = {
      create: jest.fn((dto) => dto),
      save: jest.fn(async (dto) => ({ id: 'inconsistencia-1', ...dto })),
      delete: jest.fn(async () => undefined),
      find: jest.fn(async () => []),
    };

    apoyosService = {
      findAll: jest.fn(async () => [
        {
          id: 'apoyo-1',
          numero: 12,
          nivel_tension: 'Baja Tensión (BT)',
          tierras_bt: 0,
          estructuras: [],
        },
      ]),
    };

    usuariosService = {
      findAll: jest.fn(async () => []),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ValidacionesService,
        {
          provide: getRepositoryToken(Inconsistencia),
          useValue: inconsistenciasRepository,
        },
        {
          provide: ApoyosService,
          useValue: apoyosService,
        },
        {
          provide: UsuariosBeneficiariosService,
          useValue: usuariosService,
        },
      ],
    }).compile();

    service = module.get<ValidacionesService>(ValidacionesService);
  });

  it('genera una advertencia cuando un apoyo BT no tiene tierras', async () => {
    await service.validarVisita('visita-1');

    expect(inconsistenciasRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        visita_id: 'visita-1',
        apoyo_id: 'apoyo-1',
        numero_regla: 1,
        descripcion: 'Apoyo BT sin tierras de puesta a tierra',
        mensaje: 'El apoyo N° 12 requiere sistema de puesta a tierra en Baja Tensión',
        severidad: 'WARNING',
      }),
    );
  });
});
