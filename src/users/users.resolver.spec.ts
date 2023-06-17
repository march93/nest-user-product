import { Test, TestingModule } from '@nestjs/testing';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';
import { NotFoundException } from '@nestjs/common';

const mockUserService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

describe('UsersResolver', () => {
  let resolver: UsersResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersResolver,
        {
          provide: UsersService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    resolver = module.get<UsersResolver>(UsersResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('createUser', () => {
    it('should return a new user', async () => {
      const user = {
        email: 'bob@gmail.com',
        name: 'Bob Saget',
        age: 66,
      };
      mockUserService.create.mockResolvedValue({ ...user, id: '1234' });

      const newUser = await resolver.create(user);
      expect(newUser).toMatchObject({ ...user, id: '1234' });
    });
  });

  describe('users', () => {
    it('should find and return all users', async () => {
      const users = [
        {
          id: '2345',
          email: 'billy@gmail.com',
          name: 'Billy Bob',
          age: 43,
        },
        {
          id: '3456',
          email: 'serena@gmail.com',
          name: 'Serena Williams',
          age: 25,
        },
      ];
      mockUserService.findAll.mockResolvedValue(users);

      const allUsers = await resolver.findAll();
      expect(allUsers).toMatchObject(users);
    });
  });

  describe('user', () => {
    const user = {
      id: '5678',
      email: 'tilda@gmail.com',
      name: 'Tilda Swinton',
      age: 33,
    };

    it('should find and return a user', async () => {
      mockUserService.findOne.mockResolvedValue(user);

      const foundUser = await resolver.findOne(user.id);
      expect(foundUser).toMatchObject(user);
    });

    it('should throw error', async () => {
      mockUserService.findOne.mockRejectedValue(new NotFoundException());

      try {
        await resolver.findOne('1234');
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('updateUser', () => {
    const user = {
      id: 'qwerty',
      email: 'enrique@gmail.com',
      name: 'Enrique Inglesias',
      age: 41,
    };

    it('should find and update a user', async () => {
      mockUserService.update.mockResolvedValue({
        ...user,
        name: 'Julio Inglesias',
      });

      const updatedUser = await resolver.update({
        ...user,
        name: 'Julio Inglesias',
      });
      expect(updatedUser.name).toBe('Julio Inglesias');
    });

    it('should throw an error', async () => {
      mockUserService.findOne.mockRejectedValue(new NotFoundException());

      try {
        await resolver.update({ ...user, age: 12 });
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('removeUser', () => {
    const user = {
      id: 'fghj',
      email: 'elton@gmail.com',
      name: 'Elton John',
      age: 77,
    };

    it('should find and delete a user', async () => {
      mockUserService.remove.mockResolvedValue(user.id);

      const deleted = await resolver.remove(user.id);
      expect(deleted).toBe(user.id);
    });

    it('should throw an error', async () => {
      mockUserService.findOne.mockRejectedValue(new NotFoundException());

      try {
        await resolver.remove(user.id);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });
});
