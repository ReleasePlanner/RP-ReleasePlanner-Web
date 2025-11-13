/**
 * Product Controller
 */
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { ProductService } from '../application/product.service';
import { CreateProductDto } from '../application/dto/create-product.dto';
import { UpdateProductDto } from '../application/dto/update-product.dto';
import { ProductResponseDto } from '../application/dto/product-response.dto';

@ApiTags('products')
@Controller('products')
export class ProductController {
  constructor(private readonly service: ProductService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todos los productos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de productos obtenida exitosamente',
    type: [ProductResponseDto],
  })
  async findAll(): Promise<ProductResponseDto[]> {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un producto por ID' })
  @ApiParam({ name: 'id', description: 'ID del producto', example: 'product-1' })
  @ApiResponse({
    status: 200,
    description: 'Producto obtenido exitosamente',
    type: ProductResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  async findById(@Param('id') id: string): Promise<ProductResponseDto> {
    return this.service.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear un nuevo producto' })
  @ApiBody({ type: CreateProductDto })
  @ApiResponse({
    status: 201,
    description: 'Producto creado exitosamente',
    type: ProductResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  @ApiResponse({ status: 409, description: 'Conflicto: nombre ya existe' })
  async create(@Body() dto: CreateProductDto): Promise<ProductResponseDto> {
    return this.service.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un producto existente' })
  @ApiParam({ name: 'id', description: 'ID del producto', example: 'product-1' })
  @ApiBody({ type: UpdateProductDto })
  @ApiResponse({
    status: 200,
    description: 'Producto actualizado exitosamente',
    type: ProductResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  @ApiResponse({ status: 409, description: 'Conflicto: nombre ya existe' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
  ): Promise<ProductResponseDto> {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un producto' })
  @ApiParam({ name: 'id', description: 'ID del producto', example: 'product-1' })
  @ApiResponse({ status: 204, description: 'Producto eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  async delete(@Param('id') id: string): Promise<void> {
    return this.service.delete(id);
  }
}

