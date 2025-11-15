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
import {
  PRODUCT_API_OPERATION_SUMMARIES,
  PRODUCT_API_RESPONSE_DESCRIPTIONS,
  PRODUCT_HTTP_STATUS_CODES,
  PRODUCT_API_PARAM_DESCRIPTIONS,
} from '../constants';
import { API_TAGS } from '../../common/constants';
import { Public } from '../../auth/decorators/public.decorator';

@ApiTags(API_TAGS.PRODUCTS)
@Controller('products')
@Public() // TODO: Remove this in production - temporary for development
export class ProductController {
  constructor(private readonly service: ProductService) {}

  @Get()
  @ApiOperation({ summary: PRODUCT_API_OPERATION_SUMMARIES.GET_ALL })
  @ApiResponse({
    status: PRODUCT_HTTP_STATUS_CODES.OK,
    description: PRODUCT_API_RESPONSE_DESCRIPTIONS.LIST_RETRIEVED,
    type: [ProductResponseDto],
  })
  async findAll(): Promise<ProductResponseDto[]> {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: PRODUCT_API_OPERATION_SUMMARIES.GET_BY_ID })
  @ApiParam({
    name: 'id',
    description: PRODUCT_API_PARAM_DESCRIPTIONS.ID,
    example: PRODUCT_API_PARAM_DESCRIPTIONS.EXAMPLE_ID,
  })
  @ApiResponse({
    status: PRODUCT_HTTP_STATUS_CODES.OK,
    description: PRODUCT_API_RESPONSE_DESCRIPTIONS.RETRIEVED,
    type: ProductResponseDto,
  })
  @ApiResponse({
    status: PRODUCT_HTTP_STATUS_CODES.NOT_FOUND,
    description: PRODUCT_API_RESPONSE_DESCRIPTIONS.NOT_FOUND,
  })
  async findById(@Param('id') id: string): Promise<ProductResponseDto> {
    return this.service.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: PRODUCT_API_OPERATION_SUMMARIES.CREATE })
  @ApiBody({ type: CreateProductDto })
  @ApiResponse({
    status: PRODUCT_HTTP_STATUS_CODES.CREATED,
    description: PRODUCT_API_RESPONSE_DESCRIPTIONS.CREATED,
    type: ProductResponseDto,
  })
  @ApiResponse({
    status: PRODUCT_HTTP_STATUS_CODES.BAD_REQUEST,
    description: PRODUCT_API_RESPONSE_DESCRIPTIONS.INVALID_INPUT,
  })
  @ApiResponse({
    status: PRODUCT_HTTP_STATUS_CODES.CONFLICT,
    description: PRODUCT_API_RESPONSE_DESCRIPTIONS.CONFLICT,
  })
  async create(@Body() dto: CreateProductDto): Promise<ProductResponseDto> {
    return this.service.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: PRODUCT_API_OPERATION_SUMMARIES.UPDATE })
  @ApiParam({
    name: 'id',
    description: PRODUCT_API_PARAM_DESCRIPTIONS.ID,
    example: PRODUCT_API_PARAM_DESCRIPTIONS.EXAMPLE_ID,
  })
  @ApiBody({ type: UpdateProductDto })
  @ApiResponse({
    status: PRODUCT_HTTP_STATUS_CODES.OK,
    description: PRODUCT_API_RESPONSE_DESCRIPTIONS.UPDATED,
    type: ProductResponseDto,
  })
  @ApiResponse({
    status: PRODUCT_HTTP_STATUS_CODES.NOT_FOUND,
    description: PRODUCT_API_RESPONSE_DESCRIPTIONS.NOT_FOUND,
  })
  @ApiResponse({
    status: PRODUCT_HTTP_STATUS_CODES.CONFLICT,
    description: PRODUCT_API_RESPONSE_DESCRIPTIONS.CONFLICT,
  })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
  ): Promise<ProductResponseDto> {
    try {
      return await this.service.update(id, dto);
    } catch (error) {
      console.error('ProductController.update error:', error);
      console.error('Request payload:', JSON.stringify(dto, null, 2));
      throw error;
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: PRODUCT_API_OPERATION_SUMMARIES.DELETE })
  @ApiParam({
    name: 'id',
    description: PRODUCT_API_PARAM_DESCRIPTIONS.ID,
    example: PRODUCT_API_PARAM_DESCRIPTIONS.EXAMPLE_ID,
  })
  @ApiResponse({
    status: PRODUCT_HTTP_STATUS_CODES.NO_CONTENT,
    description: PRODUCT_API_RESPONSE_DESCRIPTIONS.DELETED,
  })
  @ApiResponse({
    status: PRODUCT_HTTP_STATUS_CODES.NOT_FOUND,
    description: PRODUCT_API_RESPONSE_DESCRIPTIONS.NOT_FOUND,
  })
  async delete(@Param('id') id: string): Promise<void> {
    return this.service.delete(id);
  }
}

