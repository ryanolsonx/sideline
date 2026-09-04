import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { PlayerEntity } from '../../teams/db/player.entity';
import { GameRoundEntity } from './game-round.entity';

@Entity({ name: 'game_round_assignment' })
export class GameRoundAssignmentEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('uuid')
  roundId!: string;

  @ManyToOne(() => GameRoundEntity, (round) => round.assignments, { onDelete: 'CASCADE' })
  round!: GameRoundEntity;

  @Column('uuid')
  playerId!: string;

  @ManyToOne(() => PlayerEntity)
  player!: PlayerEntity;

  @Column({ length: 16 })
  status!: 'PLAYING' | 'OUT';

  @Column({ length: 16, nullable: true })
  position!: 'GOALIE' | 'DEFENDER' | 'FORWARD' | null;
}
