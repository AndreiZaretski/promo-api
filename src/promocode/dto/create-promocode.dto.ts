import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsDateString } from 'class-validator';

export class CreatePromocodeDto {
  @ApiProperty()
  @IsString()
  code!: string;

  @ApiProperty()
  @IsInt()
  discount!: number;

  @ApiProperty()
  @IsInt()
  limit!: number;

  @ApiProperty({
    type: String,
    format: 'date-time',
    description: 'Дата окончания действия промокода',
  })
  @IsDateString()
  expiresAt!: string;
}
