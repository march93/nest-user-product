import { Product } from 'src/products/entities/product.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  age: number;

  @ManyToMany(() => Product, {
    cascade: true,
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinTable()
  products: Product[];
}
