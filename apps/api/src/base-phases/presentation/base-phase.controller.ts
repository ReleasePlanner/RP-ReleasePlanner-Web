/**
 * Base Phase Controller
 * 
 * Presentation layer - HTTP endpoints
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
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { BasePhaseService } from '../application/base-phase.service';
import { CreateBasePhaseDto } from '../application/dto/create-base-phase.dto';
import { UpdateBasePhaseDto } from '../application/dto/update-base-phase.dto';
import { BasePhaseResponseDto } from '../application/dto/base-phase-response.dto';
import { CacheResult, InvalidateCache } from '../../common/decorators/cache.decorator';
import { CacheInvalidateInterceptor } from '../../common/interceptors/cache-invalidate.interceptor';

@ApiTags('base-phases')
@Controller('base-phases')
@UseInterceptors(CacheInvalidateInterceptor)
export class BasePhaseController {
  constructor(private readonly service: BasePhaseService) {}

  @Get()
  @CacheResult(300, 'base-phases') // Cache for 5 minutes
  @ApiOperation({ summary: 'Obtener todas las fases base' })
  @ApiResponse({
    status: 200,
    description: 'Lista de fases base obtenida exitosamente',
    type: [BasePhaseResponseDto],
  })
  async findAll(): Promise<BasePhaseResponseDto[]> {
    return this.service.findAll();
  }

  @Get(':id')
  @CacheResult(300, 'base-phase') // Cache for 5 minutes
  @ApiOperation({ summary: 'Obtener una fase base por ID' })
  @ApiParam({ name: 'id', description: 'ID de la fase base', example: 'base-1' })
  @ApiResponse({
    status: 200,
    description: 'Fase base obtenida exitosamente',
    type: BasePhaseResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Fase base no encontrada' })
  async findById(@Param('id') id: string): Promise<BasePhaseResponseDto> {
    return this.service.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @InvalidateCache('base-phases:*') // Invalidate all base-phases cache
  @ApiOperation({ summary: 'Crear una nueva fase base' })
  @ApiBody({ type: CreateBasePhaseDto })
  @ApiResponse({
    status: 201,
    description: 'Fase base creada exitosamente',
    type: BasePhaseResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  @ApiResponse({ status: 409, description: 'Conflicto: nombre o color ya existe' })
  async create(@Body() dto: CreateBasePhaseDto): Promise<BasePhaseResponseDto> {
    return this.service.create(dto);
  }

  @Put(':id')
  @InvalidateCache('base-phases:*', 'base-phase:*') // Invalidate cache
  @ApiOperation({ summary: 'Actualizar una fase base existente' })
  @ApiParam({ name: 'id', description: 'ID de la fase base', example: 'base-1' })
  @ApiBody({ type: UpdateBasePhaseDto })
  @ApiResponse({
    status: 200,
    description: 'Fase base actualizada exitosamente',
    type: BasePhaseResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Fase base no encontrada' })
  @ApiResponse({ status: 409, description: 'Conflicto: nombre o color ya existe' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateBasePhaseDto,
  ): Promise<BasePhaseResponseDto> {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @InvalidateCache('base-phases:*', 'base-phase:*') // Invalidate cache
  @ApiOperation({ summary: 'Eliminar una fase base' })
  @ApiParam({ name: 'id', description: 'ID de la fase base', example: 'base-1' })
  @ApiResponse({ status: 204, description: 'Fase base eliminada exitosamente' })
  @ApiResponse({ status: 404, description: 'Fase base no encontrada' })
  async delete(@Param('id') id: string): Promise<void> {
    return this.service.delete(id);
  }
}

