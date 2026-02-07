import { Test, TestingModule } from "@nestjs/testing";
import { ConflictException } from "@nestjs/common";
import { UsersService } from "./users.service";
import { PrismaService } from "../prisma/prisma.service";
import { UserRole } from "./dto/create-user.dto";

describe("UsersService", () => {
  let service: UsersService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
              create: jest.fn(),
              findMany: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("create", () => {
    it("should create a new user", async () => {
      const createUserDto = {
        name: "Test User",
        email: "test@example.com",
        role: UserRole.CUSTOMER,
      };

      const expectedUser = {
        id: 1,
        ...createUserDto,
        createdAt: new Date(),
      };

      jest.spyOn(prisma.user, "findUnique").mockResolvedValue(null);
      jest.spyOn(prisma.user, "create").mockResolvedValue(expectedUser);

      const result = await service.create(createUserDto);

      expect(result).toEqual(expectedUser);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: createUserDto.email },
      });
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: createUserDto,
      });
    });

    it("should throw ConflictException if email already exists", async () => {
      const createUserDto = {
        name: "Test User",
        email: "existing@example.com",
        role: UserRole.CUSTOMER,
      };

      const existingUser = {
        id: 1,
        ...createUserDto,
        createdAt: new Date(),
      };

      jest.spyOn(prisma.user, "findUnique").mockResolvedValue(existingUser);

      await expect(service.create(createUserDto)).rejects.toThrow(
        ConflictException,
      );
      expect(prisma.user.create).not.toHaveBeenCalled();
    });
  });

  describe("findAll", () => {
    it("should return an array of users", async () => {
      const users = [
        {
          id: 1,
          name: "User 1",
          email: "user1@example.com",
          role: "CUSTOMER" as any,
          createdAt: new Date(),
        },
        {
          id: 2,
          name: "User 2",
          email: "user2@example.com",
          role: "PARTNER" as any,
          createdAt: new Date(),
        },
      ];

      jest.spyOn(prisma.user, "findMany").mockResolvedValue(users);

      const result = await service.findAll();

      expect(result).toEqual(users);
      expect(prisma.user.findMany).toHaveBeenCalledWith({
        orderBy: { createdAt: "desc" },
      });
    });
  });

  describe("findOne", () => {
    it("should return a user by id", async () => {
      const user = {
        id: 1,
        name: "Test User",
        email: "test@example.com",
        role: "CUSTOMER" as any,
        createdAt: new Date(),
      };

      jest.spyOn(prisma.user, "findUnique").mockResolvedValue(user);

      const result = await service.findOne(1);

      expect(result).toEqual(user);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
  });
});
