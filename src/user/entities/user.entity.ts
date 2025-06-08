import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeInsert,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import * as bcrypt from 'bcrypt';
import { Property } from '../../property/entities/property.entity';
import { RefreshToken } from '../../auth/entities/refresh-token.entity';
export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  MANAGER = 'manager',
}
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  userName: string;
  @Column({ nullable: false, unique: true })
  email: string;
  @Exclude()
  @Column({ nullable: false })
  password: string;

  @Column({ nullable: true, unique: true })
  phoneNumber: string; 
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;


  @OneToMany(() => Property, (property) => property.user)
  properties: Property[];

  @OneToOne(() => RefreshToken, (refreshToken) => refreshToken.user)
  refreshToken: RefreshToken


  //Hash Password before insert to DB
  @BeforeInsert()
  async hashPassword() {
    if (this.password) {
      const saltRounds = 10;
      this.password = await bcrypt.hash(this.password, saltRounds);
    }
  }

}
