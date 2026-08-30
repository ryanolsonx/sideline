import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'match' })
export class MatchEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 120 })
  name!: string;

  @CreateDateColumn()
  createdAt!: Date;
}
