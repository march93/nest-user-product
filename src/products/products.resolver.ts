import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ProductsService } from './products.service';
import { CreateProductInput, Product, UpdateProductInput } from 'src/graphql';

@Resolver('Product')
export class ProductsResolver {
  constructor(private readonly productsService: ProductsService) {}

  @Mutation('createProduct')
  async create(
    @Args('createProductInput') createProductInput: CreateProductInput,
  ) {
    const product = await this.productsService.create(createProductInput);
    return this.formatProduct(product);
  }

  @Query('products')
  async findAll() {
    const products = await this.productsService.findAll();
    return products.map((f) => {
      return this.formatProduct(f);
    });
  }

  @Query('product')
  async findOne(@Args('id') id: string) {
    const product = await this.productsService.findOne(id);
    return this.formatProduct(product);
  }

  @Mutation('updateProduct')
  async update(
    @Args('updateProductInput') updateProductInput: UpdateProductInput,
  ) {
    const product = await this.productsService.update(
      updateProductInput.id,
      updateProductInput,
    );
    return this.formatProduct(product);
  }

  @Mutation('removeProduct')
  remove(@Args('id') id: string) {
    return this.productsService.remove(id);
  }

  formatProduct(product: Product) {
    const price = product.price !== null ? product.price / 100 : product.price;
    return { ...product, price };
  }
}
