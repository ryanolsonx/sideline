import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { PlayerEntity } from './player.entity';

@Entity({ name: 'team' })
export class TeamEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 80 })
  name!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @OneToMany(() => PlayerEntity, (player) => player.team)
  players!: PlayerEntity[];
}
