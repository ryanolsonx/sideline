import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Formation } from '../../teams/domain/team.model';
import { RosterPlayer } from '../domain/game.model';

@Entity({ name: 'game' })
export class GameEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('uuid')
  teamId!: string;

  @Column({ type: 'jsonb' })
  roster!: RosterPlayer[];

  @Column({ type: 'jsonb' })
  formation!: Formation;

  @Column({ type: 'varchar', length: 64 })
  rotationSeed!: string;

  @CreateDateColumn({ type: 'timestamptz' })
  startedAt!: Date;
}
