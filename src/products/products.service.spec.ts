import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';

type MockType<T> = {
  [P in keyof T]?: jest.Mock<object>;
};

describe('ProductsService', () => {
  let service: ProductsService;

  // Create mock product repository for testing
  const mockProductRepository: MockType<Repository<Product>> = {
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useValue: mockProductRepository,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new product', async () => {
      const product = {
        id: '1234',
        name: 'Juicy Fruit',
        price: 19.99,
      };
      const savedProduct = { ...product, price: 1999 };
      mockProductRepository.save.mockReturnValue(savedProduct);

      const newProduct = await service.create(product);
      expect(newProduct).toMatchObject(savedProduct);
    });
  });

  describe('findAll', () => {
    it('should find all products', async () => {
      const products = [
        {
          id: '2345',
          name: 'Lettuce',
          price: 699,
        },
        {
          id: 'qwerty',
          name: 'Garburetor',
          price: 17479,
        },
      ];
      mockProductRepository.find.mockReturnValue(products);

      const allProducts = await service.findAll();
      expect(allProducts).toMatchObject(products);
    });
  });

  describe('findOne', () => {
    const product = {
      id: 'uuid',
      name: 'Tomato',
      price: 599,
    };

    it('should find a product', async () => {
      mockProductRepository.findOne.mockReturnValue(product);

      const foundProduct = await service.findOne(product.id);
      expect(foundProduct).toMatchObject(product);
    });

    it('should fail to find a product', async () => {
      mockProductRepository.findOne.mockReturnValue(null);

      try {
        await service.findOne(product.id);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('update', () => {
    const product = {
      id: '8765',
      name: 'CocaCola',
      price: 10000,
    };

    it('should update a product', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(product);
      mockProductRepository.save.mockReturnValue({ ...product, price: 12000 });

      const updatedProduct = await service.update(product.id, {
        ...product,
        price: 12000,
      });
      expect(updatedProduct.price).toBe(12000);
    });

    it('should throw error if product is not found', async () => {
      jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException());

      try {
        await service.update('1234', { ...product, price: 450 });
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('remove', () => {
    const product = {
      id: 'ghjk',
      name: 'Sofa',
      price: 3450099,
    };

    it('should delete a product', async () => {
      mockProductRepository.findOne.mockReturnValue(product);
      mockProductRepository.remove.mockReturnValue(product);

      const deleted = await service.remove(product.id);
      expect(deleted).toBe(product.id);
    });

    it('should fail to delete a product', async () => {
      jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException());

      try {
        await service.remove(product.id);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });
});
