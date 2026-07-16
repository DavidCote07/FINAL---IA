import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Apoyo } from './apoyo.entity';

@Entity({ name: 'estructuras_apoyos' })
export class EstructuraApoyo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  apoyo_id: string;

  @ManyToOne(() => Apoyo, (apoyo) => apoyo.estructuras, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'apoyo_id' })
  apoyo: Apoyo;

  @Column({ length: 100 })
  codigo: string;

  @Column({ type: 'int' })
  cantidad: number;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;
}
