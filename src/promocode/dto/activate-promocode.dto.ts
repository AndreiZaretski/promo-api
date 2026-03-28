import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class ActivatePromocodeDto {
  @ApiProperty()
  @IsEmail()
  email!: string;
}
