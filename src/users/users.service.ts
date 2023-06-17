import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreateUserInput, Product, UpdateUserInput, User } from 'src/graphql';
import { User as UserEntity } from './entities/user.entity';
import { Product as ProductEntity } from '../products/entities/product.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<User>,
    @InjectRepository(ProductEntity)
    private productsRepository: Repository<Product>,
  ) {}

  async create(createUserInput: CreateUserInput): Promise<User> {
    const { userProducts, userProps } = await this.getUserProducts(
      createUserInput,
    );

    // Create new user and add products
    const user = this.usersRepository.create(userProps);
    user.products = userProducts;

    return this.usersRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User:${id} not found`);
    }

    return user;
  }

  async update(id: string, updateUserInput: UpdateUserInput): Promise<User> {
    const user = await this.findOne(id);

    // Get user object with products
    const { userProducts, userProps } = await this.getUserProducts(
      updateUserInput,
    );
    user.products = userProducts;

    // Merge object and ignore null values
    const merged = {};
    Object.keys({ ...user, ...userProps }).map((key) => {
      merged[key] = !!userProps[key] ? userProps[key] : user[key];
    });

    return this.usersRepository.save(merged);
  }

  async remove(id: string): Promise<string> {
    const user = await this.findOne(id);

    this.usersRepository.remove(user);
    return user.id;
  }

  async getUserProducts(userInput: Partial<UpdateUserInput>) {
    // De-structure input
    const { products, ...userProps } = userInput;

    if (!products.length) {
      // Handle empty array case
      return { userProducts: [], userProps };
    }

    // Get products from list
    const userProducts = await this.productsRepository.find({
      where: [{ id: In(products) }, { name: In(products) }],
    });

    return { userProducts, userProps };
  }
}
