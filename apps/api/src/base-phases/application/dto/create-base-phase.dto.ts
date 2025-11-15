/**
 * Create Base Phase DTO
 */
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, Matches } from 'class-validator';
import { BASE_PHASE_VALIDATION_MESSAGES, BASE_PHASE_API_PROPERTY_DESCRIPTIONS, BASE_PHASE_API_PROPERTY_EXAMPLES } from '../../constants';
import { VALIDATION_RULES } from '../../../common/constants';

export class CreateBasePhaseDto {
  @ApiProperty({
    description: BASE_PHASE_API_PROPERTY_DESCRIPTIONS.NAME,
    example: BASE_PHASE_API_PROPERTY_EXAMPLES.NAME,
    minLength: 1,
  })
  @IsString()
  @IsNotEmpty({ message: BASE_PHASE_VALIDATION_MESSAGES.PHASE_NAME_REQUIRED })
  name: string;

  @ApiProperty({
    description: BASE_PHASE_API_PROPERTY_DESCRIPTIONS.COLOR,
    example: BASE_PHASE_API_PROPERTY_EXAMPLES.COLOR,
    pattern: '^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$',
  })
  @IsString()
  @IsNotEmpty({ message: BASE_PHASE_VALIDATION_MESSAGES.PHASE_COLOR_REQUIRED })
  @Matches(VALIDATION_RULES.COLOR.PATTERN, {
    message: BASE_PHASE_VALIDATION_MESSAGES.PHASE_COLOR_INVALID,
  })
  color: string;
}

