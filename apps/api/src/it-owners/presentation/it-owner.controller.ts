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
import {
  IT_OWNER_API_OPERATION_SUMMARIES,
  IT_OWNER_API_RESPONSE_DESCRIPTIONS,
  IT_OWNER_HTTP_STATUS_CODES,
  IT_OWNER_API_PARAM_DESCRIPTIONS,
} from '../constants';
import { API_TAGS } from '../../common/constants';
import { Public } from '../../auth/decorators/public.decorator';

@ApiTags(API_TAGS.IT_OWNERS)
@Controller('it-owners')
@Public() // TODO: Remove this in production - temporary for development
export class ITOwnerController {
  constructor(private readonly service: ITOwnerService) {}

  @Get()
  @ApiOperation({ summary: IT_OWNER_API_OPERATION_SUMMARIES.GET_ALL })
  @ApiResponse({
    status: IT_OWNER_HTTP_STATUS_CODES.OK,
    description: IT_OWNER_API_RESPONSE_DESCRIPTIONS.LIST_RETRIEVED,
    type: [ITOwnerResponseDto],
  })
  async findAll(): Promise<ITOwnerResponseDto[]> {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: IT_OWNER_API_OPERATION_SUMMARIES.GET_BY_ID })
  @ApiParam({
    name: 'id',
    description: IT_OWNER_API_PARAM_DESCRIPTIONS.ID,
    example: IT_OWNER_API_PARAM_DESCRIPTIONS.EXAMPLE_ID,
  })
  @ApiResponse({
    status: IT_OWNER_HTTP_STATUS_CODES.OK,
    description: IT_OWNER_API_RESPONSE_DESCRIPTIONS.RETRIEVED,
    type: ITOwnerResponseDto,
  })
  @ApiResponse({
    status: IT_OWNER_HTTP_STATUS_CODES.NOT_FOUND,
    description: IT_OWNER_API_RESPONSE_DESCRIPTIONS.NOT_FOUND,
  })
  async findById(@Param('id') id: string): Promise<ITOwnerResponseDto> {
    return this.service.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: IT_OWNER_API_OPERATION_SUMMARIES.CREATE })
  @ApiBody({ type: CreateITOwnerDto })
  @ApiResponse({
    status: IT_OWNER_HTTP_STATUS_CODES.CREATED,
    description: IT_OWNER_API_RESPONSE_DESCRIPTIONS.CREATED,
    type: ITOwnerResponseDto,
  })
  @ApiResponse({
    status: IT_OWNER_HTTP_STATUS_CODES.BAD_REQUEST,
    description: IT_OWNER_API_RESPONSE_DESCRIPTIONS.INVALID_INPUT,
  })
  @ApiResponse({
    status: IT_OWNER_HTTP_STATUS_CODES.CONFLICT,
    description: IT_OWNER_API_RESPONSE_DESCRIPTIONS.CONFLICT,
  })
  async create(@Body() dto: CreateITOwnerDto): Promise<ITOwnerResponseDto> {
    return this.service.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: IT_OWNER_API_OPERATION_SUMMARIES.UPDATE })
  @ApiParam({
    name: 'id',
    description: IT_OWNER_API_PARAM_DESCRIPTIONS.ID,
    example: IT_OWNER_API_PARAM_DESCRIPTIONS.EXAMPLE_ID,
  })
  @ApiBody({ type: UpdateITOwnerDto })
  @ApiResponse({
    status: IT_OWNER_HTTP_STATUS_CODES.OK,
    description: IT_OWNER_API_RESPONSE_DESCRIPTIONS.UPDATED,
    type: ITOwnerResponseDto,
  })
  @ApiResponse({
    status: IT_OWNER_HTTP_STATUS_CODES.NOT_FOUND,
    description: IT_OWNER_API_RESPONSE_DESCRIPTIONS.NOT_FOUND,
  })
  @ApiResponse({
    status: IT_OWNER_HTTP_STATUS_CODES.CONFLICT,
    description: IT_OWNER_API_RESPONSE_DESCRIPTIONS.CONFLICT,
  })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateITOwnerDto,
  ): Promise<ITOwnerResponseDto> {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: IT_OWNER_API_OPERATION_SUMMARIES.DELETE })
  @ApiParam({
    name: 'id',
    description: IT_OWNER_API_PARAM_DESCRIPTIONS.ID,
    example: IT_OWNER_API_PARAM_DESCRIPTIONS.EXAMPLE_ID,
  })
  @ApiResponse({
    status: IT_OWNER_HTTP_STATUS_CODES.NO_CONTENT,
    description: IT_OWNER_API_RESPONSE_DESCRIPTIONS.DELETED,
  })
  @ApiResponse({
    status: IT_OWNER_HTTP_STATUS_CODES.NOT_FOUND,
    description: IT_OWNER_API_RESPONSE_DESCRIPTIONS.NOT_FOUND,
  })
  async delete(@Param('id') id: string): Promise<void> {
    return this.service.delete(id);
  }
}

