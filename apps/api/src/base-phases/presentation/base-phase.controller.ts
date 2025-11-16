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
} from '@nestjs/swagger';
import {
  BASE_PHASE_API_OPERATION_SUMMARIES,
  BASE_PHASE_API_RESPONSE_DESCRIPTIONS,
  BASE_PHASE_HTTP_STATUS_CODES,
  BASE_PHASE_API_PARAM_DESCRIPTIONS,
} from '../constants';
import { API_TAGS } from '../../common/constants';
import { BasePhaseService } from '../application/base-phase.service';
import { CreateBasePhaseDto } from '../application/dto/create-base-phase.dto';
import { UpdateBasePhaseDto } from '../application/dto/update-base-phase.dto';
import { BasePhaseResponseDto } from '../application/dto/base-phase-response.dto';
import { CacheResult, InvalidateCache } from '../../common/decorators/cache.decorator';
import { CacheInvalidateInterceptor } from '../../common/interceptors/cache-invalidate.interceptor';
import { Public } from '../../auth/decorators/public.decorator';

@ApiTags(API_TAGS.BASE_PHASES)
@Controller('base-phases')
@Public() // TODO: Remove this in production - temporary for development
@UseInterceptors(CacheInvalidateInterceptor)
export class BasePhaseController {
  constructor(private readonly service: BasePhaseService) {}

  @Get()
  @CacheResult(300, 'base-phases') // Cache for 5 minutes
  @ApiOperation({ summary: BASE_PHASE_API_OPERATION_SUMMARIES.GET_ALL })
  @ApiResponse({
    status: BASE_PHASE_HTTP_STATUS_CODES.OK,
    description: BASE_PHASE_API_RESPONSE_DESCRIPTIONS.LIST_RETRIEVED,
    type: [BasePhaseResponseDto],
  })
  async findAll(): Promise<BasePhaseResponseDto[]> {
    return this.service.findAll();
  }

  @Get(':id')
  @CacheResult(300, 'base-phase') // Cache for 5 minutes
  @ApiOperation({ summary: BASE_PHASE_API_OPERATION_SUMMARIES.GET_BY_ID })
  @ApiParam({
    name: 'id',
    description: BASE_PHASE_API_PARAM_DESCRIPTIONS.ID,
    example: BASE_PHASE_API_PARAM_DESCRIPTIONS.EXAMPLE_ID,
  })
  @ApiResponse({
    status: BASE_PHASE_HTTP_STATUS_CODES.OK,
    description: BASE_PHASE_API_RESPONSE_DESCRIPTIONS.RETRIEVED,
    type: BasePhaseResponseDto,
  })
  @ApiResponse({
    status: BASE_PHASE_HTTP_STATUS_CODES.NOT_FOUND,
    description: BASE_PHASE_API_RESPONSE_DESCRIPTIONS.NOT_FOUND,
  })
  async findById(@Param('id') id: string): Promise<BasePhaseResponseDto> {
    return this.service.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @InvalidateCache('base-phases:*') // Invalidate all base-phases cache
  @ApiOperation({ summary: BASE_PHASE_API_OPERATION_SUMMARIES.CREATE })
  @ApiBody({ type: CreateBasePhaseDto })
  @ApiResponse({
    status: BASE_PHASE_HTTP_STATUS_CODES.CREATED,
    description: BASE_PHASE_API_RESPONSE_DESCRIPTIONS.CREATED,
    type: BasePhaseResponseDto,
  })
  @ApiResponse({
    status: BASE_PHASE_HTTP_STATUS_CODES.BAD_REQUEST,
    description: BASE_PHASE_API_RESPONSE_DESCRIPTIONS.INVALID_INPUT,
  })
  @ApiResponse({
    status: BASE_PHASE_HTTP_STATUS_CODES.CONFLICT,
    description: BASE_PHASE_API_RESPONSE_DESCRIPTIONS.CONFLICT,
  })
  async create(@Body() dto: CreateBasePhaseDto): Promise<BasePhaseResponseDto> {
    return this.service.create(dto);
  }

  @Put(':id')
  @InvalidateCache('base-phases:*', 'base-phase:*') // Invalidate cache
  @ApiOperation({ summary: BASE_PHASE_API_OPERATION_SUMMARIES.UPDATE })
  @ApiParam({
    name: 'id',
    description: BASE_PHASE_API_PARAM_DESCRIPTIONS.ID,
    example: BASE_PHASE_API_PARAM_DESCRIPTIONS.EXAMPLE_ID,
  })
  @ApiBody({ type: UpdateBasePhaseDto })
  @ApiResponse({
    status: BASE_PHASE_HTTP_STATUS_CODES.OK,
    description: BASE_PHASE_API_RESPONSE_DESCRIPTIONS.UPDATED,
    type: BasePhaseResponseDto,
  })
  @ApiResponse({
    status: BASE_PHASE_HTTP_STATUS_CODES.NOT_FOUND,
    description: BASE_PHASE_API_RESPONSE_DESCRIPTIONS.NOT_FOUND,
  })
  @ApiResponse({
    status: BASE_PHASE_HTTP_STATUS_CODES.CONFLICT,
    description: BASE_PHASE_API_RESPONSE_DESCRIPTIONS.CONFLICT,
  })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateBasePhaseDto,
  ): Promise<BasePhaseResponseDto> {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @InvalidateCache('base-phases:*', 'base-phase:*') // Invalidate cache
  @ApiOperation({ summary: BASE_PHASE_API_OPERATION_SUMMARIES.DELETE })
  @ApiParam({
    name: 'id',
    description: BASE_PHASE_API_PARAM_DESCRIPTIONS.ID,
    example: BASE_PHASE_API_PARAM_DESCRIPTIONS.EXAMPLE_ID,
  })
  @ApiResponse({
    status: BASE_PHASE_HTTP_STATUS_CODES.NO_CONTENT,
    description: BASE_PHASE_API_RESPONSE_DESCRIPTIONS.DELETED,
  })
  @ApiResponse({
    status: BASE_PHASE_HTTP_STATUS_CODES.NOT_FOUND,
    description: BASE_PHASE_API_RESPONSE_DESCRIPTIONS.NOT_FOUND,
  })
  async delete(@Param('id') id: string): Promise<void> {
    return this.service.delete(id);
  }
}

