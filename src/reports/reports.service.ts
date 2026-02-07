import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { SalesReportQueryDto } from "./dto/sales-report-query.dto";

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async getSalesReport(query: SalesReportQueryDto) {
    const where: any = {};

    // Aplicar filtro de data
    if (query.startDate || query.endDate) {
      where.createdAt = {};
      if (query.startDate) {
        where.createdAt.gte = new Date(query.startDate);
      }
      if (query.endDate) {
        where.createdAt.lte = new Date(query.endDate);
      }
    }

    // Aplicar filtro de parceiro
    if (query.partnerId) {
      where.partnerId = query.partnerId;
    }

    const sales = await this.prisma.sale.findMany({
      where,
      include: {
        product: true,
        customer: true,
        partner: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const totalSales = sales.length;
    const totalValue = sales.reduce((sum, sale) => sum + sale.value, 0);

    return {
      filters: {
        startDate: query.startDate,
        endDate: query.endDate,
        partnerId: query.partnerId,
      },
      summary: {
        totalSales,
        totalValue: parseFloat(totalValue.toFixed(2)),
      },
      sales,
    };
  }
}
