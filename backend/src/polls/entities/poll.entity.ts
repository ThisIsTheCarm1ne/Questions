import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

// Questions in a poll stored in an array
// Votes is an array of numbers,
// where each number correspondes  to position of the picked question in from questions array

@Entity()
export class Poll {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column()
  name: string;

  @Column("text", { array: true })
  questions: string[];

  @Column("int", { array: true })
  votes: number[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}