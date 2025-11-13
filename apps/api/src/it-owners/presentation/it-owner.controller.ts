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
import { ITOwnerService } from '../application/it-owner.service';
import { CreateITOwnerDto } from '../application/dto/create-it-owner.dto';
import { UpdateITOwnerDto } from '../application/dto/update-it-owner.dto';
import { ITOwnerResponseDto } from '../application/dto/it-owner-response.dto';

@ApiTags('it-owners')
@Controller('it-owners')
export class ITOwnerController {
  constructor(private readonly service: ITOwnerService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todos los propietarios IT' })
  @ApiResponse({
    status: 200,
    description: 'Lista de propietarios IT obtenida exitosamente',
    type: [ITOwnerResponseDto],
  })
  async findAll(): Promise<ITOwnerResponseDto[]> {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un propietario IT por ID' })
  @ApiParam({ name: 'id', description: 'ID del propietario IT', example: 'owner-1' })
  @ApiResponse({
    status: 200,
    description: 'Propietario IT obtenido exitosamente',
    type: ITOwnerResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Propietario IT no encontrado' })
  async findById(@Param('id') id: string): Promise<ITOwnerResponseDto> {
    return this.service.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear un nuevo propietario IT' })
  @ApiBody({ type: CreateITOwnerDto })
  @ApiResponse({
    status: 201,
    description: 'Propietario IT creado exitosamente',
    type: ITOwnerResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  @ApiResponse({ status: 409, description: 'Conflicto: nombre ya existe' })
  async create(@Body() dto: CreateITOwnerDto): Promise<ITOwnerResponseDto> {
    return this.service.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un propietario IT existente' })
  @ApiParam({ name: 'id', description: 'ID del propietario IT', example: 'owner-1' })
  @ApiBody({ type: UpdateITOwnerDto })
  @ApiResponse({
    status: 200,
    description: 'Propietario IT actualizado exitosamente',
    type: ITOwnerResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Propietario IT no encontrado' })
  @ApiResponse({ status: 409, description: 'Conflicto: nombre ya existe' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateITOwnerDto,
  ): Promise<ITOwnerResponseDto> {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un propietario IT' })
  @ApiParam({ name: 'id', description: 'ID del propietario IT', example: 'owner-1' })
  @ApiResponse({ status: 204, description: 'Propietario IT eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Propietario IT no encontrado' })
  async delete(@Param('id') id: string): Promise<void> {
    return this.service.delete(id);
  }
}

