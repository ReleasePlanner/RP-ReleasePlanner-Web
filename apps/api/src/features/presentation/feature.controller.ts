import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { FeatureService } from '../application/feature.service';
import { CreateFeatureDto } from '../application/dto/create-feature.dto';
import { UpdateFeatureDto } from '../application/dto/update-feature.dto';
import { FeatureResponseDto } from '../application/dto/feature-response.dto';

@ApiTags('features')
@Controller('features')
export class FeatureController {
  constructor(private readonly service: FeatureService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todas las features o filtrar por producto' })
  @ApiQuery({
    name: 'productId',
    required: false,
    description: 'ID del producto para filtrar features',
    example: 'product-1',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de features obtenida exitosamente',
    type: [FeatureResponseDto],
  })
  async findAll(@Query('productId') productId?: string): Promise<FeatureResponseDto[]> {
    if (productId) {
      return this.service.findByProductId(productId);
    }
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una feature por ID' })
  @ApiParam({ name: 'id', description: 'ID de la feature', example: 'feature-1' })
  @ApiResponse({
    status: 200,
    description: 'Feature obtenida exitosamente',
    type: FeatureResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Feature no encontrada' })
  async findById(@Param('id') id: string): Promise<FeatureResponseDto> {
    return this.service.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear una nueva feature' })
  @ApiBody({ type: CreateFeatureDto })
  @ApiResponse({
    status: 201,
    description: 'Feature creada exitosamente',
    type: FeatureResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  @ApiResponse({ status: 409, description: 'Conflicto: nombre ya existe' })
  async create(@Body() dto: CreateFeatureDto): Promise<FeatureResponseDto> {
    return this.service.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar una feature existente' })
  @ApiParam({ name: 'id', description: 'ID de la feature', example: 'feature-1' })
  @ApiBody({ type: UpdateFeatureDto })
  @ApiResponse({
    status: 200,
    description: 'Feature actualizada exitosamente',
    type: FeatureResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Feature no encontrada' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateFeatureDto,
  ): Promise<FeatureResponseDto> {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar una feature' })
  @ApiParam({ name: 'id', description: 'ID de la feature', example: 'feature-1' })
  @ApiResponse({ status: 204, description: 'Feature eliminada exitosamente' })
  @ApiResponse({ status: 404, description: 'Feature no encontrada' })
  async delete(@Param('id') id: string): Promise<void> {
    return this.service.delete(id);
  }
}

