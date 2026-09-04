import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { GameEntity } from './game.entity';
import { GameRoundAssignmentEntity } from './game-round-assignment.entity';

@Entity({ name: 'game_round' })
export class GameRoundEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('uuid')
  gameId!: string;

  @ManyToOne(() => GameEntity, (game) => game.rounds, { onDelete: 'CASCADE' })
  game!: GameEntity;

  @Column('smallint')
  number!: number;

  @OneToMany(() => GameRoundAssignmentEntity, (assignment) => assignment.round)
  assignments!: GameRoundAssignmentEntity[];
}
