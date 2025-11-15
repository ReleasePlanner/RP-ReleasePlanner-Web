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
} from '@nestjs/swagger';
import { CalendarService } from '../application/calendar.service';
import { CreateCalendarDto } from '../application/dto/create-calendar.dto';
import { UpdateCalendarDto } from '../application/dto/update-calendar.dto';
import { CalendarResponseDto } from '../application/dto/calendar-response.dto';
import {
  CALENDAR_API_OPERATION_SUMMARIES,
  CALENDAR_API_RESPONSE_DESCRIPTIONS,
  CALENDAR_HTTP_STATUS_CODES,
  CALENDAR_API_PARAM_DESCRIPTIONS,
} from '../constants';
import { API_TAGS } from '../../common/constants';
import { Public } from '../../auth/decorators/public.decorator';

@ApiTags(API_TAGS.CALENDARS)
@Public()
@Controller('calendars')
export class CalendarController {
  constructor(private readonly service: CalendarService) {}

  @Get()
  @ApiOperation({ summary: CALENDAR_API_OPERATION_SUMMARIES.GET_ALL })
  @ApiResponse({
    status: CALENDAR_HTTP_STATUS_CODES.OK,
    description: CALENDAR_API_RESPONSE_DESCRIPTIONS.LIST_RETRIEVED,
    type: [CalendarResponseDto],
  })
  async findAll(@Query('countryId') countryId?: string): Promise<CalendarResponseDto[]> {
    return this.service.findAll(countryId);
  }

  @Get(':id')
  @ApiOperation({ summary: CALENDAR_API_OPERATION_SUMMARIES.GET_BY_ID })
  @ApiParam({
    name: 'id',
    description: CALENDAR_API_PARAM_DESCRIPTIONS.ID,
    example: CALENDAR_API_PARAM_DESCRIPTIONS.EXAMPLE_ID,
  })
  @ApiResponse({
    status: CALENDAR_HTTP_STATUS_CODES.OK,
    description: CALENDAR_API_RESPONSE_DESCRIPTIONS.RETRIEVED,
    type: CalendarResponseDto,
  })
  @ApiResponse({
    status: CALENDAR_HTTP_STATUS_CODES.NOT_FOUND,
    description: CALENDAR_API_RESPONSE_DESCRIPTIONS.NOT_FOUND,
  })
  async findById(@Param('id') id: string): Promise<CalendarResponseDto> {
    return this.service.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: CALENDAR_API_OPERATION_SUMMARIES.CREATE })
  @ApiBody({ type: CreateCalendarDto })
  @ApiResponse({
    status: CALENDAR_HTTP_STATUS_CODES.CREATED,
    description: CALENDAR_API_RESPONSE_DESCRIPTIONS.CREATED,
    type: CalendarResponseDto,
  })
  @ApiResponse({
    status: CALENDAR_HTTP_STATUS_CODES.BAD_REQUEST,
    description: CALENDAR_API_RESPONSE_DESCRIPTIONS.INVALID_INPUT,
  })
  @ApiResponse({
    status: CALENDAR_HTTP_STATUS_CODES.CONFLICT,
    description: CALENDAR_API_RESPONSE_DESCRIPTIONS.CONFLICT,
  })
  async create(@Body() dto: CreateCalendarDto): Promise<CalendarResponseDto> {
    return this.service.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: CALENDAR_API_OPERATION_SUMMARIES.UPDATE })
  @ApiParam({
    name: 'id',
    description: CALENDAR_API_PARAM_DESCRIPTIONS.ID,
    example: CALENDAR_API_PARAM_DESCRIPTIONS.EXAMPLE_ID,
  })
  @ApiBody({ type: UpdateCalendarDto })
  @ApiResponse({
    status: CALENDAR_HTTP_STATUS_CODES.OK,
    description: CALENDAR_API_RESPONSE_DESCRIPTIONS.UPDATED,
    type: CalendarResponseDto,
  })
  @ApiResponse({
    status: CALENDAR_HTTP_STATUS_CODES.NOT_FOUND,
    description: CALENDAR_API_RESPONSE_DESCRIPTIONS.NOT_FOUND,
  })
  @ApiResponse({
    status: CALENDAR_HTTP_STATUS_CODES.CONFLICT,
    description: CALENDAR_API_RESPONSE_DESCRIPTIONS.CONFLICT,
  })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateCalendarDto,
  ): Promise<CalendarResponseDto> {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: CALENDAR_API_OPERATION_SUMMARIES.DELETE })
  @ApiParam({
    name: 'id',
    description: CALENDAR_API_PARAM_DESCRIPTIONS.ID,
    example: CALENDAR_API_PARAM_DESCRIPTIONS.EXAMPLE_ID,
  })
  @ApiResponse({
    status: CALENDAR_HTTP_STATUS_CODES.NO_CONTENT,
    description: CALENDAR_API_RESPONSE_DESCRIPTIONS.DELETED,
  })
  @ApiResponse({
    status: CALENDAR_HTTP_STATUS_CODES.NOT_FOUND,
    description: CALENDAR_API_RESPONSE_DESCRIPTIONS.NOT_FOUND,
  })
  async delete(@Param('id') id: string): Promise<void> {
    return this.service.delete(id);
  }
}

