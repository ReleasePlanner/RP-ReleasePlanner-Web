/**
 * Create Base Phase DTO
 */
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, Matches } from 'class-validator';

export class CreateBasePhaseDto {
  @ApiProperty({
    description: 'Nombre de la fase base',
    example: 'Análisis',
    minLength: 1,
  })
  @IsString()
  @IsNotEmpty({ message: 'Phase name is required' })
  name: string;

  @ApiProperty({
    description: 'Color de la fase en formato hexadecimal',
    example: '#1976D2',
    pattern: '^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$',
  })
  @IsString()
  @IsNotEmpty({ message: 'Phase color is required' })
  @Matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
    message: 'Color must be a valid hex color (e.g., #FF5733)',
  })
  color: string;

  @ApiProperty({
    description: 'Categoría de la fase (opcional)',
    example: 'Requerimientos',
    required: false,
  })
  @IsString()
  @IsOptional()
  category?: string;
}

