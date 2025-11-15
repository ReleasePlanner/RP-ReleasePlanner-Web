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
import { FeatureCategoryService } from '../application/feature-category.service';
import { CreateFeatureCategoryDto } from '../application/dto/create-feature-category.dto';
import { UpdateFeatureCategoryDto } from '../application/dto/update-feature-category.dto';
import { FeatureCategoryResponseDto } from '../application/dto/feature-category-response.dto';
import { API_TAGS } from '../../common/constants';
import { Public } from '../../auth/decorators/public.decorator';

@ApiTags(API_TAGS.FEATURE_CATEGORIES)
@Controller('feature-categories')
@Public() // TODO: Remove this in production - temporary for development
export class FeatureCategoryController {
  constructor(private readonly service: FeatureCategoryService) {}

  @Get()
  @ApiOperation({ summary: 'Get all feature categories' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of feature categories retrieved successfully',
    type: [FeatureCategoryResponseDto],
  })
  async findAll(): Promise<FeatureCategoryResponseDto[]> {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get feature category by ID' })
  @ApiParam({
    name: 'id',
    description: 'Feature category ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Feature category retrieved successfully',
    type: FeatureCategoryResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Feature category not found',
  })
  async findById(@Param('id') id: string): Promise<FeatureCategoryResponseDto> {
    return this.service.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new feature category' })
  @ApiBody({ type: CreateFeatureCategoryDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Feature category created successfully',
    type: FeatureCategoryResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Feature category with this name already exists',
  })
  async create(@Body() dto: CreateFeatureCategoryDto): Promise<FeatureCategoryResponseDto> {
    return this.service.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a feature category' })
  @ApiParam({
    name: 'id',
    description: 'Feature category ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({ type: UpdateFeatureCategoryDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Feature category updated successfully',
    type: FeatureCategoryResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Feature category not found',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Feature category with this name already exists',
  })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateFeatureCategoryDto,
  ): Promise<FeatureCategoryResponseDto> {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a feature category' })
  @ApiParam({
    name: 'id',
    description: 'Feature category ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Feature category deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Feature category not found',
  })
  async delete(@Param('id') id: string): Promise<void> {
    return this.service.delete(id);
  }
}

