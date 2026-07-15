import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'visitas' })
export class Visita {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  contrato: string;

  @Column({ length: 100 })
  vereda: string;

  @Column({ length: 100 })
  municipio: string;

  @Column({ length: 100 })
  tecnico_id: string;

  @Column({ type: 'date' })
  fecha: string;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;
}
