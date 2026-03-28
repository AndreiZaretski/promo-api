import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePromocodeDto } from './dto/create-promocode.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class PromocodeService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreatePromocodeDto) {
    try {
      return await this.prisma.promoCode.create({
        data: {
          code: dto.code,
          discount: dto.discount,
          limit: dto.limit,
          expiresAt: new Date(dto.expiresAt),
        },
      });
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === 'P2002'
      ) {
        throw new BadRequestException(`Промокод "${dto.code}" уже существует`);
      }
      return new BadRequestException(
        `Ошибка при создании промокода: ${(err as Error).message}`,
      );
    }
  }

  async findAll() {
    return await this.prisma.promoCode.findMany({
      include: { activations: true },
    });
  }

  async findOne(id: number) {
    const promo = await this.prisma.promoCode.findUnique({
      where: { id },
      include: { activations: true },
    });
    if (!promo) throw new NotFoundException('Promo not found');
    return promo;
  }

  async activate(code: string, email: string) {
    const promo = await this.prisma.promoCode.findUnique({
      where: { code },
      include: { activations: true },
    });

    if (!promo) throw new NotFoundException('Promo not found');
    if (promo.expiresAt < new Date())
      throw new BadRequestException('Promo expired');
    if (promo.activations.length >= promo.limit)
      throw new ForbiddenException('Promo limit reached');

    const existing = await this.prisma.activation.findUnique({
      where: { email_promoCodeId: { email, promoCodeId: promo.id } },
    });
    if (existing)
      throw new BadRequestException('Email already activated this promo');

    return this.prisma.activation.create({
      data: { email, promoCodeId: promo.id },
    });
  }
}
