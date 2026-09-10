import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { PlayerEntity } from './player.entity';
import { Formation } from '../domain/team.model';

@Entity({ name: 'team' })
export class TeamEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 80 })
  name!: string;

  @Column({ type: 'varchar', length: 80 })
  coachUsername!: string;

  @Column({ type: 'jsonb' })
  formation!: Formation;

  @CreateDateColumn()
  createdAt!: Date;

  @OneToMany(() => PlayerEntity, (player) => player.team)
  players!: PlayerEntity[];
}
