import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Visita } from '../../visitas/entities/visita.entity';
import { Apoyo } from '../../apoyos/entities/apoyo.entity';
import { UsuarioBeneficiario } from '../../usuarios-beneficiarios/entities/usuario-beneficiario.entity';
import { Tramo } from '../../tramos/entities/tramo.entity';

@Entity({ name: 'inconsistencias' })
export class Inconsistencia {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  visita_id: string;

  @ManyToOne(() => Visita)
  @JoinColumn({ name: 'visita_id' })
  visita: Visita;

  @Column('uuid', { nullable: true })
  apoyo_id?: string;

  @ManyToOne(() => Apoyo, { nullable: true })
  @JoinColumn({ name: 'apoyo_id' })
  apoyo?: Apoyo;

  @Column('uuid', { nullable: true })
  usuario_id?: string;

  @ManyToOne(() => UsuarioBeneficiario, { nullable: true })
  @JoinColumn({ name: 'usuario_id' })
  usuario?: UsuarioBeneficiario;

  @Column('uuid', { nullable: true })
  tramo_id?: string;

  @ManyToOne(() => Tramo, { nullable: true })
  @JoinColumn({ name: 'tramo_id' })
  tramo?: Tramo;

  @Column({ type: 'int' })
  numero_regla: number; // 1, 2, 3, etc.

  @Column({ type: 'text' })
  descripcion: string; // Descripción legible de la regla

  @Column({ type: 'text' })
  mensaje: string; // Mensaje de la alerta específico

  @Column({ type: 'varchar', length: 50, default: 'INFO' })
  severidad: string; // INFO, WARNING, ERROR

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;
}
