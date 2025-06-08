// src/auth/entities/refresh-token.entity.ts
import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity()
export class RefreshToken {
  @PrimaryColumn()
  refreshToken: string; 

  @OneToOne(() => User, (user) => user.refreshToken, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;


  @Column()
  userId: number; 

  @Column({ type: 'timestamp' })
  expiresAt: Date;

}