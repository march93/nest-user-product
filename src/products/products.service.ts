import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product as ProductEntity } from './entities/product.entity';
import { CreateProductInput, Product, UpdateProductInput } from 'src/graphql';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductEntity)
    private productRepository: Repository<Product>,
  ) {}

  async create(createProductInput: CreateProductInput): Promise<Product> {
    createProductInput.price = this.formatPrice(createProductInput.price);

    return this.productRepository.save(createProductInput);
  }

  async findAll(): Promise<Product[]> {
    return this.productRepository.find();
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Product:${id} not found`);
    }

    return product;
  }

  async update(
    id: string,
    updateProductInput: UpdateProductInput,
  ): Promise<Product> {
    const product = await this.findOne(id);

    updateProductInput.price = this.formatPrice(updateProductInput.price);

    // Merge object and ignore null values
    const merged = {};
    Object.keys({ ...product, ...updateProductInput }).map((key) => {
      merged[key] = !!updateProductInput[key]
        ? updateProductInput[key]
        : product[key];
    });

    return this.productRepository.save(merged);
  }

  async remove(id: string): Promise<string> {
    const product = await this.findOne(id);

    this.productRepository.remove(product);
    return product.id;
  }

  formatPrice(price: number | null) {
    // Return price in cents if not null
    return price !== null ? price * 100 : price;
  }
}
