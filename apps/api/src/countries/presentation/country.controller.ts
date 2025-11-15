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
import { CountryService } from '../application/country.service';
import { CreateCountryDto } from '../application/dto/create-country.dto';
import { UpdateCountryDto } from '../application/dto/update-country.dto';
import { CountryResponseDto } from '../application/dto/country-response.dto';
import { API_TAGS } from '../../common/constants';
import { Public } from '../../auth/decorators/public.decorator';

@ApiTags(API_TAGS.COUNTRIES || 'Countries')
@Controller('countries')
@Public() // TODO: Remove this in production - temporary for development
export class CountryController {
  constructor(private readonly service: CountryService) {}

  @Get()
  @ApiOperation({ summary: 'Get all countries' })
  @ApiResponse({
    status: 200,
    description: 'List of countries',
    type: [CountryResponseDto],
  })
  async findAll(): Promise<CountryResponseDto[]> {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get country by ID' })
  @ApiParam({ name: 'id', description: 'Country ID' })
  @ApiResponse({
    status: 200,
    description: 'Country details',
    type: CountryResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Country not found' })
  async findById(@Param('id') id: string): Promise<CountryResponseDto> {
    return this.service.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new country' })
  @ApiBody({ type: CreateCountryDto })
  @ApiResponse({
    status: 201,
    description: 'Country created successfully',
    type: CountryResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 409, description: 'Country already exists' })
  async create(@Body() dto: CreateCountryDto): Promise<CountryResponseDto> {
    return this.service.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a country' })
  @ApiParam({ name: 'id', description: 'Country ID' })
  @ApiBody({ type: UpdateCountryDto })
  @ApiResponse({
    status: 200,
    description: 'Country updated successfully',
    type: CountryResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Country not found' })
  @ApiResponse({ status: 409, description: 'Country name or code already exists' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateCountryDto,
  ): Promise<CountryResponseDto> {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a country' })
  @ApiParam({ name: 'id', description: 'Country ID' })
  @ApiResponse({ status: 204, description: 'Country deleted successfully' })
  @ApiResponse({ status: 404, description: 'Country not found' })
  async delete(@Param('id') id: string): Promise<void> {
    return this.service.delete(id);
  }
}

