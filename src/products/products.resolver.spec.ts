import { Test, TestingModule } from '@nestjs/testing';
import { ProductsResolver } from './products.resolver';
import { ProductsService } from './products.service';
import { NotFoundException } from '@nestjs/common';

const mockProductService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

describe('ProductsResolver', () => {
  let resolver: ProductsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsResolver,
        {
          provide: ProductsService,
          useValue: mockProductService,
        },
      ],
    }).compile();

    resolver = module.get<ProductsResolver>(ProductsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('createProduct', () => {
    it('should return a new product', async () => {
      const product = {
        name: 'Laptop',
        price: 999999,
      };
      mockProductService.create.mockResolvedValue({ ...product, id: '1234' });

      const newProduct = await resolver.create(product);
      expect(newProduct).toMatchObject({
        ...product,
        id: '1234',
        price: 9999.99,
      });
    });
  });

  describe('products', () => {
    it('should find and return all products', async () => {
      const products = [
        {
          id: '2345',
          name: 'Corn',
          price: 25099,
        },
        {
          id: '6789',
          name: 'Starch',
          price: 89977,
        },
      ];
      mockProductService.findAll.mockResolvedValue(products);

      const allProducts = await resolver.findAll();
      expect(allProducts).toMatchObject(
        products.map((f) => {
          return { ...f, price: f.price / 100 };
        }),
      );
    });
  });

  describe('product', () => {
    const product = {
      id: 'rtyu',
      name: 'Phone',
      price: 129900,
    };

    it('should find and return a product', async () => {
      mockProductService.findOne.mockResolvedValue(product);

      const foundProduct = await resolver.findOne(product.id);
      expect(foundProduct).toMatchObject({
        ...product,
        price: product.price / 100,
      });
    });

    it('should throw error', async () => {
      mockProductService.findOne.mockRejectedValue(new NotFoundException());

      try {
        await resolver.findOne('1234');
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('updateProduct', () => {
    const product = {
      id: 'hjkl',
      name: 'Plane',
      price: 1234,
    };

    it('should find and update a product', async () => {
      mockProductService.update.mockResolvedValue({
        ...product,
        name: 'Aeroplane',
      });

      const updatedProduct = await resolver.update({
        ...product,
        name: 'Aeroplane',
      });
      expect(updatedProduct.name).toBe('Aeroplane');
    });

    it('should throw an error', async () => {
      mockProductService.findOne.mockRejectedValue(new NotFoundException());

      try {
        await resolver.update({ ...product, name: 'Airplane' });
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('removeProduct', () => {
    const product = {
      id: 'vbnm',
      name: 'Linux',
      price: 117788,
    };

    it('should find and delete a product', async () => {
      mockProductService.remove.mockResolvedValue(product.id);

      const deleted = await resolver.remove(product.id);
      expect(deleted).toBe(product.id);
    });

    it('should throw an error', async () => {
      mockProductService.findOne.mockRejectedValue(new NotFoundException());

      try {
        await resolver.remove(product.id);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });
});
