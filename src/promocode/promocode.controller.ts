import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  ValidationPipe,
  UsePipes,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PromocodeService } from './promocode.service';
import { CreatePromocodeDto } from './dto/create-promocode.dto';
import { ActivatePromocodeDto } from './dto/activate-promocode.dto';

@ApiTags('promocodes')
@Controller('promocodes')
export class PromocodeController {
  constructor(private readonly service: PromocodeService) {}

  @Post()
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      exceptionFactory: (errors) => {
        const messages = errors.map(
          (err) =>
            `${err.property} — ${Object.values(err.constraints ?? {}).join(', ')}`,
        );
        return new BadRequestException(
          `Некорректные данные: ${messages.join('; ')}`,
        );
      },
    }),
  )
  create(@Body() dto: CreatePromocodeDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(Number(id));
  }

  @Post(':code/activate')
  activate(@Param('code') code: string, @Body() dto: ActivatePromocodeDto) {
    return this.service.activate(code, dto.email);
  }
}
