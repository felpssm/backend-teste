import { Controller, Get, Query } from "@nestjs/common";
import { ReportsService } from "./reports.service";
import { SalesReportQueryDto } from "./dto/sales-report-query.dto";

@Controller("reports")
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get("sales")
  getSalesReport(@Query() query: SalesReportQueryDto) {
    return this.reportsService.getSalesReport(query);
  }
}
