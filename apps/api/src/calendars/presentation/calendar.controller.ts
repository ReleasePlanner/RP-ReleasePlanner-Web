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
import { CalendarService } from '../application/calendar.service';
import { CreateCalendarDto } from '../application/dto/create-calendar.dto';
import { UpdateCalendarDto } from '../application/dto/update-calendar.dto';
import { CalendarResponseDto } from '../application/dto/calendar-response.dto';

@ApiTags('calendars')
@Controller('calendars')
export class CalendarController {
  constructor(private readonly service: CalendarService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todos los calendarios' })
  @ApiResponse({
    status: 200,
    description: 'Lista de calendarios obtenida exitosamente',
    type: [CalendarResponseDto],
  })
  async findAll(): Promise<CalendarResponseDto[]> {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un calendario por ID' })
  @ApiParam({ name: 'id', description: 'ID del calendario', example: 'calendar-1' })
  @ApiResponse({
    status: 200,
    description: 'Calendario obtenido exitosamente',
    type: CalendarResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Calendario no encontrado' })
  async findById(@Param('id') id: string): Promise<CalendarResponseDto> {
    return this.service.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear un nuevo calendario' })
  @ApiBody({ type: CreateCalendarDto })
  @ApiResponse({
    status: 201,
    description: 'Calendario creado exitosamente',
    type: CalendarResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  @ApiResponse({ status: 409, description: 'Conflicto: nombre ya existe' })
  async create(@Body() dto: CreateCalendarDto): Promise<CalendarResponseDto> {
    return this.service.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un calendario existente' })
  @ApiParam({ name: 'id', description: 'ID del calendario', example: 'calendar-1' })
  @ApiBody({ type: UpdateCalendarDto })
  @ApiResponse({
    status: 200,
    description: 'Calendario actualizado exitosamente',
    type: CalendarResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Calendario no encontrado' })
  @ApiResponse({ status: 409, description: 'Conflicto: nombre ya existe' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateCalendarDto,
  ): Promise<CalendarResponseDto> {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un calendario' })
  @ApiParam({ name: 'id', description: 'ID del calendario', example: 'calendar-1' })
  @ApiResponse({ status: 204, description: 'Calendario eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Calendario no encontrado' })
  async delete(@Param('id') id: string): Promise<void> {
    return this.service.delete(id);
  }
}

