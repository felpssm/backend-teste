import { Module } from "@nestjs/common";
import { PrismaModule } from "./prisma/prisma.module";
import { UsersModule } from "./users/users.module";
import { ProductsModule } from "./products/products.module";
import { SalesModule } from "./sales/sales.module";
import { PartnersModule } from "./partners/partners.module";
import { ReportsModule } from "./reports/reports.module";
import { Prisma } from "@prisma/client";

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    ProductsModule,
    SalesModule,
    PartnersModule,
    ReportsModule,
  ],
})
export class AppModule {}
