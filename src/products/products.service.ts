import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateProductDto } from "./dto/create-product.dto";

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    return this.prisma.product.create({
      data: {
        name: createProductDto.name,
        price: createProductDto.price,
        active: createProductDto.active ?? true,
      },
    });
  }

  async findAll() {
    return this.prisma.product.findMany({
      orderBy: { id: "desc" },
    });
  }

  async findOne(id: number) {
    return this.prisma.product.findUnique({
      where: { id },
    });
  }
}
