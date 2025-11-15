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
import {
  PLAN_API_OPERATION_SUMMARIES,
  PLAN_API_RESPONSE_DESCRIPTIONS,
  PLAN_HTTP_STATUS_CODES,
  PLAN_API_PARAM_DESCRIPTIONS,
} from '../constants';
import { API_TAGS } from '../../common/constants';

@ApiTags(API_TAGS.PLANS)
@Controller('plans')
export class PlanController {
  constructor(private readonly service: PlanService) {}

  @Get()
  @ApiOperation({ summary: PLAN_API_OPERATION_SUMMARIES.GET_ALL })
  @ApiResponse({
    status: PLAN_HTTP_STATUS_CODES.OK,
    description: PLAN_API_RESPONSE_DESCRIPTIONS.LIST_RETRIEVED,
    type: [PlanResponseDto],
  })
  async findAll(): Promise<PlanResponseDto[]> {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: PLAN_API_OPERATION_SUMMARIES.GET_BY_ID })
  @ApiParam({
    name: 'id',
    description: PLAN_API_PARAM_DESCRIPTIONS.ID,
    example: PLAN_API_PARAM_DESCRIPTIONS.EXAMPLE_ID,
  })
  @ApiResponse({
    status: PLAN_HTTP_STATUS_CODES.OK,
    description: PLAN_API_RESPONSE_DESCRIPTIONS.RETRIEVED,
    type: PlanResponseDto,
  })
  @ApiResponse({
    status: PLAN_HTTP_STATUS_CODES.NOT_FOUND,
    description: PLAN_API_RESPONSE_DESCRIPTIONS.NOT_FOUND,
  })
  async findById(@Param('id') id: string): Promise<PlanResponseDto> {
    return this.service.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: PLAN_API_OPERATION_SUMMARIES.CREATE })
  @ApiBody({ type: CreatePlanDto })
  @ApiResponse({
    status: PLAN_HTTP_STATUS_CODES.CREATED,
    description: PLAN_API_RESPONSE_DESCRIPTIONS.CREATED,
    type: PlanResponseDto,
  })
  @ApiResponse({
    status: PLAN_HTTP_STATUS_CODES.BAD_REQUEST,
    description: PLAN_API_RESPONSE_DESCRIPTIONS.INVALID_INPUT,
  })
  @ApiResponse({
    status: PLAN_HTTP_STATUS_CODES.CONFLICT,
    description: PLAN_API_RESPONSE_DESCRIPTIONS.CONFLICT,
  })
  async create(@Body() dto: CreatePlanDto): Promise<PlanResponseDto> {
    return this.service.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: PLAN_API_OPERATION_SUMMARIES.UPDATE })
  @ApiParam({
    name: 'id',
    description: PLAN_API_PARAM_DESCRIPTIONS.ID,
    example: PLAN_API_PARAM_DESCRIPTIONS.EXAMPLE_ID,
  })
  @ApiBody({ type: UpdatePlanDto })
  @ApiResponse({
    status: PLAN_HTTP_STATUS_CODES.OK,
    description: PLAN_API_RESPONSE_DESCRIPTIONS.UPDATED,
    type: PlanResponseDto,
  })
  @ApiResponse({
    status: PLAN_HTTP_STATUS_CODES.NOT_FOUND,
    description: PLAN_API_RESPONSE_DESCRIPTIONS.NOT_FOUND,
  })
  @ApiResponse({
    status: PLAN_HTTP_STATUS_CODES.CONFLICT,
    description: PLAN_API_RESPONSE_DESCRIPTIONS.CONFLICT,
  })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdatePlanDto,
  ): Promise<PlanResponseDto> {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: PLAN_API_OPERATION_SUMMARIES.DELETE })
  @ApiParam({
    name: 'id',
    description: PLAN_API_PARAM_DESCRIPTIONS.ID,
    example: PLAN_API_PARAM_DESCRIPTIONS.EXAMPLE_ID,
  })
  @ApiResponse({
    status: PLAN_HTTP_STATUS_CODES.NO_CONTENT,
    description: PLAN_API_RESPONSE_DESCRIPTIONS.DELETED,
  })
  @ApiResponse({
    status: PLAN_HTTP_STATUS_CODES.NOT_FOUND,
    description: PLAN_API_RESPONSE_DESCRIPTIONS.NOT_FOUND,
  })
  async delete(@Param('id') id: string): Promise<void> {
    return this.service.delete(id);
  }
}

