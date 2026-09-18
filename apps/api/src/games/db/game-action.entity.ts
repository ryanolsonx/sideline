import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

/**
 * One row per coach action, never updated and never removed. `sequence` is the order the
 * coach took them in; the projection reads nothing else about position.
 */
@Entity({ name: 'game_action' })
@Index('IDX_game_action_gameId_sequence', ['gameId', 'sequence'], { unique: true })
export class GameActionEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('uuid')
  gameId!: string;

  @Column({ type: 'int' })
  sequence!: number;

  @Column({ type: 'varchar', length: 40 })
  kind!: string;

  @Column({ type: 'jsonb' })
  payload!: Record<string, unknown>;

  @CreateDateColumn({ type: 'timestamptz' })
  recordedAt!: Date;
}
