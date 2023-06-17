import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { Product } from 'src/products/entities/product.entity';

type MockType<T> = {
  [P in keyof T]?: jest.Mock<object>;
};

describe('UsersService', () => {
  let service: UsersService;
  const products = [];

  // Create mock user repository for testing
  const mockUserRepository: MockType<Repository<User>> = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };
  const mockProductRepository: MockType<Repository<Product>> = {
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: getRepositoryToken(Product),
          useValue: mockProductRepository,
        },
      ],
    }).compile();

    // Create products beforehand
    products.push([
      {
        id: 'fdgh',
        name: 'Chips',
        price: 999,
      },
      {
        id: '1k9d',
        name: 'Milk',
        price: 899,
      },
    ]);
    mockProductRepository.find.mockReturnValue(products);

    service = module.get<UsersService>(UsersService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const user = {
      id: '7890',
      email: 'nic_cage@yahoo.com',
      name: 'Nic Cage',
      age: 35,
    };

    it('should create a new user', async () => {
      mockProductRepository.find.mockReturnValue([]);
      mockUserRepository.create.mockReturnValue(user);
      mockUserRepository.save.mockReturnValue(user);

      const newUser = await service.create(user);
      expect(newUser).toMatchObject(user);
    });

    it('should create a new user with a product', async () => {
      mockProductRepository.find.mockReturnValue(products);
      mockUserRepository.create.mockReturnValue(user);
      mockUserRepository.save.mockReturnValue(user);

      const userWithProduct = { ...user, products };
      const newUser = await service.create(user);
      expect(newUser).toMatchObject(userWithProduct);
    });
  });

  describe('findAll', () => {
    it('should find all users', async () => {
      const users = [
        {
          email: 'john_wayne@msn.com',
          name: 'John Wayne',
          age: 70,
          products,
        },
        {
          email: 'michael_jordan@nike.com',
          name: 'Michael Jordan',
          age: 60,
          products,
        },
      ];
      mockUserRepository.find.mockReturnValue(users);

      const allUsers = await service.findAll();
      expect(allUsers).toMatchObject(users);
    });
  });

  describe('findOne', () => {
    const user = {
      id: 'uuid',
      email: 'james_cameron@netflix.com',
      name: 'James Cameron',
      age: 55,
      products,
    };

    it('should find a user', async () => {
      mockUserRepository.findOne.mockReturnValue(user);

      const foundUser = await service.findOne(user.id);
      expect(foundUser).toMatchObject(user);
    });

    it('should fail to find a user', async () => {
      mockUserRepository.findOne.mockReturnValue(null);

      try {
        await service.findOne(user.id);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('update', () => {
    const user = {
      id: '1234',
      email: 'john_wick@nyc.com',
      name: 'John Wick',
      age: 28,
      products: [],
    };

    it('should update a user', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(user);
      mockUserRepository.save.mockReturnValue({ ...user, age: 40, products });

      const updatedUser = await service.update(user.id, {
        ...user,
        age: 40,
        products,
      });
      expect(updatedUser.age).toBe(40);
      expect(updatedUser.products).toMatchObject(products);
    });

    it('should throw error if user is not found', async () => {
      jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException());

      try {
        await service.update('4567', { ...user, age: 38 });
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('remove', () => {
    const user = {
      id: 'asdf',
      email: 'tina_turner@gmail.com',
      name: 'Tina Turner',
      age: 52,
      products,
    };

    it('should delete a user', async () => {
      mockUserRepository.findOne.mockReturnValue(user);
      mockUserRepository.remove.mockReturnValue(user);

      const deleted = await service.remove(user.id);
      expect(deleted).toBe(user.id);
    });

    it('should fail to delete a user', async () => {
      jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException());

      try {
        await service.remove(user.id);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });
});
