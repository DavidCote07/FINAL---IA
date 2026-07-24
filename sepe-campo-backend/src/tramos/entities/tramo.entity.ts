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
import { Apoyo } from '../../apoyos/entities/apoyo.entity';

@Entity({ name: 'tramos' })
export class Tramo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  visita_id: string;

  @ManyToOne(() => Visita, { eager: true })
  @JoinColumn({ name: 'visita_id' })
  visita: Visita;

  @Column('uuid')
  apoyo_origen_id: string;

  @ManyToOne(() => Apoyo, { eager: true })
  @JoinColumn({ name: 'apoyo_origen_id' })
  apoyo_origen: Apoyo;

  @Column('uuid')
  apoyo_destino_id: string;

  @ManyToOne(() => Apoyo, { eager: true })
  @JoinColumn({ name: 'apoyo_destino_id' })
  apoyo_destino: Apoyo;

  @Column({ length: 50 })
  nivel_tension: string; // BT, MT

  @Column({ length: 20 })
  tipo_cable: string; // DUPLEX, TRIPLEX

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  longitud_ml: number;

  @Column({ type: 'text', nullable: true })
  observaciones: string;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;
}
