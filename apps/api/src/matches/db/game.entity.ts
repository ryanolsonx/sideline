import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { TeamEntity } from '../../teams/db/team.entity';
import { GameRoundEntity } from './game-round.entity';

@Entity({ name: 'game' })
export class GameEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('uuid')
  teamId!: string;

  @ManyToOne(() => TeamEntity)
  team!: TeamEntity;

  @Column('smallint')
  fieldSize!: 5 | 6;

  @Column({ length: 16 })
  status!: 'ACTIVE' | 'COMPLETE';

  @Column('smallint')
  currentRound!: number;

  @CreateDateColumn()
  startedAt!: Date;

  @OneToMany(() => GameRoundEntity, (round) => round.game)
  rounds!: GameRoundEntity[];
}
