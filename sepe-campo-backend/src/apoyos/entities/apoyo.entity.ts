import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Visita } from '../../visitas/entities/visita.entity';
import { EstructuraApoyo } from './estructura-apoyo.entity';

@Entity({ name: 'apoyos' })
export class Apoyo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  visita_id: string;

  @ManyToOne(() => Visita, { eager: true })
  @JoinColumn({ name: 'visita_id' })
  visita: Visita;

  @Column({ type: 'int' })
  numero: number;

  @Column({ length: 50 })
  nivel_tension: string; // BT, MT

  @Column({ length: 100, nullable: true })
  tipo_poste: string;

  @Column({ type: 'int', default: 0 })
  perchas: number;

  @Column({ type: 'int', default: 0 })
  templetes_bt: number;

  @Column({ type: 'int', default: 0 })
  templetes_mt: number;

  @Column({ type: 'int', default: 0 })
  tierras_bt: number;

  @Column({ type: 'int', default: 0 })
  tierras_mt: number;

  @Column({ type: 'int', default: 0 })
  conectores: number;

  @Column({ type: 'boolean', default: false })
  transformador: boolean;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  coord_x: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  coord_y: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  coord_z: number;

  @Column({ type: 'text', nullable: true })
  observaciones: string;

  @OneToMany(() => EstructuraApoyo, (estructura) => estructura.apoyo, {
    cascade: true,
    eager: true,
  })
  estructuras: EstructuraApoyo[];

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;
}
