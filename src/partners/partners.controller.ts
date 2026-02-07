import { Controller, Get, Param, ParseIntPipe } from "@nestjs/common";
import { PartnersService } from "./partners.service";

@Controller("partners")
export class PartnersController {
  constructor(private readonly partnersService: PartnersService) {}

  @Get(":id/commissions")
  getCommissions(@Param("id", ParseIntPipe) id: number) {
    return this.partnersService.getCommissions(id);
  }
}
