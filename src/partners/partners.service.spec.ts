import { Test, TestingModule } from "@nestjs/testing";
import { NotFoundException } from "@nestjs/common";
import { PartnersService } from "./partners.service";
import { PrismaService } from "../prisma/prisma.service";

describe("PartnersService", () => {
  let service: PartnersService;
  let prisma: PrismaService;

  const mockPartner = {
    id: 1,
    name: "Partner User",
    email: "partner@test.com",
    role: "PARTNER" as any,
    createdAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PartnersService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
            },
            sale: {
              findMany: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<PartnersService>(PartnersService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("getCommissions", () => {
    it("should calculate commissions correctly", async () => {
      const sales = [
        {
          id: 1,
          productId: 1,
          customerId: 2,
          partnerId: 1,
          value: 1000,
          createdAt: new Date(),
        },
        {
          id: 2,
          productId: 2,
          customerId: 3,
          partnerId: 1,
          value: 500,
          createdAt: new Date(),
        },
      ];

      jest.spyOn(prisma.user, "findUnique").mockResolvedValue(mockPartner);
      jest.spyOn(prisma.sale, "findMany").mockResolvedValue(sales);

      const result = await service.getCommissions(1);

      expect(result).toEqual({
        partnerId: 1,
        totalSales: 2,
        totalCommission: 150.0, // 10% de 1500
      });
    });

    it("should return zero commissions when partner has no sales", async () => {
      jest.spyOn(prisma.user, "findUnique").mockResolvedValue(mockPartner);
      jest.spyOn(prisma.sale, "findMany").mockResolvedValue([]);

      const result = await service.getCommissions(1);

      expect(result).toEqual({
        partnerId: 1,
        totalSales: 0,
        totalCommission: 0,
      });
    });

    it("should throw NotFoundException if partner does not exist", async () => {
      jest.spyOn(prisma.user, "findUnique").mockResolvedValue(null);

      await expect(service.getCommissions(999)).rejects.toThrow(
        NotFoundException,
      );
    });

    it("should calculate 10% commission correctly", async () => {
      const sales = [
        {
          id: 1,
          productId: 1,
          customerId: 2,
          partnerId: 1,
          value: 2500,
          createdAt: new Date(),
        },
      ];

      jest.spyOn(prisma.user, "findUnique").mockResolvedValue(mockPartner);
      jest.spyOn(prisma.sale, "findMany").mockResolvedValue(sales);

      const result = await service.getCommissions(1);

      expect(result.totalCommission).toBe(250.0); // 10% de 2500
    });
  });
});
