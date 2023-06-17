import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { CreateUserInput, Product, UpdateUserInput } from 'src/graphql';

@Resolver('User')
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation('createUser')
  async create(@Args('createUserInput') createUserInput: CreateUserInput) {
    const user = await this.usersService.create(createUserInput);
    return { ...user, products: this.formatProduct(user.products) };
  }

  @Query('users')
  async findAll() {
    const users = await this.usersService.findAll();
    console.log(users);
    return users.map((f) => {
      return { ...f, products: this.formatProduct(f.products) };
    });
  }

  @Query('user')
  async findOne(@Args('id') id: string) {
    const user = await this.usersService.findOne(id);
    return { ...user, products: this.formatProduct(user.products) };
  }

  @Mutation('updateUser')
  async update(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    const user = await this.usersService.update(
      updateUserInput.id,
      updateUserInput,
    );
    return { ...user, products: this.formatProduct(user.products) };
  }

  @Mutation('removeUser')
  remove(@Args('id') id: string) {
    return this.usersService.remove(id);
  }

  formatProduct(products: Product[]) {
    return products.map((f) => {
      if (!f) {
        return;
      }

      const price = f.price !== null ? f.price / 100 : f.price;
      return { ...f, price };
    });
  }
}
