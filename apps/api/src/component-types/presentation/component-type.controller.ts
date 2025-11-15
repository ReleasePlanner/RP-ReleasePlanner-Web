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
import { ComponentTypeService } from '../application/component-type.service';
import { CreateComponentTypeDto } from '../application/dto/create-component-type.dto';
import { UpdateComponentTypeDto } from '../application/dto/update-component-type.dto';
import { ComponentTypeResponseDto } from '../application/dto/component-type-response.dto';
import {
  COMPONENT_TYPE_API_OPERATION_SUMMARIES,
  COMPONENT_TYPE_API_RESPONSE_DESCRIPTIONS,
  COMPONENT_TYPE_HTTP_STATUS_CODES,
  COMPONENT_TYPE_API_PARAM_DESCRIPTIONS,
} from '../constants';
import { API_TAGS } from '../../common/constants';
import { Public } from '../../auth/decorators/public.decorator';

@ApiTags(API_TAGS.COMPONENT_TYPES)
@Controller('component-types')
@Public() // TODO: Remove this in production - temporary for development
export class ComponentTypeController {
  constructor(private readonly service: ComponentTypeService) {}

  @Get()
  @ApiOperation({ summary: COMPONENT_TYPE_API_OPERATION_SUMMARIES.GET_ALL })
  @ApiResponse({
    status: COMPONENT_TYPE_HTTP_STATUS_CODES.OK,
    description: COMPONENT_TYPE_API_RESPONSE_DESCRIPTIONS.LIST_RETRIEVED,
    type: [ComponentTypeResponseDto],
  })
  async findAll(): Promise<ComponentTypeResponseDto[]> {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: COMPONENT_TYPE_API_OPERATION_SUMMARIES.GET_BY_ID })
  @ApiParam({
    name: 'id',
    description: COMPONENT_TYPE_API_PARAM_DESCRIPTIONS.ID,
    example: COMPONENT_TYPE_API_PARAM_DESCRIPTIONS.EXAMPLE_ID,
  })
  @ApiResponse({
    status: COMPONENT_TYPE_HTTP_STATUS_CODES.OK,
    description: COMPONENT_TYPE_API_RESPONSE_DESCRIPTIONS.RETRIEVED,
    type: ComponentTypeResponseDto,
  })
  @ApiResponse({
    status: COMPONENT_TYPE_HTTP_STATUS_CODES.NOT_FOUND,
    description: COMPONENT_TYPE_API_RESPONSE_DESCRIPTIONS.NOT_FOUND,
  })
  async findById(@Param('id') id: string): Promise<ComponentTypeResponseDto> {
    return this.service.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: COMPONENT_TYPE_API_OPERATION_SUMMARIES.CREATE })
  @ApiBody({ type: CreateComponentTypeDto })
  @ApiResponse({
    status: COMPONENT_TYPE_HTTP_STATUS_CODES.CREATED,
    description: COMPONENT_TYPE_API_RESPONSE_DESCRIPTIONS.CREATED,
    type: ComponentTypeResponseDto,
  })
  @ApiResponse({
    status: COMPONENT_TYPE_HTTP_STATUS_CODES.BAD_REQUEST,
    description: COMPONENT_TYPE_API_RESPONSE_DESCRIPTIONS.INVALID_INPUT,
  })
  @ApiResponse({
    status: COMPONENT_TYPE_HTTP_STATUS_CODES.CONFLICT,
    description: COMPONENT_TYPE_API_RESPONSE_DESCRIPTIONS.CONFLICT,
  })
  async create(@Body() dto: CreateComponentTypeDto): Promise<ComponentTypeResponseDto> {
    return this.service.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: COMPONENT_TYPE_API_OPERATION_SUMMARIES.UPDATE })
  @ApiParam({
    name: 'id',
    description: COMPONENT_TYPE_API_PARAM_DESCRIPTIONS.ID,
    example: COMPONENT_TYPE_API_PARAM_DESCRIPTIONS.EXAMPLE_ID,
  })
  @ApiBody({ type: UpdateComponentTypeDto })
  @ApiResponse({
    status: COMPONENT_TYPE_HTTP_STATUS_CODES.OK,
    description: COMPONENT_TYPE_API_RESPONSE_DESCRIPTIONS.UPDATED,
    type: ComponentTypeResponseDto,
  })
  @ApiResponse({
    status: COMPONENT_TYPE_HTTP_STATUS_CODES.NOT_FOUND,
    description: COMPONENT_TYPE_API_RESPONSE_DESCRIPTIONS.NOT_FOUND,
  })
  @ApiResponse({
    status: COMPONENT_TYPE_HTTP_STATUS_CODES.CONFLICT,
    description: COMPONENT_TYPE_API_RESPONSE_DESCRIPTIONS.CONFLICT,
  })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateComponentTypeDto,
  ): Promise<ComponentTypeResponseDto> {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: COMPONENT_TYPE_API_OPERATION_SUMMARIES.DELETE })
  @ApiParam({
    name: 'id',
    description: COMPONENT_TYPE_API_PARAM_DESCRIPTIONS.ID,
    example: COMPONENT_TYPE_API_PARAM_DESCRIPTIONS.EXAMPLE_ID,
  })
  @ApiResponse({
    status: COMPONENT_TYPE_HTTP_STATUS_CODES.NO_CONTENT,
    description: COMPONENT_TYPE_API_RESPONSE_DESCRIPTIONS.DELETED,
  })
  @ApiResponse({
    status: COMPONENT_TYPE_HTTP_STATUS_CODES.NOT_FOUND,
    description: COMPONENT_TYPE_API_RESPONSE_DESCRIPTIONS.NOT_FOUND,
  })
  async delete(@Param('id') id: string): Promise<void> {
    return this.service.delete(id);
  }
}

