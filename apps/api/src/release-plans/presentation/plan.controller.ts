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
import { PlanService } from '../application/plan.service';
import { CreatePlanDto } from '../application/dto/create-plan.dto';
import { UpdatePlanDto } from '../application/dto/update-plan.dto';
import { PlanResponseDto } from '../application/dto/plan-response.dto';

@ApiTags('plans')
@Controller('plans')
export class PlanController {
  constructor(private readonly service: PlanService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todos los planes de release' })
  @ApiResponse({
    status: 200,
    description: 'Lista de planes obtenida exitosamente',
    type: [PlanResponseDto],
  })
  async findAll(): Promise<PlanResponseDto[]> {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un plan de release por ID' })
  @ApiParam({ name: 'id', description: 'ID del plan', example: 'plan-1' })
  @ApiResponse({
    status: 200,
    description: 'Plan obtenido exitosamente',
    type: PlanResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Plan no encontrado' })
  async findById(@Param('id') id: string): Promise<PlanResponseDto> {
    return this.service.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear un nuevo plan de release' })
  @ApiBody({ type: CreatePlanDto })
  @ApiResponse({
    status: 201,
    description: 'Plan creado exitosamente',
    type: PlanResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  @ApiResponse({ status: 409, description: 'Conflicto: nombre ya existe' })
  async create(@Body() dto: CreatePlanDto): Promise<PlanResponseDto> {
    return this.service.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un plan de release existente' })
  @ApiParam({ name: 'id', description: 'ID del plan', example: 'plan-1' })
  @ApiBody({ type: UpdatePlanDto })
  @ApiResponse({
    status: 200,
    description: 'Plan actualizado exitosamente',
    type: PlanResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Plan no encontrado' })
  @ApiResponse({ status: 409, description: 'Conflicto: nombre ya existe' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdatePlanDto,
  ): Promise<PlanResponseDto> {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un plan de release' })
  @ApiParam({ name: 'id', description: 'ID del plan', example: 'plan-1' })
  @ApiResponse({ status: 204, description: 'Plan eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Plan no encontrado' })
  async delete(@Param('id') id: string): Promise<void> {
    return this.service.delete(id);
  }
}

