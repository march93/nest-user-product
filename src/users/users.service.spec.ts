import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';

type MockType<T> = {
  [P in keyof T]?: jest.Mock<object>;
};

describe('UsersService', () => {
  let service: UsersService;

  // Create mock user repository for testing
  const mockUserRepository: MockType<Repository<User>> = {
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const user = {
        id: '7890',
        email: 'nic_cage@yahoo.com',
        name: 'Nic Cage',
        age: 35,
      };
      mockUserRepository.save.mockReturnValue(user);

      const newUser = await service.create(user);
      expect(newUser).toMatchObject(user);
    });
  });

  describe('findAll', () => {
    it('should find all users', async () => {
      const users = [
        {
          email: 'john_wayne@msn.com',
          name: 'John Wayne',
          age: 70,
        },
        {
          email: 'michael_jordan@nike.com',
          name: 'Michael Jordan',
          age: 60,
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
    };

    it('should find a user', async () => {
      mockUserRepository.findOne.mockReturnValue(user);

      const foundUser = await service.findOne(user.id);
      expect(foundUser).toMatchObject(user);
    });

    it('should fail to find a user', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(null);

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
    };

    it('should update a user', async () => {
      mockUserRepository.save.mockReturnValue({ ...user, age: 40 });

      const updatedUser = await service.update(user.id, { ...user, age: 40 });
      expect(updatedUser.age).toBe(40);
    });

    it('should throw error if user is not found', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(null);

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
