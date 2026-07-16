import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Visita } from '../../visitas/entities/visita.entity';

@Entity({ name: 'usuarios_beneficiarios' })
export class UsuarioBeneficiario {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  visita_id: string;

  @ManyToOne(() => Visita, { eager: true })
  @JoinColumn({ name: 'visita_id' })
  visita: Visita;

  @Column({ length: 150, nullable: true })
  nombre: string;

  @Column({ length: 50, nullable: true })
  num_medidor: string;

  @Column({ length: 100, nullable: true })
  tipo_medidor: string;

  @Column({ length: 100, nullable: true })
  acometida: string;

  @Column({ type: 'text', nullable: true })
  observaciones: string;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;
}
