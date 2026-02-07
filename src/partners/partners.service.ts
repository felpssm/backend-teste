import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class PartnersService {
  constructor(private prisma: PrismaService) {}

  async getCommissions(partnerId: number) {
    // Verificar se o parceiro existe
    const partner = await this.prisma.user.findUnique({
      where: { id: partnerId },
    });

    if (!partner) {
      throw new NotFoundException("Partner not found");
    }

    // Buscar todas as vendas do parceiro
    const sales = await this.prisma.sale.findMany({
      where: { partnerId },
    });

    const totalSales = sales.length;
    const totalCommission = sales.reduce(
      (sum, sale) => sum + sale.value * 0.1,
      0,
    );

    return {
      partnerId,
      totalSales,
      totalCommission: parseFloat(totalCommission.toFixed(2)),
    };
  }
}
