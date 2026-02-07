import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateSaleDto } from "./dto/create-sale.dto";

@Injectable()
export class SalesService {
  constructor(private prisma: PrismaService) {}

  async create(createSaleDto: CreateSaleDto) {
    // Validar se o produto existe
    const product = await this.prisma.product.findUnique({
      where: { id: createSaleDto.productId },
    });

    if (!product) {
      throw new NotFoundException("Product not found");
    }

    // Validar se o partner existe e tem role PARTNER
    const partner = await this.prisma.user.findUnique({
      where: { id: createSaleDto.partnerId },
    });

    if (!partner) {
      throw new NotFoundException("Partner not found");
    }

    if (partner.role !== "PARTNER") {
      throw new BadRequestException("User is not a partner");
    }

    // Validar se o customer existe e tem role CUSTOMER
    const customer = await this.prisma.user.findUnique({
      where: { id: createSaleDto.customerId },
    });

    if (!customer) {
      throw new NotFoundException("Customer not found");
    }

    if (customer.role !== "CUSTOMER") {
      throw new BadRequestException("User is not a customer");
    }

    // Criar a venda
    return this.prisma.sale.create({
      data: createSaleDto,
      include: {
        product: true,
        customer: true,
        partner: true,
      },
    });
  }

  async findAll() {
    return this.prisma.sale.findMany({
      include: {
        product: true,
        customer: true,
        partner: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }
}
