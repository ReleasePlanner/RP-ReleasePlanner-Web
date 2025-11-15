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
import {
  FEATURE_API_OPERATION_SUMMARIES,
  FEATURE_API_RESPONSE_DESCRIPTIONS,
  FEATURE_HTTP_STATUS_CODES,
  FEATURE_API_PARAM_DESCRIPTIONS,
} from '../constants';
import { API_TAGS } from '../../common/constants';
import { Public } from '../../auth/decorators/public.decorator';

@ApiTags(API_TAGS.FEATURES)
@Controller('features')
@Public() // TODO: Remove this in production - temporary for development
export class FeatureController {
  constructor(private readonly service: FeatureService) {}

  @Get()
  @ApiOperation({ summary: FEATURE_API_OPERATION_SUMMARIES.GET_ALL })
  @ApiQuery({
    name: 'productId',
    required: false,
    description: FEATURE_API_PARAM_DESCRIPTIONS.PRODUCT_ID_QUERY,
    example: FEATURE_API_PARAM_DESCRIPTIONS.PRODUCT_ID_EXAMPLE,
  })
  @ApiResponse({
    status: FEATURE_HTTP_STATUS_CODES.OK,
    description: FEATURE_API_RESPONSE_DESCRIPTIONS.LIST_RETRIEVED,
    type: [FeatureResponseDto],
  })
  async findAll(@Query('productId') productId?: string): Promise<FeatureResponseDto[]> {
    if (productId) {
      return this.service.findByProductId(productId);
    }
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: FEATURE_API_OPERATION_SUMMARIES.GET_BY_ID })
  @ApiParam({
    name: 'id',
    description: FEATURE_API_PARAM_DESCRIPTIONS.ID,
    example: FEATURE_API_PARAM_DESCRIPTIONS.EXAMPLE_ID,
  })
  @ApiResponse({
    status: FEATURE_HTTP_STATUS_CODES.OK,
    description: FEATURE_API_RESPONSE_DESCRIPTIONS.RETRIEVED,
    type: FeatureResponseDto,
  })
  @ApiResponse({
    status: FEATURE_HTTP_STATUS_CODES.NOT_FOUND,
    description: FEATURE_API_RESPONSE_DESCRIPTIONS.NOT_FOUND,
  })
  async findById(@Param('id') id: string): Promise<FeatureResponseDto> {
    return this.service.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: FEATURE_API_OPERATION_SUMMARIES.CREATE })
  @ApiBody({ type: CreateFeatureDto })
  @ApiResponse({
    status: FEATURE_HTTP_STATUS_CODES.CREATED,
    description: FEATURE_API_RESPONSE_DESCRIPTIONS.CREATED,
    type: FeatureResponseDto,
  })
  @ApiResponse({
    status: FEATURE_HTTP_STATUS_CODES.BAD_REQUEST,
    description: FEATURE_API_RESPONSE_DESCRIPTIONS.INVALID_INPUT,
  })
  @ApiResponse({
    status: FEATURE_HTTP_STATUS_CODES.CONFLICT,
    description: FEATURE_API_RESPONSE_DESCRIPTIONS.CONFLICT,
  })
  async create(@Body() dto: CreateFeatureDto): Promise<FeatureResponseDto> {
    try {
      console.log('FeatureController.create - Request payload:', JSON.stringify(dto, null, 2));
      return await this.service.create(dto);
    } catch (error) {
      console.error('FeatureController.create - Error:', error);
      console.error('FeatureController.create - Error stack:', error instanceof Error ? error.stack : 'No stack');
      throw error;
    }
  }

  @Put(':id')
  @ApiOperation({ summary: FEATURE_API_OPERATION_SUMMARIES.UPDATE })
  @ApiParam({
    name: 'id',
    description: FEATURE_API_PARAM_DESCRIPTIONS.ID,
    example: FEATURE_API_PARAM_DESCRIPTIONS.EXAMPLE_ID,
  })
  @ApiBody({ type: UpdateFeatureDto })
  @ApiResponse({
    status: FEATURE_HTTP_STATUS_CODES.OK,
    description: FEATURE_API_RESPONSE_DESCRIPTIONS.UPDATED,
    type: FeatureResponseDto,
  })
  @ApiResponse({
    status: FEATURE_HTTP_STATUS_CODES.NOT_FOUND,
    description: FEATURE_API_RESPONSE_DESCRIPTIONS.NOT_FOUND,
  })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateFeatureDto,
  ): Promise<FeatureResponseDto> {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: FEATURE_API_OPERATION_SUMMARIES.DELETE })
  @ApiParam({
    name: 'id',
    description: FEATURE_API_PARAM_DESCRIPTIONS.ID,
    example: FEATURE_API_PARAM_DESCRIPTIONS.EXAMPLE_ID,
  })
  @ApiResponse({
    status: FEATURE_HTTP_STATUS_CODES.NO_CONTENT,
    description: FEATURE_API_RESPONSE_DESCRIPTIONS.DELETED,
  })
  @ApiResponse({
    status: FEATURE_HTTP_STATUS_CODES.NOT_FOUND,
    description: FEATURE_API_RESPONSE_DESCRIPTIONS.NOT_FOUND,
  })
  async delete(@Param('id') id: string): Promise<void> {
    return this.service.delete(id);
  }
}

