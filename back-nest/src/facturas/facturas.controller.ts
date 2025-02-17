import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FacturasService } from './facturas.service';
import { CreateFacturaDto } from './dto/create-factura.dto';
import { UpdateFacturaDto } from './dto/update-factura.dto';

@Controller('facturas')
export class FacturasController {
  constructor(private readonly facturasService: FacturasService) {}

  @Post()
  create(@Body() createFacturaDto: CreateFacturaDto) {
    return this.facturasService.createFactura(createFacturaDto);
  }

  @Get()
  findAll() {
    return this.facturasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.facturasService.findOne(+id);
  }
  
  @Get('servicio/:id')
  async findFacturasByServicio(@Param('id') servicioId: number) {
    return this.facturasService.findByServicioId(servicioId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFacturaDto: UpdateFacturaDto) {
    return this.facturasService.updateFactura(+id, updateFacturaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.facturasService.deleteFactura(+id);
  }
}
