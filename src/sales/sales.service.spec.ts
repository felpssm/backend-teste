import { Test, TestingModule } from "@nestjs/testing";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { SalesService } from "./sales.service";
import { PrismaService } from "../prisma/prisma.service";

describe("SalesService", () => {
  let service: SalesService;
  let prisma: PrismaService;

  const mockProduct = {
    id: 1,
    name: "Test Product",
    price: 100,
    active: true,
  };

  const mockPartner = {
    id: 2,
    name: "Partner User",
    email: "partner@test.com",
    role: "PARTNER" as any,
    createdAt: new Date(),
  };

  const mockCustomer = {
    id: 3,
    name: "Customer User",
    email: "customer@test.com",
    role: "CUSTOMER" as any,
    createdAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SalesService,
        {
          provide: PrismaService,
          useValue: {
            product: {
              findUnique: jest.fn(),
            },
            user: {
              findUnique: jest.fn(),
            },
            sale: {
              create: jest.fn(),
              findMany: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<SalesService>(SalesService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("create", () => {
    it("should create a sale successfully", async () => {
      const createSaleDto = {
        productId: 1,
        customerId: 3,
        partnerId: 2,
        value: 100,
      };

      const expectedSale = {
        id: 1,
        ...createSaleDto,
        createdAt: new Date(),
        product: mockProduct,
        customer: mockCustomer,
        partner: mockPartner,
      };

      jest.spyOn(prisma.product, "findUnique").mockResolvedValue(mockProduct);
      jest
        .spyOn(prisma.user, "findUnique")
        .mockResolvedValueOnce(mockPartner)
        .mockResolvedValueOnce(mockCustomer);
      jest.spyOn(prisma.sale, "create").mockResolvedValue(expectedSale);

      const result = await service.create(createSaleDto);

      expect(result).toEqual(expectedSale);
      expect(prisma.product.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it("should throw NotFoundException if product does not exist", async () => {
      const createSaleDto = {
        productId: 999,
        customerId: 3,
        partnerId: 2,
        value: 100,
      };

      jest.spyOn(prisma.product, "findUnique").mockResolvedValue(null);

      await expect(service.create(createSaleDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it("should throw NotFoundException if partner does not exist", async () => {
      const createSaleDto = {
        productId: 1,
        customerId: 3,
        partnerId: 999,
        value: 100,
      };

      jest.spyOn(prisma.product, "findUnique").mockResolvedValue(mockProduct);
      jest.spyOn(prisma.user, "findUnique").mockResolvedValue(null);

      await expect(service.create(createSaleDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it("should throw BadRequestException if partner is not PARTNER role", async () => {
      const createSaleDto = {
        productId: 1,
        customerId: 3,
        partnerId: 2,
        value: 100,
      };

      const notPartner = {
        ...mockPartner,
        role: "CUSTOMER" as any,
      };

      jest.spyOn(prisma.product, "findUnique").mockResolvedValue(mockProduct);
      jest.spyOn(prisma.user, "findUnique").mockResolvedValue(notPartner);

      await expect(service.create(createSaleDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it("should throw BadRequestException if customer is not CUSTOMER role", async () => {
      const createSaleDto = {
        productId: 1,
        customerId: 3,
        partnerId: 2,
        value: 100,
      };

      const notCustomer = {
        ...mockCustomer,
        role: "PARTNER" as any,
      };

      jest.spyOn(prisma.product, "findUnique").mockResolvedValue(mockProduct);
      jest
        .spyOn(prisma.user, "findUnique")
        .mockResolvedValueOnce(mockPartner)
        .mockResolvedValueOnce(notCustomer);

      await expect(service.create(createSaleDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe("findAll", () => {
    it("should return an array of sales", async () => {
      const sales = [
        {
          id: 1,
          productId: 1,
          customerId: 3,
          partnerId: 2,
          value: 100,
          createdAt: new Date(),
          product: mockProduct,
          customer: mockCustomer,
          partner: mockPartner,
        },
      ];

      jest.spyOn(prisma.sale, "findMany").mockResolvedValue(sales);

      const result = await service.findAll();

      expect(result).toEqual(sales);
      expect(prisma.sale.findMany).toHaveBeenCalled();
    });
  });
});
